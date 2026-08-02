"use strict";

const sharp = require("sharp");

const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 630;
const MAX_SIZE_BYTES = 480 * 1024;

/**
 * Определяет реальную картинку записи по фолбэк-цепочке:
 * OG.og_image -> coverField (desc_img/back_img)
 * Возвращает Buffer с картинкой, либо null, если взять нечего.
 */
async function resolveCoverBuffer(strapi, result, coverField) {
  const og = result.OG?.og_image;
  const cover = result[coverField];

  // Если OG.og_image уже стоит — трогать нечего, это уже оптимизированная версия
  // (или заполнена вручную) — хук не должен её перезаписывать бесконечно.
  if (og) return null;

  if (!cover) return null;

  const fileEntity = await strapi.db.query("plugin::upload.file").findOne({
    where: { id: cover.id || cover },
  });

  if (!fileEntity) return null;

  const relativeUrl = fileEntity.url;
  if (!relativeUrl) return null;

  const path = require("path");
  const fs = require("fs");

  const localPath = path.join(
    strapi.dirs.static.public,
    relativeUrl.replace(/^\/uploads\//, "uploads/"),
  );

  if (!fs.existsSync(localPath)) return null;

  return fs.readFileSync(localPath);
}

/**
 * Сжимает буфер изображения до JPEG 1200x630, подбирая качество.
 */
async function compressToOgSize(inputBuffer) {
  let quality = 82;
  let outputBuffer;

  for (let attempt = 0; attempt < 6; attempt++) {
    outputBuffer = await sharp(inputBuffer)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: "cover", position: "attention" })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();

    if (outputBuffer.byteLength <= MAX_SIZE_BYTES) break;
    quality -= 12;
  }

  return outputBuffer;
}

/**
 * Основная функция: если у записи нет OG.og_image, но есть обложка —
 * сжимает обложку и записывает результат в OG.og_image.
 *
 * Вызывать из lifecycle-хука после создания/обновления записи.
 */
async function optimizeOgImage(strapi, uid, documentId, coverField) {
  try {
    const result = await strapi.documents(uid).findOne({
      documentId,
      populate: {
        OG: { populate: ["og_image"] },
        [coverField]: true,
    cover_img: true,
      },
    });

    if (!result) return;

    const actualCoverField = uid === "api::event.event" && result.cover_img ? "cover_img" : coverField;

    const buffer = await resolveCoverBuffer(strapi, result, actualCoverField);
    if (!buffer) return; // og_image уже есть, либо обложки нет вовсе

    const compressed = await compressToOgSize(buffer);

    const uploadService = strapi.plugin("upload").service("upload");
    const uploadedFiles = await uploadService.upload({
      data: {},
      files: {
        path: null,
        buffer: compressed,
        name: `og_${documentId}.jpg`,
        type: "image/jpeg",
        size: compressed.byteLength,
      },
    });

    // strapi upload.service ожидает файл на диске в некоторых версиях;
    // на случай проблем используем универсальный низкоуровневый путь ниже.
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

    strapi.log.info(`[og-image-optimizer] ${uid} #${documentId}: OG.og_image обновлён (media #${mediaId})`);
  } catch (err) {
    strapi.log.error(`[og-image-optimizer] ${uid} #${documentId}: ошибка — ${err.message}`);
  }
}

module.exports = { optimizeOgImage };
