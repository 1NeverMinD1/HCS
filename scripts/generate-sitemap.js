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

async function fetchAll(endpoint) {
  let page = 1;
  const pageSize = 100;
  let allItems = [];
  while (true) {
    const res = await fetch(
      `${API_URL}/${endpoint}?pagination[page]=${page}&pagination[pageSize]=${pageSize}&fields[0]=slug&fields[1]=updatedAt&fields[2]=title_kk&fields[3]=title_en`
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

function urlEntry(loc, lastmod) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
}

function buildUrlset(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;
}

function buildIndex(items) {
  const body = items
    .map(
      ({ loc, lastmod }) => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
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

  const addUrl = (fileName, loc, updatedAt) => {
    if (!groups.has(fileName)) groups.set(fileName, { entries: [], latest: null });
    const group = groups.get(fileName);
    group.entries.push(urlEntry(loc, toAlmatyDateString(updatedAt)));
    if (!group.latest || updatedAt > group.latest) group.latest = updatedAt;
  };

  for (const collection of COLLECTIONS) {
    try {
      const items = await fetchAll(collection.endpoint);
      for (const item of items) {
        const slug = item.slug || item.attributes?.slug;
        const updatedAt = item.updatedAt || item.attributes?.updatedAt;
        if (!slug || !updatedAt) continue;
        if (!latestOverall || updatedAt > latestOverall) latestOverall = updatedAt;
        for (const locale of LOCALES) {
          if (locale.field && !(item[locale.field] || item.attributes?.[locale.field])) continue;
          addUrl(
            `sitemap-${collection.name}-${locale.code}.xml`,
            `${SITE_URL}/${locale.code}/${collection.path}/${slug}`,
            updatedAt
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
      `\n⚠ Aborting: ${totalUrls} URLs, failed collections: ${failedCollections.join(", ") || "none"}`
    );
    restoreBackup();
    process.exit(1);
  }

  addUrl(STATIC_NAME, `${SITE_URL}/`, latestOverall);

  const names = [...groups.keys()].sort((a, b) =>
    a === STATIC_NAME ? -1 : b === STATIC_NAME ? 1 : a.localeCompare(b)
  );

  const files = names.map((name) => [name, buildUrlset(groups.get(name).entries)]);

  const indexItems = names.map((name) => ({
    loc: `${SITE_URL}/${name}`,
    lastmod: toAlmatyDateString(groups.get(name).latest),
  }));

  const newsSitemapPath = path.join(OUTPUT_DIR, NEWS_SITEMAP_NAME);
  if (fs.existsSync(newsSitemapPath)) {
    indexItems.push({
      loc: `${SITE_URL}/${NEWS_SITEMAP_NAME}`,
      lastmod: toAlmatyDateString(fs.statSync(newsSitemapPath).mtime.toISOString()),
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
  console.log(`\nSitemap index generated: ${path.join(OUTPUT_DIR, INDEX_NAME)}`);
  console.log(`Files: ${names.length}, total URLs: ${totalUrls + 1}`);
}

generateSitemaps().catch((err) => {
  console.error("Sitemap generation failed:", err);
  restoreBackup();
  process.exit(1);
});