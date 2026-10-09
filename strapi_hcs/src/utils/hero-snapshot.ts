import fs from "fs/promises";
import path from "path";

const OUT_DIR = "/var/www/project/hero";
const HERO_FILE = path.join(OUT_DIR, "hero.html");
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

const LIST_SOURCES = [
  {
    key: "news",
    uid: "api::new.new",
    img: "desc_img",
    sizes: "(max-width: 430px) 100vw, 50vw",
    pageSize: 20,
    fields: [
      "title_ru",
      "title_kk",
      "title_en",
      "desc_ru",
      "desc_kk",
      "desc_en",
      "slug",
      "publishDate",
    ],
    populate: {
      desc_img: { fields: ["url", "formats", "width"] },
      header_cats: { fields: ["name_ru", "name_kk", "name_en"] },
    },
  },
];

const UIDS = new Set<string>([
  ...SOURCES.map((s) => s.uid),
  ...LIST_SOURCES.map((s) => s.uid),
]);

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

const FORMAT_ORDER = ["small", "medium", "large"];

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

function buildSrcSet(img: any) {
  if (!img) return "";
  const parts: string[] = [];
  const formats = img.formats || {};
  for (const key of FORMAT_ORDER) {
    const f = formats[key];
    if (f?.url && f?.width) parts.push(`${absUrl(f.url)} ${f.width}w`);
  }
  if (img.url && img.width) parts.push(`${absUrl(img.url)} ${img.width}w`);
  return parts.length > 1 ? parts.join(", ") : "";
}

function pickSrc(img: any) {
  if (!img) return "";
  const f = img.formats || {};
  return absUrl(f.medium?.url || f.large?.url || f.small?.url || img.url);
}

async function writeAtomic(file: string, content: string) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, content, "utf8");
  await fs.rename(tmp, file);
}

async function buildHeroHtml(strapi: any) {
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

async function buildListHtml(strapi: any, src: (typeof LIST_SOURCES)[number]) {
  const items = await strapi.documents(src.uid).findMany({
    status: "published",
    sort: [{ publishDate: "desc" }],
    fields: src.fields,
    populate: src.populate,
    start: 0,
    limit: src.pageSize,
  });

  if (!items || items.length === 0) return "";

  const total = await strapi.documents(src.uid).count({ status: "published" });
  const pagination = {
    page: 1,
    pageSize: src.pageSize,
    pageCount: Math.max(1, Math.ceil(total / src.pageSize)),
    total,
  };

  const img = items[0]?.[src.img];
  const href = pickSrc(img);
  let preload = "";
  if (href) {
    const srcset = buildSrcSet(img);
    const srcsetAttrs = srcset
      ? ` imagesrcset="${escAttr(srcset)}" imagesizes="${escAttr(src.sizes)}"`
      : "";
    preload = `<link rel="preload" as="image" href="${escAttr(href)}"${srcsetAttrs} fetchpriority="high">`;
  }

  const json = escJson({ key: src.key, data: items, pagination });

  return `${preload}<script type="application/json" id="list-data">${json}</script>`;
}

export async function writeHeroSnapshot(strapi: any) {
  try {
    const html = await buildHeroHtml(strapi);
    await writeAtomic(HERO_FILE, html);
    strapi.log.info(`[HERO] снимок обновлён (${html.length} байт)`);
  } catch (e: any) {
    strapi.log.error(`[HERO] hero snapshot failed: ${e.message}`);
  }

  for (const src of LIST_SOURCES) {
    try {
      const html = await buildListHtml(strapi, src);
      await writeAtomic(path.join(OUT_DIR, `list-${src.key}.html`), html);
      strapi.log.info(`[HERO] list-${src.key} обновлён (${html.length} байт)`);
    } catch (e: any) {
      strapi.log.error(`[HERO] list-${src.key} failed: ${e.message}`);
    }
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
