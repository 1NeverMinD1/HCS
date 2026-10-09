import fs from "fs/promises";
import path from "path";

const OUT_DIR = "/var/www/project/hero";
const HERO_FILE = path.join(OUT_DIR, "hero.html");
const MEDIA_BASE = "https://api.zhkh24.kz";
const DEBOUNCE_MS = 1000;
const HERO_SIZES = "(max-width: 430px) 70vw, 60vw";

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

const TEXT_FIELDS = [
  "title_ru",
  "title_kk",
  "title_en",
  "desc_ru",
  "desc_kk",
  "desc_en",
  "slug",
  "publishDate",
];

const NAME_FIELDS = { fields: ["name_ru", "name_kk", "name_en"] };
const IMG_FIELDS = { fields: ["url", "formats", "width"] };

const LIST_SOURCES: any[] = [
  {
    key: "news",
    uid: "api::new.new",
    img: ["desc_img"],
    imageMode: "hero",
    sizes: "(max-width: 430px) 70vw, 50vw",
    pageSize: 20,
    sort: [{ publishDate: "desc" }],
    fields: TEXT_FIELDS,
    populate: {
      desc_img: IMG_FIELDS,
      header_cats: NAME_FIELDS,
    },
  },
  {
    key: "articles",
    uid: "api::article.article",
    img: ["desc_img"],
    imageMode: "responsive",
    fallbackFormat: "medium",
    sizes: "(max-width: 430px) 50vw, (max-width: 1630px) 420px, 530px",
    pageSize: 20,
    sort: [{ publishDate: "desc" }],
    fields: TEXT_FIELDS,
    populate: {
      desc_img: IMG_FIELDS,
      categories: NAME_FIELDS,
    },
  },
  {
    key: "blogs",
    uid: "api::blog.blog",
    img: ["back_img"],
    imageMode: "responsive",
    fallbackFormat: "large",
    sizes: "(max-width: 430px) 70vw, (max-width: 1630px) 90vw, 1300px",
    pageSize: 20,
    sort: [{ publishDate: "desc" }],
    fields: TEXT_FIELDS,
    populate: {
      back_img: IMG_FIELDS,
      authors: {
        fields: [
          "name_ru",
          "name_kk",
          "name_en",
          "position_ru",
          "position_kk",
          "position_en",
          "slug",
        ],
        populate: {
          profile_img: { fields: ["url", "formats"] },
        },
      },
      categories: NAME_FIELDS,
      tags: NAME_FIELDS,
    },
  },
  {
    key: "events",
    uid: "api::event.event",
    img: ["cover_img", "desc_img"],
    imageMode: "responsive",
    fallbackFormat: "small",
    sizes: "(max-width: 430px) 95vw, (max-width: 1630px) 440px, 460px",
    pageSize: 20,
    sort: [{ start: "desc" }],
    fields: [
      "title_ru",
      "title_kk",
      "title_en",
      "desc_ru",
      "desc_kk",
      "desc_en",
      "place_ru",
      "place_kk",
      "place_en",
      "slug",
      "start",
      "end",
      "start_time",
      "amount",
      "price",
    ],
    populate: {
      cover_img: IMG_FIELDS,
      desc_img: IMG_FIELDS,
      categories: NAME_FIELDS,
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

const HERO_FIELDS = [...TEXT_FIELDS, "createdAt"];
const HERO_FORMAT_ORDER = ["small", "medium", "large"];
const RESPONSIVE_FORMAT_ORDER = ["thumbnail", "small", "medium", "large"];

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

function heroImage(img: any) {
  if (!img) return { href: "", srcset: "" };
  const formats = img.formats || {};
  const parts: string[] = [];
  for (const key of HERO_FORMAT_ORDER) {
    const f = formats[key];
    if (f?.url && f?.width) parts.push(`${absUrl(f.url)} ${f.width}w`);
  }
  if (img.url && img.width) parts.push(`${absUrl(img.url)} ${img.width}w`);
  const href = absUrl(
    formats.medium?.url || formats.large?.url || formats.small?.url || img.url,
  );
  return { href, srcset: parts.length > 1 ? parts.join(", ") : "" };
}

function responsiveImage(img: any, fallbackFormat: string) {
  if (!img) return { href: "", srcset: "" };
  const formats = img.formats || {};
  const candidates: any[] = RESPONSIVE_FORMAT_ORDER.map(
    (k) => formats[k],
  ).filter((f) => f && f.url && f.width);
  if (img.url && img.width) candidates.push({ url: img.url, width: img.width });

  const seen = new Set<number>();
  const unique = candidates
    .sort((a, b) => a.width - b.width)
    .filter((f) => {
      if (seen.has(f.width)) return false;
      seen.add(f.width);
      return true;
    });

  const fallback =
    formats[fallbackFormat] || formats.small || formats.medium || img;

  return {
    href: absUrl(fallback.url),
    srcset:
      unique.length > 1
        ? unique.map((f) => `${absUrl(f.url)} ${f.width}w`).join(", ")
        : "",
  };
}

function pickImg(item: any, fields: string[]) {
  for (const f of fields) {
    if (item?.[f]) return item[f];
  }
  return null;
}

function preloadTag(href: string, srcset: string, sizes: string) {
  if (!href) return "";
  const srcsetAttrs = srcset
    ? ` imagesrcset="${escAttr(srcset)}" imagesizes="${escAttr(sizes)}"`
    : "";
  return `<link rel="preload" as="image" href="${escAttr(href)}"${srcsetAttrs} fetchpriority="high">`;
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
      fields: HERO_FIELDS,
      populate: {
        [src.img]: IMG_FIELDS,
        [src.cats]: NAME_FIELDS,
      },
    });
    if (doc) candidates.push({ ...doc, __type: src.type });
  }

  if (candidates.length === 0) return "";

  const winner = candidates.reduce((best, cur) =>
    isNewer(cur, best) ? cur : best,
  );

  const img = winner.__type === "blog" ? winner.back_img : winner.desc_img;
  const { href, srcset } = heroImage(img);

  return `${preloadTag(href, srcset, HERO_SIZES)}<script type="application/json" id="hero-data">${escJson(winner)}</script>`;
}

async function buildListHtml(strapi: any, src: any) {
  const items = await strapi.documents(src.uid).findMany({
    status: "published",
    sort: src.sort,
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

  const img = pickImg(items[0], src.img);
  const { href, srcset } =
    src.imageMode === "responsive"
      ? responsiveImage(img, src.fallbackFormat || "small")
      : heroImage(img);

  const json = escJson({ key: src.key, data: items, pagination });

  return `${preloadTag(href, srcset, src.sizes)}<script type="application/json" id="list-data">${json}</script>`;
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
