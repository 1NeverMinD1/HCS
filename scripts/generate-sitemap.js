const fs = require("fs");
const path = require("path");

const API_URL = "https://api.zhkh24.kz/api";
const SITE_URL = "https://zhkh24.kz";
const COLLECTIONS = [
  { endpoint: "news", path: "news", name: "news" },
  { endpoint: "articles", path: "articles", name: "articles" },
  { endpoint: "blogs", path: "blogs", name: "blogs" },
  { endpoint: "events", path: "events", name: "events" },
  { endpoint: "q-and-as", path: "q-and-as", name: "qna" },
  {
    endpoint: "authors",
    path: "author",
    name: "authors",
    field: "name",
  },
];
const LOCALES = [
  { code: "ru", field: null },
  { code: "kk", field: "title_kk" },
  { code: "en", field: "title_en" },
];
const MIN_TOTAL_URLS = 50;
const OUTPUT_DIR = path.join(__dirname, "../frontend/dist");
const BACKUP_DIR = path.join(__dirname, "sitemap-last-good");
const INDEX_NAME = "sitemap.xml";
const STATIC_NAME = "sitemap-static.xml";
const NEWS_SITEMAP_NAME = "news-sitemap.xml";

function toAlmatyDateString(isoString) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Almaty",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(isoString));
  const get = (type) => parts.find((p) => p.type === type).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

