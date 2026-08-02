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

async function fetchAll(endpoint) {
  let page = 1;
  const pageSize = 100;
  let allItems = [];

  while (true) {
    const res = await fetch(
      `${API_URL}/${endpoint}?pagination[page]=${page}&pagination[pageSize]=${pageSize}&fields[0]=slug&fields[1]=updatedAt`
    );
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

async function generateSitemap() {
  const urls = [];

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
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  const outputPath = path.join(
    __dirname,
    "../frontend/dist/sitemap.xml"
  );

  fs.writeFileSync(outputPath, xml, "utf-8");
  console.log(`\nSitemap generated: ${outputPath}`);
  console.log(`Total URLs: ${urls.length}`);
}

generateSitemap().catch((err) => {
  console.error("Sitemap generation failed:", err);
  process.exit(1);
});
