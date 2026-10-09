import fs from "fs/promises";
import path from "path";

const OUT_FILE = "/var/www/project/hero/hero.html";
const MEDIA_BASE = "https://api.zhkh24.kz";
const DEBOUNCE_MS = 1000;

const SOURCES = [
  { uid: "api::new.new", type: "news", img: "desc_img", cats: "header_cats" },
  { uid: "api::blog.blog", type: "blog", img: "back_img", cats: "categories" },
  {
    uid: "api::article.article",
    type: "article",
    img: "desc_img",
    cats: "categories",
  },
] as const;

const UIDS = new Set<string>(SOURCES.map((s) => s.uid));
const ACTIONS = new Set([
  "create",
  "update",
  "delete",
  "publish",
  "unpublish",
  "discardDraft",
]);

const FIELDS = [
  "title_ru",
  "title_kk",
  "title_en",
  "desc_ru",
  "desc_kk",
  "desc_en",
  "slug",
  "publishDate",
  "createdAt",
];

function isNewer(a: any, b: any) {
  const ap = new Date(a.publishDate).getTime();
  const bp = new Date(b.publishDate).getTime();
  if (ap !== bp) return ap > bp;
  return new Date(a.createdAt).getTime() >= new Date(b.createdAt).getTime();
}

function absUrl(u?: string) {
  if (!u) return "";
  return u.startsWith("http") ? u : MEDIA_BASE + u;
}

function escAttr(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function escJson(obj: unknown) {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

async function buildHtml(strapi: any) {
  const candidates: any[] = [];

  for (const src of SOURCES) {
    const doc = await strapi.documents(src.uid).findFirst({
      status: "published",
      filters: { isFeatured: true },
      sort: [{ publishDate: "desc" }],
      fields: FIELDS,
      populate: {
        [src.img]: { fields: ["url", "formats"] },
        [src.cats]: { fields: ["name_ru", "name_kk", "name_en"] },
      },
    });
    if (doc) candidates.push({ ...doc, __type: src.type });
  }

  if (candidates.length === 0) return "";

  const winner = candidates.reduce((best, cur) =>
    isNewer(cur, best) ? cur : best,
  );

  const img = winner.__type === "blog" ? winner.back_img : winner.desc_img;
  const imgUrl = absUrl(
    img?.formats?.medium?.url || img?.formats?.small?.url || img?.url,
  );

  const preload = imgUrl
    ? `<link rel="preload" as="image" href="${escAttr(imgUrl)}" fetchpriority="high">`
    : "";

  return `${preload}<script type="application/json" id="hero-data">${escJson(winner)}</script>`;
}

export async function writeHeroSnapshot(strapi: any) {
  try {
    const html = await buildHtml(strapi);
    await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
    const tmp = `${OUT_FILE}.tmp`;
    await fs.writeFile(tmp, html, "utf8");
    await fs.rename(tmp, OUT_FILE);
    strapi.log.info(`[HERO] снимок обновлён (${html.length} байт)`);
  } catch (e: any) {
    strapi.log.error(`[HERO] hero snapshot failed: ${e.message}`);
  }
}

let timer: NodeJS.Timeout | null = null;

function schedule(strapi: any) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    writeHeroSnapshot(strapi);
  }, DEBOUNCE_MS);
}

export function registerHeroSnapshot(strapi: any) {
  strapi.documents.use(async (context: any, next: any) => {
    const result = await next();
    if (UIDS.has(context.uid) && ACTIONS.has(context.action)) {
      schedule(strapi);
    }
    return result;
  });
}
