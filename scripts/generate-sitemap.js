const fs = require("fs");
const path = require("path");
const API_URL = "https://api.zhkh24.kz/api";
const SITE_URL = "https://zhkh24.kz";
const LOCALES = ["ru", "kk", "en"];
const COLLECTIONS = [
  { endpoint: "news", path: "news" },
  { endpoint: "articles", path: "articles" },
  { endpoint: "blogs", path: "blogs" },
  { endpoint: "events", path: "events" },
  { endpoint: "q-and-as", path: "q-and-as" },
];
const MIN_URLS_RATIO = 0.5;

async function fetchAll(endpoint) {
  let page = 1;
  const pageSize = 100;
  let allItems = [];
  while (true) {
    const res = await fetch(
      `${API_URL}/${endpoint}?pagination[page]=${page}&pagination[pageSize]=${pageSize}&fields[0]=slug&fields[1]=updatedAt`
    );
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${endpoint} page ${page}`);
    }
    const json = await res.json();
    const items = json.data || [];
    allItems = allItems.concat(items);
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

function countExistingUrls(outputPath) {
  if (!fs.existsSync(outputPath)) return 0;
  const content = fs.readFileSync(outputPath, "utf-8");
  const matches = content.match(/<url>/g);
  return matches ? matches.length : 0;
}

async function generateSitemap() {
  const urls = [];
  const failedCollections = [];

  urls.push(urlEntry(`${SITE_URL}/`, new Date().toISOString()));

  for (const collection of COLLECTIONS) {
    try {
      const items = await fetchAll(collection.endpoint);
      for (const item of items) {
        const slug = item.slug || item.attributes?.slug;
        const updatedAt =
          item.updatedAt || item.attributes?.updatedAt || new Date().toISOString();
        if (!slug) continue;
        for (const locale of LOCALES) {
          urls.push(
            urlEntry(
              `${SITE_URL}/${locale}/${collection.path}/${slug}`,
              updatedAt.split("T")[0]
            )
          );
        }
      }
      console.log(`✓ ${collection.endpoint}: ${items.length} items`);
    } catch (err) {
      console.error(`✗ Error fetching ${collection.endpoint}:`, err.message);
      failedCollections.push(collection.endpoint);
    }
  }

  const outputPath = path.join(__dirname, "../frontend/dist/sitemap.xml");
  const tmpPath = outputPath + ".tmp";

  const existingCount = countExistingUrls(outputPath);
  if (
    failedCollections.length > 0 &&
    existingCount > 0 &&
    urls.length < existingCount * MIN_URLS_RATIO
  ) {
    console.error(
      `\n⚠ Aborting: got only ${urls.length} URLs (had ${existingCount} before), ` +
        `and these collections failed: ${failedCollections.join(", ")}. ` +
        `Keeping the previous sitemap.xml untouched.`
    );
    process.exit(1);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  fs.writeFileSync(tmpPath, xml, "utf-8");
  fs.renameSync(tmpPath, outputPath);

  console.log(`\nSitemap generated: ${outputPath}`);
  console.log(`Total URLs: ${urls.length}`);

  if (failedCollections.length > 0) {
    console.error(
      `\n⚠ Warning: some collections failed but sitemap was still written ` +
        `(${urls.length} URLs is above the ${MIN_URLS_RATIO * 100}% safety threshold): ` +
        failedCollections.join(", ")
    );
  }
}

generateSitemap().catch((err) => {
  console.error("Sitemap generation failed:", err);
  process.exit(1);
});