async function fetchAll(endpoint, field = "title", extraFields = []) {
  let page = 1;
  const pageSize = 100;
  let allItems = [];
  while (true) {
    const res = await fetch(
      `${API_URL}/${endpoint}?pagination[page]=${page}&pagination[pageSize]=${pageSize}&fields[0]=slug&fields[1]=updatedAt&fields[2]=${field}_kk&fields[3]=${field}_en${extraFields.map((name, i) => `&fields[${4 + i}]=${name}`).join("")}`,
    );
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${endpoint} page ${page}`);
    }
    const json = await res.json();
    allItems = allItems.concat(json.data || []);
    const pageCount = json.meta?.pagination?.pageCount || 1;
    if (page >= pageCount) break;
    page++;
  }
  return allItems;
}

function buildAlternates(codes, makeUrl) {
  if (codes.length < 2) return [];
  return [
    ...codes.map((code) => ({ lang: code, href: makeUrl(code) })),
    { lang: "x-default", href: makeUrl("ru") },
  ];
}

function urlEntry(loc, lastmod, alternates = []) {
  const links = alternates
    .map(
      ({ lang, href }) =>
        `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`,
    )
    .join("");
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>${links}
  </url>`;
}

function buildUrlset(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>`;
}

function buildIndex(items) {
  const body = items
    .map(
      ({ loc, lastmod }) => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;
}

function writeAtomic(filePath, content) {
  const tmpPath = filePath + ".tmp";
  fs.writeFileSync(tmpPath, content, "utf-8");
  fs.renameSync(tmpPath, filePath);
}

function saveBackup(files) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  for (const name of fs.readdirSync(BACKUP_DIR)) {
    fs.unlinkSync(path.join(BACKUP_DIR, name));
  }
  for (const [name, content] of files) {
    fs.writeFileSync(path.join(BACKUP_DIR, name), content, "utf-8");
  }
}

function restoreBackup() {
  if (!fs.existsSync(BACKUP_DIR) || fs.readdirSync(BACKUP_DIR).length === 0) {
    console.error("No backup sitemaps available, output left untouched");
    return;
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const name of fs.readdirSync(BACKUP_DIR)) {
    fs.copyFileSync(path.join(BACKUP_DIR, name), path.join(OUTPUT_DIR, name));
  }
  console.error(`Restored last good sitemaps from ${BACKUP_DIR}`);
}

async function generateSitemaps() {
  const groups = new Map();
  const failedCollections = [];
  let totalUrls = 0;
  let latestOverall = null;

  const addUrl = (fileName, loc, updatedAt, alternates = []) => {
    if (!groups.has(fileName))
      groups.set(fileName, { entries: [], latest: null });
    const group = groups.get(fileName);
    group.entries.push(
      urlEntry(loc, toAlmatyDateString(updatedAt), alternates),
    );
    if (!group.latest || updatedAt > group.latest) group.latest = updatedAt;
  };

  for (const collection of COLLECTIONS) {
    try {
      const items = await fetchAll(
        collection.endpoint,
        collection.field,
        collection.extraFields,
      );
      for (const item of items) {
        const slug = item.slug || item.attributes?.slug;
        const updatedAt = item.updatedAt || item.attributes?.updatedAt;
        if (!slug || !updatedAt) continue;
        if (collection.include && !collection.include(item)) continue;
        if (!latestOverall || updatedAt > latestOverall)
          latestOverall = updatedAt;
        const baseField = collection.field || "title";
        const available = LOCALES.filter((locale) => {
          if (!locale.field) return true;
          const key = `${baseField}_${locale.code}`;
          return item[key] || item.attributes?.[key];
        });
        const makeItemUrl = (code) =>
          `${SITE_URL}/${code}/${collection.path}/${slug}`;
        const alternates = buildAlternates(
          available.map((locale) => locale.code),
          makeItemUrl,
        );
        for (const locale of available) {
          addUrl(
            `sitemap-${collection.name}-${locale.code}.xml`,
            makeItemUrl(locale.code),
            updatedAt,
            alternates,
          );
          totalUrls++;
        }
      }
      console.log(`✓ ${collection.endpoint}: ${items.length} items`);
    } catch (err) {
      console.error(`✗ Error fetching ${collection.endpoint}:`, err.message);
      failedCollections.push(collection.endpoint);
    }
  }

  if (failedCollections.length > 0 || totalUrls < MIN_TOTAL_URLS) {
    console.error(
      `\n⚠ Aborting: ${totalUrls} URLs, failed collections: ${failedCollections.join(", ") || "none"}`,
    );
    restoreBackup();
    process.exit(1);
  }

  const homeAlternates = buildAlternates(
    LOCALES.map((locale) => locale.code),
    (code) => `${SITE_URL}/${code}`,
  );
  for (const locale of LOCALES) {
    addUrl(
      STATIC_NAME,
      `${SITE_URL}/${locale.code}`,
      latestOverall,
      homeAlternates,
    );
  }

  const authorsAlternates = buildAlternates(
    LOCALES.map((locale) => locale.code),
    (code) => `${SITE_URL}/${code}/authors`,
  );
  for (const locale of LOCALES) {
    addUrl(
      STATIC_NAME,
      `${SITE_URL}/${locale.code}/authors`,
      latestOverall,
      authorsAlternates,
    );
  }

  const names = [...groups.keys()].sort((a, b) =>
    a === STATIC_NAME ? -1 : b === STATIC_NAME ? 1 : a.localeCompare(b),
  );

  const files = names.map((name) => [
    name,
    buildUrlset(groups.get(name).entries),
  ]);

  const indexItems = names.map((name) => ({
    loc: `${SITE_URL}/${name}`,
    lastmod: toAlmatyDateString(groups.get(name).latest),
  }));

  const newsSitemapPath = path.join(OUTPUT_DIR, NEWS_SITEMAP_NAME);
  if (fs.existsSync(newsSitemapPath)) {
    indexItems.push({
      loc: `${SITE_URL}/${NEWS_SITEMAP_NAME}`,
      lastmod: toAlmatyDateString(
        fs.statSync(newsSitemapPath).mtime.toISOString(),
      ),
    });
  }

  const indexXml = buildIndex(indexItems);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const [name, content] of files) {
    writeAtomic(path.join(OUTPUT_DIR, name), content);
  }
  writeAtomic(path.join(OUTPUT_DIR, INDEX_NAME), indexXml);

  saveBackup([...files, [INDEX_NAME, indexXml]]);

  for (const name of names) {
    console.log(`  ${name}: ${groups.get(name).entries.length} URLs`);
  }
  console.log(
    `\nSitemap index generated: ${path.join(OUTPUT_DIR, INDEX_NAME)}`,
  );
  console.log(`Files: ${names.length}, total URLs: ${totalUrls + 1}`);
}

generateSitemaps().catch((err) => {
  console.error("Sitemap generation failed:", err);
  restoreBackup();
  process.exit(1);
});
