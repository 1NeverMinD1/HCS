import sharp from "sharp";
import path from "path";
import fs from "fs";
import os from "os";
import crypto from "crypto";

const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 630;
const MAX_SIZE_BYTES = 480 * 1024;

async function fetchFileEntity(strapi: any, media: any): Promise<Buffer | null> {
  if (!media) return null;
  const id = media.id || media;
  if (!id) return null;
  const fileEntity = await strapi.db.query("plugin::upload.file").findOne({ where: { id } });
  if (!fileEntity?.url) return null;
  const localPath = path.join(
    strapi.dirs.static.public,
    fileEntity.url.replace(/^\/uploads\//, "uploads/"),
  );
  if (!fs.existsSync(localPath)) return null;
  return fs.readFileSync(localPath);
}

async function resolveCoverBuffer(
  strapi: any,
  result: any,
  primaryField?: string,
  fallbackField?: string,
): Promise<Buffer | null> {
  if (result.OG?.og_image) return null;

  const seoBuffer = await fetchFileEntity(strapi, result.SEO?.seo_image);
  if (seoBuffer) return seoBuffer;

  if (primaryField) {
    const primaryBuffer = await fetchFileEntity(strapi, result[primaryField]);
    if (primaryBuffer) return primaryBuffer;
  }
  if (fallbackField) {
    const fallbackBuffer = await fetchFileEntity(strapi, result[fallbackField]);
    if (fallbackBuffer) return fallbackBuffer;
  }

  return null;
}

async function compressToOgSize(inputBuffer: Buffer): Promise<Buffer> {
  let quality = 82;
  let outputBuffer: Buffer;
  for (let attempt = 0; attempt < 6; attempt++) {
    outputBuffer = await sharp(inputBuffer)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: "cover", position: "attention" })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    if (outputBuffer.byteLength <= MAX_SIZE_BYTES) break;
    quality -= 12;
  }
  return outputBuffer!;
}

export async function optimizeOgImage(
  strapi: any,
  uid: string,
  documentId: string,
  primaryField?: string,
  fallbackField?: string,
) {
  let tmpPath: string | null = null;
  try {
    const populate: Record<string, any> = {
      OG: { populate: ["og_image"] },
      SEO: { populate: ["seo_image"] },
    };
    if (primaryField) populate[primaryField] = true;
    if (fallbackField) populate[fallbackField] = true;

    const result = await strapi.documents(uid).findOne({ documentId, populate });
    if (!result) return;

    const buffer = await resolveCoverBuffer(strapi, result, primaryField, fallbackField);
    if (!buffer) return;

    const compressed = await compressToOgSize(buffer);

    tmpPath = path.join(os.tmpdir(), `og_${documentId}_${crypto.randomUUID()}.jpg`);
    fs.writeFileSync(tmpPath, compressed);

    const uploadService = strapi.plugin("upload").service("upload");
    const uploadedFiles = await uploadService.upload({
      data: {},
      files: {
        path: tmpPath,
        name: `og_${documentId}.jpg`,
        type: "image/jpeg",
        size: compressed.byteLength,
      },
    });

    const mediaId = Array.isArray(uploadedFiles) ? uploadedFiles[0]?.id : uploadedFiles?.id;
    if (!mediaId) return;

    const existingOg = result.OG || {};
    const cleanOg = Object.fromEntries(
      Object.entries(existingOg).filter(
        ([key]) => !["id", "og_image", "__component"].includes(key),
      ),
    );

    await strapi.documents(uid).update({
      documentId,
      data: {
        OG: {
          ...cleanOg,
          og_image: mediaId,
        },
      },
    });

    strapi.log.info(
      `[og-image-optimizer] ${uid} #${documentId}: OG.og_image обновлён (media #${mediaId})`,
    );
  } catch (err: any) {
    strapi.log.error(`[og-image-optimizer] ${uid} #${documentId}: ошибка — ${err.message}`);
  } finally {
    if (tmpPath && fs.existsSync(tmpPath)) {
      fs.unlinkSync(tmpPath);
    }
  }
}
