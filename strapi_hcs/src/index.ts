import { execFile } from "child_process";
import { pingIndexNow } from "./utils/indexnow";
import { ROUTE_SEGMENT } from "./utils/routeSegments";
import {
  optimizeOgImage,
  generateSeoImageCrops,
} from "./utils/og-image-optimizer";
import { sendToTelegramChannel } from "./utils/telegram";
import sharp from "sharp";
import fs from "fs";

const BASE_URL = "https://zhkh24.kz";
const MEDIA_BASE_URL = "https://api.zhkh24.kz";
const PROJECT_ROOT = "/var/www/project";
const DEBOUNCE_MS = 15000;

async function convertFileEntryToWebp(strapi: any, file: any) {
  if (!file || !["image/png", "image/jpeg"].includes(file.mime)) return;

  const uploadDir = strapi.dirs.static.public + "/uploads";

  async function convertOne(hash: string, ext: string) {
    const inputPath = `${uploadDir}/${hash}${ext}`;
    if (!fs.existsSync(inputPath)) return null;

    const newHash = hash;
    const outputPath = `${uploadDir}/${newHash}.webp`;

    const info = await sharp(inputPath)
      .webp({ quality: 82 })
      .toFile(outputPath);
    fs.unlinkSync(inputPath);

    return {
      hash: newHash,
      ext: ".webp",
      mime: "image/webp",
      url: `/uploads/${newHash}.webp`,
      size: Math.round((info.size / 1024) * 100) / 100,
      sizeInBytes: info.size,
      width: info.width,
      height: info.height,
    };
  }

  const mainResult = await convertOne(file.hash, file.ext);
  if (!mainResult) return;

  const newFormats: Record<string, any> = {};
  if (file.formats) {
    for (const key of Object.keys(file.formats)) {
      const fmt = file.formats[key];
      const converted = await convertOne(fmt.hash, fmt.ext);
      if (converted) {
        newFormats[key] = {
          name: fmt.name.replace(/\.(png|jpe?g)$/i, ".webp"),
          hash: converted.hash,
          ext: converted.ext,
          mime: converted.mime,
          path: fmt.path,
          width: converted.width,
          height: converted.height,
          size: converted.size,
          sizeInBytes: converted.sizeInBytes,
          url: converted.url,
        };
      }
    }
  }

  await strapi.db.query("plugin::upload.file").update({
    where: { id: file.id },
    data: {
      name: file.name.replace(/\.(png|jpe?g)$/i, ".webp"),
      hash: mainResult.hash,
      ext: mainResult.ext,
      mime: mainResult.mime,
      url: mainResult.url,
      size: mainResult.size,
      formats: newFormats,
    },
  });

  strapi.log.info(
    `[webp-convert] Файл #${file.id} (${file.name}) сконвертирован в WebP`,
  );
}

const UID_TO_COVER_FIELDS: Record<
  string,
  { primary?: string; fallback?: string }
> = {
  "api::new.new": { primary: "desc_img" },
  "api::article.article": { primary: "desc_img" },
  "api::blog.blog": { primary: "back_img" },
  "api::event.event": { primary: "cover_img", fallback: "desc_img" },
  "api::q-and-a.q-and-a": {},
};
const UID_TO_ROUTE_KEY: Record<string, string> = {
  "api::new.new": "new",
  "api::article.article": "article",
  "api::blog.blog": "blog",
  "api::event.event": "event",
  "api::q-and-a.q-and-a": "q-and-a",
};

const UID_TO_TG_TEXT_FIELDS: Record<string, { title: string; desc: string }> = {
  "api::new.new": { title: "title_ru", desc: "desc_ru" },
  "api::article.article": { title: "title_ru", desc: "desc_ru" },
  "api::blog.blog": { title: "title_ru", desc: "desc_ru" },
  "api::event.event": { title: "title_ru", desc: "desc_ru" },
};

const SITEMAP_TRIGGER_ACTIONS = ["publish", "update", "unpublish", "delete"];

function buildUrls(routeKey: string, entry: any) {
  const segment = ROUTE_SEGMENT[routeKey];
  if (!segment || !entry?.slug) return [];
  const urls: string[] = [];
  if (entry.title_ru) urls.push(`${BASE_URL}/ru/${segment}/${entry.slug}`);
  if (entry.title_kk) urls.push(`${BASE_URL}/kk/${segment}/${entry.slug}`);
  if (entry.title_en) urls.push(`${BASE_URL}/en/${segment}/${entry.slug}`);
  return urls;
}

function buildPrimaryUrl(routeKey: string, entry: any) {
  const segment = ROUTE_SEGMENT[routeKey];
  if (!segment || !entry?.slug) return null;
  return `${BASE_URL}/ru/${segment}/${entry.slug}`;
}

