import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import fetch from "node-fetch";
import FormData from "form-data";
import "dotenv/config";

const STRAPI_URL = process.env.STRAPI_URL || "https://api.zhkh24.kz";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const LOCAL_UPLOADS_DIR =
  process.env.LOCAL_UPLOADS_DIR || "/var/www/project/strapi_hcs/public/uploads";

const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 630;
const MAX_SIZE_BYTES = 480 * 1024;

const COLLECTIONS = {
  events: { endpoint: "events", coverField: "desc_img" },
  blogs: { endpoint: "blogs", coverField: "back_img" },
  articles: { endpoint: "articles", coverField: "desc_img" },
  news: { endpoint: "news", coverField: "desc_img" },
};

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const ONLY = args.find((a) => a.startsWith("--only="))?.split("=")[1];
const LIMIT = Number(args.find((a) => a.startsWith("--limit="))?.split("=")[1]) || null;

function authHeaders(extra = {}) {
  return { Authorization: `Bearer ${STRAPI_TOKEN}`, ...extra };
}

function resolveCurrentImage(item, coverField) {
  const og = item.OG?.og_image;
  if (og) {
    const url = og.formats?.large?.url || og.formats?.medium?.url || og.url;
    if (url) return { url, source: "og" };
  }
  const cover = item[coverField];
  if (cover) {
    const url = cover.formats?.large?.url || cover.formats?.medium?.url || cover.url;
    if (url) return { url, source: "cover" };
  }
  return { url: null, source: null };
}

function isAbsoluteUrl(url) {
  return /^https?:\/\//i.test(url);
}

async function fetchImageBuffer(url) {
  if (isAbsoluteUrl(url)) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Не удалось скачать ${url}: HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  const localPath = path.join(LOCAL_UPLOADS_DIR, url.replace(/^\/uploads\//, ""));
  if (!fs.existsSync(localPath)) {
    throw new Error(`Локальный файл не найден: ${localPath} (url: ${url})`);
  }
  return fs.readFileSync(localPath);
}

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

async function uploadToStrapi(buffer, filename) {
  const form = new FormData();
  form.append("files", buffer, { filename, contentType: "image/jpeg" });
  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: "POST",
    headers: authHeaders(form.getHeaders()),
    body: form,
  });
  if (!res.ok) throw new Error(`Upload failed (${res.status}): ${await res.text()}`);
  const uploaded = await res.json();
  return uploaded[0]?.id;
}

async function updateOgImage(endpoint, documentId, item, newMediaId) {
  const existingOg = item.OG;

  // Strapi валидирует всю запись при PUT, поэтому передаём текущие
  // required-текстовые поля как есть, лишь подстраховываясь от null.
  const safeguard = {};
  for (const field of ["title_ru", "desc_ru"]) {
    if (field in item) {
      safeguard[field] = item[field] ?? "";
    }
  }

  const body = {
    data: {
      ...safeguard,
      OG: {
        ...(existingOg
          ? Object.fromEntries(
              Object.entries(existingOg).filter(
                ([key]) => !["id", "og_image", "__component"].includes(key),
              ),
            )
          : {}),
        og_image: newMediaId,
      },
    },
  };
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}/${documentId}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Update failed (${res.status}): ${await res.text()}`);
  return res.json();
}

async function fetchAllItems(endpoint, coverField) {
  const pageSize = 50;
  let page = 1;
  let all = [];
  while (true) {
    const url =
      `${STRAPI_URL}/api/${endpoint}` +
      `?populate[${coverField}][populate]=*` +
      `&populate[OG][populate][og_image][populate]=*` +
      `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) throw new Error(`Не удалось получить ${endpoint}: HTTP ${res.status}`);
    const json = await res.json();
    all = all.concat(json.data || []);
    const pageCount = json.meta?.pagination?.pageCount || 1;
    if (page >= pageCount) break;
    page++;
  }
  return all;
}

async function processItem(collectionKey, item) {
  const { endpoint, coverField } = COLLECTIONS[collectionKey];
  const documentId = item.documentId || item.id;
  const label = `[${collectionKey} #${documentId}]`;

  const { url, source } = resolveCurrentImage(item, coverField);

  if (!url) {
    console.log(`${label} пропуск — нет ни og_image, ни ${coverField}`);
    return "skipped";
  }

  console.log(`${label} источник: ${source === "og" ? "OG.og_image" : coverField} -> ${url}`);

  if (DRY_RUN) {
    console.log(`${label} [dry-run] будет сжато и записано в OG.og_image`);
    return "dry-run";
  }

  try {
    const original = await fetchImageBuffer(url);
    const compressed = await compressToOgSize(original);
    console.log(
      `${label} сжато: ${(original.byteLength / 1024).toFixed(0)}KB -> ${(compressed.byteLength / 1024).toFixed(0)}KB`,
    );
    const filename = `og_${collectionKey}_${documentId}.jpg`;
    const mediaId = await uploadToStrapi(compressed, filename);
    await updateOgImage(endpoint, documentId, item, mediaId);
    console.log(`${label} готово — OG.og_image обновлён (media #${mediaId})`);
    return "ok";
  } catch (err) {
    console.error(`${label} ОШИБКА: ${err.message}`);
    return "error";
  }
}

async function run() {
  if (!STRAPI_TOKEN) {
    console.error("Не задан STRAPI_TOKEN в .env");
    process.exit(1);
  }
  const collectionsToRun = ONLY ? [ONLY] : Object.keys(COLLECTIONS);
  const summary = {};

  for (const key of collectionsToRun) {
    if (!COLLECTIONS[key]) {
      console.error(`Неизвестная коллекция: ${key}`);
      continue;
    }
    console.log(`\n=== Коллекция: ${key} ===`);
let items = await fetchAllItems(COLLECTIONS[key].endpoint, COLLECTIONS[key].coverField);
    if (LIMIT) items = items.slice(0, LIMIT);
    console.log(`Найдено записей: ${items.length}`);

    for (const item of items) {
      const result = await processItem(key, item);
      summary[result] = (summary[result] || 0) + 1;
    }
  }

  console.log("\n=== Итог ===");
  console.log(summary);
}

run().catch((err) => {
  console.error("Критическая ошибка:", err);
  process.exit(1);
});
