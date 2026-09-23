import sharp from "sharp";
import path from "path";
import fs from "fs";
import os from "os";
import crypto from "crypto";

const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 630;
const MAX_SIZE_BYTES = 480 * 1024;

const SEO_CROPS: Record<string, number> = {
  seo_image_16x9: 16 / 9,
  seo_image_4x3: 4 / 3,
  seo_image_1x1: 1,
};

async function fetchFileEntity(
  strapi: any,
  media: any,
): Promise<Buffer | null> {
  if (!media) return null;
  const id = media.id || media;
  if (!id) return null;
  const fileEntity = await strapi.db
    .query("plugin::upload.file")
    .findOne({ where: { id } });
  if (!fileEntity?.url) return null;
  const localPath = path.join(
    strapi.dirs.static.public,
    fileEntity.url.replace(/^\/uploads\//, "uploads/"),
  );
  if (!fs.existsSync(localPath)) return null;
  return fs.readFileSync(localPath);
}

async function getFileEntity(strapi: any, media: any) {
  const id = media?.id || media;
  if (!id) return null;
  return strapi.db.query("plugin::upload.file").findOne({ where: { id } });
}

function readLocalFile(strapi: any, fileEntity: any): Buffer | null {
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
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: "cover",
        position: "attention",
      })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    if (outputBuffer.byteLength <= MAX_SIZE_BYTES) break;
    quality -= 12;
  }
  return outputBuffer!;
}

async function cropToRatio(
  inputBuffer: Buffer,
  ratio: number,
): Promise<Buffer> {
  const { width = 0, height = 0 } = await sharp(inputBuffer).metadata();
  let cropWidth = width;
  let cropHeight = Math.round(width / ratio);
  if (cropHeight > height) {
    cropHeight = height;
    cropWidth = Math.round(height * ratio);
  }
  return sharp(inputBuffer)
    .resize(cropWidth, cropHeight, { fit: "cover", position: "attention" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
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

    const result = await strapi
      .documents(uid)
      .findOne({ documentId, populate });
    if (!result) return;

    const buffer = await resolveCoverBuffer(
      strapi,
      result,
      primaryField,
      fallbackField,
    );
    if (!buffer) return;

    const compressed = await compressToOgSize(buffer);

    tmpPath = path.join(
      os.tmpdir(),
      `og_${documentId}_${crypto.randomUUID()}.jpg`,
    );
    fs.writeFileSync(tmpPath, compressed);

    const uploadService = strapi.plugin("upload").service("upload");
    const uploadedFiles = await uploadService.upload({
      data: {},
      files: {
        filepath: tmpPath,
        originalFilename: `og_${documentId}.jpg`,
        mimetype: "image/jpeg",
        size: compressed.byteLength,
      },
    });

    const mediaId = Array.isArray(uploadedFiles)
      ? uploadedFiles[0]?.id
      : uploadedFiles?.id;
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
    strapi.log.error(
      `[og-image-optimizer] ${uid} #${documentId}: ошибка — ${err.message}`,
    );
  } finally {
    if (tmpPath && fs.existsSync(tmpPath)) {
      fs.unlinkSync(tmpPath);
    }
  }
}

export async function generateSeoImageCrops(
  strapi: any,
  uid: string,
  documentId: string,
  primaryField?: string,
  fallbackField?: string,
) {
  const tmpPaths: string[] = [];
  try {
    const populate: Record<string, any> = {
      SEO: { populate: ["seo_image", ...Object.keys(SEO_CROPS)] },
    };
    if (primaryField) populate[primaryField] = true;
    if (fallbackField) populate[fallbackField] = true;

    const result = await strapi
      .documents(uid)
      .findOne({ documentId, populate });
    if (!result) {
      strapi.log.warn(
        `[seo-image-crops] ${uid} #${documentId}: запись не найдена`,
      );
      return;
    }

    let source = await getFileEntity(strapi, result.SEO?.seo_image);
    if (!source && primaryField)
      source = await getFileEntity(strapi, result[primaryField]);
    if (!source && fallbackField)
      source = await getFileEntity(strapi, result[fallbackField]);
    if (!source) {
      strapi.log.warn(
        `[seo-image-crops] ${uid} #${documentId}: нет исходной картинки`,
      );
      return;
    }

    const marker = `src${source.id}_`;
    const alreadyDone = Object.keys(SEO_CROPS).every((field) =>
      result.SEO?.[field]?.name?.includes(marker),
    );
    if (alreadyDone) return;

    const buffer = readLocalFile(strapi, source);
    if (!buffer) {
      strapi.log.warn(
        `[seo-image-crops] ${uid} #${documentId}: файл не найден на диске (${source.url})`,
      );
      return;
    }

    const uploadService = strapi.plugin("upload").service("upload");
    const cropIds: Record<string, number> = {};

    for (const [field, ratio] of Object.entries(SEO_CROPS)) {
      const cropped = await cropToRatio(buffer, ratio);
      const tmpPath = path.join(
        os.tmpdir(),
        `${field}_${documentId}_${crypto.randomUUID()}.jpg`,
      );
      fs.writeFileSync(tmpPath, cropped);
      tmpPaths.push(tmpPath);

      const uploaded = await uploadService.upload({
        data: {},
        files: {
          filepath: tmpPath,
          originalFilename: `${field}_${marker}${documentId}.jpg`,
          mimetype: "image/jpeg",
          size: cropped.byteLength,
        },
      });

      const mediaId = Array.isArray(uploaded) ? uploaded[0]?.id : uploaded?.id;
      if (mediaId) cropIds[field] = mediaId;
    }

    if (Object.keys(cropIds).length === 0) {
      strapi.log.warn(
        `[seo-image-crops] ${uid} #${documentId}: загрузка не вернула id`,
      );
      return;
    }

    const existingSeo = result.SEO || {};
    const mediaFields = ["seo_image", ...Object.keys(SEO_CROPS)];
    const cleanSeo = Object.fromEntries(
      Object.entries(existingSeo).filter(
        ([key]) => !["id", "__component", ...mediaFields].includes(key),
      ),
    );

    await strapi.documents(uid).update({
      documentId,
      data: {
        SEO: {
          ...cleanSeo,
          seo_image: existingSeo.seo_image?.id ?? null,
          ...cropIds,
        },
      },
    });

    strapi.log.info(`[seo-image-crops] ${uid} #${documentId}: кропы обновлены`);
  } catch (err: any) {
    strapi.log.error(
      `[seo-image-crops] ${uid} #${documentId}: ошибка — ${err.message}`,
    );
  } finally {
    for (const p of tmpPaths) {
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
  }
}