function extractEntry(action: string, result: any) {
  if (action === "publish") return result?.entries?.[0];
  if (action === "unpublish") return result?.entries?.[0];
  if (action === "delete") return result?.entries?.[0] || result;
  return result;
}

let sitemapTimer: NodeJS.Timeout | null = null;
let newsSitemapTimer: NodeJS.Timeout | null = null;

function runScript(scriptRelativePath: string, label: string, strapi: any) {
  execFile(
    "node",
    [scriptRelativePath],
    { cwd: PROJECT_ROOT },
    (err, stdout, stderr) => {
      if (err) {
        strapi.log.error(`[${label}] ошибка генерации: ${err.message}`);
        return;
      }
      strapi.log.info(`[${label}] обновлён: ${stdout.trim()}`);
    },
  );
}

function scheduleSitemapRegeneration(strapi: any) {
  if (sitemapTimer) clearTimeout(sitemapTimer);
  sitemapTimer = setTimeout(() => {
    runScript("scripts/generate-sitemap.js", "SITEMAP", strapi);
  }, DEBOUNCE_MS);
}

function scheduleNewsSitemapRegeneration(strapi: any) {
  if (newsSitemapTimer) clearTimeout(newsSitemapTimer);
  newsSitemapTimer = setTimeout(() => {
    runScript("scripts/generate-news-sitemap.js", "NEWS SITEMAP", strapi);
  }, DEBOUNCE_MS);
}

export default {
  register({ strapi }: { strapi: any }) {
    strapi.db.lifecycles.subscribe({
      models: ["plugin::upload.file"],

      async afterCreate(event) {
        await convertFileEntryToWebp(strapi, event.result);
      },
    });

    strapi.documents.use(async (context: any, next: any) => {
      const result = await next();
      const uid = context.uid;
      const action = context.action;
      if (!UID_TO_ROUTE_KEY[uid]) return result;

      if (SITEMAP_TRIGGER_ACTIONS.includes(action)) {
        scheduleSitemapRegeneration(strapi);
        if (uid === "api::new.new") {
          scheduleNewsSitemapRegeneration(strapi);
        }
      }

      if (!["publish", "update"].includes(action)) return result;

      try {
        const entry = extractEntry(action, result);
        if (!entry) return result;
        const documentId = result?.documentId || entry?.documentId;
        const coverConfig = UID_TO_COVER_FIELDS[uid];
        if (coverConfig && documentId) {
          await optimizeOgImage(
            strapi,
            uid,
            documentId,
            coverConfig.primary,
            coverConfig.fallback,
          );
          await generateSeoImageCrops(
            strapi,
            uid,
            documentId,
            coverConfig.primary,
            coverConfig.fallback,
          );
        }
        if (entry.publishedAt) {
          strapi.log.warn(
            `[DEBUG entry] ${uid}: ${JSON.stringify({ send_to_tg: entry.send_to_tg, tg_sent: entry.tg_sent, keys: Object.keys(entry) })}`,
          );
          const routeKey = UID_TO_ROUTE_KEY[uid];
          const urls = buildUrls(routeKey, entry);
          if (urls.length > 0) {
            await pingIndexNow(urls);
          }

          const textFields = UID_TO_TG_TEXT_FIELDS[uid];
          if (
            textFields &&
            entry.send_to_tg === true &&
            entry.tg_sent !== true &&
            documentId
          ) {
            try {
              const coverField = coverConfig?.primary;
              const fullEntry = await strapi.documents(uid).findOne({
                documentId,
                populate: coverField ? [coverField] : [],
              });

              const media = coverField ? fullEntry?.[coverField] : null;
              const imageUrl = media?.url
                ? media.url.startsWith("http")
                  ? media.url
                  : `${MEDIA_BASE_URL}${media.url}`
                : undefined;
              strapi.log.warn(
                `[DEBUG image] media.url=${media?.url} imageUrl=${imageUrl}`,
              );
              const articleUrl = buildPrimaryUrl(routeKey, entry);

              await sendToTelegramChannel({
                title: entry[textFields.title],
                description: entry[textFields.desc],
                imageUrl,
                articleUrl: articleUrl || BASE_URL,
              });

              await strapi.documents(uid).update({
                documentId,
                data: { tg_sent: true },
              });
            } catch (tgErr: any) {
              strapi.log.error(
                `[TELEGRAM] ${uid}: ошибка отправки — ${tgErr.message}`,
              );
            }
          }
        }
      } catch (err: any) {
        strapi.log.error(`[DOC MIDDLEWARE] ${uid}: ошибка — ${err.message}`);
      }
      return result;
    });
  },
  bootstrap() {},
};
