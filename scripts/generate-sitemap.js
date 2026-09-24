const fs = require("fs");
const path = require("path");

const API_URL = "https://api.zhkh24.kz/api";
const SITE_URL = "https://zhkh24.kz";
const COLLECTIONS = [
  { endpoint: "news", path: "news" },
  { endpoint: "articles", path: "articles" },
  { endpoint: "blogs", path: "blogs" },
  { endpoint: "events", path: "events" },
  { endpoint: "q-and-as", path: "q-and-as" },
];
const MIN_TOTAL_URLS = 50;
const OUTPUT_PATH = path.join(__dirname, "../frontend/dist/sitemap.xml");
const BACKUP_PATH = path.join(__dirname, "sitemap.last-good.xml");

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

function writeAtomic(filePath, content) {
  const tmpPath = filePath + ".tmp";
  fs.writeFileSync(tmpPath, content, "utf-8");
  fs.renameSync(tmpPath, filePath);
}

function restoreBackup() {
  if (fs.existsSync(BACKUP_PATH)) {
    fs.copyFileSync(BACKUP_PATH, OUTPUT_PATH);
    console.error(`Restored last good sitemap from ${BACKUP_PATH}`);
  } else {
    console.error("No backup sitemap available, output left untouched");
  }
}

async function generateSitemap() {
  const urls = [];
  const failedCollections = [];
  let latestUpdate = null;

  for (const collection of COLLECTIONS) {
    try {
      const items = await fetchAll(collection.endpoint);
      for (const item of items) {
        const slug = item.slug || item.attributes?.slug;
        const updatedAt = item.updatedAt || item.attributes?.updatedAt;
        if (!slug || !updatedAt) continue;
        if (!latestUpdate || updatedAt > latestUpdate) latestUpdate = updatedAt;
        const lastmod = toAlmatyDateString(updatedAt);
        urls.push(urlEntry(`${SITE_URL}/ru/${collection.path}/${slug}`, lastmod));
        if (item.title_kk || item.attributes?.title_kk) {
          urls.push(urlEntry(`${SITE_URL}/kk/${collection.path}/${slug}`, lastmod));
        }
        if (item.title_en || item.attributes?.title_en) {
          urls.push(urlEntry(`${SITE_URL}/en/${collection.path}/${slug}`, lastmod));
        }
      }
      console.log(`✓ ${collection.endpoint}: ${items.length} items`);
    } catch (err) {
      console.error(`✗ Error fetching ${collection.endpoint}:`, err.message);
      failedCollections.push(collection.endpoint);
    }
  }

  if (failedCollections.length > 0 || urls.length < MIN_TOTAL_URLS) {
    console.error(
      `\n⚠ Aborting: ${urls.length} URLs, failed collections: ${failedCollections.join(", ") || "none"}`
    );
    restoreBackup();
    process.exit(1);
  }

  urls.unshift(urlEntry(`${SITE_URL}/`, toAlmatyDateString(latestUpdate)));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  writeAtomic(OUTPUT_PATH, xml);
  writeAtomic(BACKUP_PATH, xml);

  console.log(`\nSitemap generated: ${OUTPUT_PATH}`);
  console.log(`Total URLs: ${urls.length}`);
}

generateSitemap().catch((err) => {
  console.error("Sitemap generation failed:", err);
  restoreBackup();
  process.exit(1);
});