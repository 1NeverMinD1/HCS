const fs = require("fs");
const path = require("path");

const API_URL = "https://api.zhkh24.kz/api";
const SITE_URL = "https://zhkh24.kz";
const PUBLICATION_NAME = "zhkh24.kz";
const HOURS_WINDOW = 48;

async function fetchRecentNews() {
  const since = new Date(Date.now() - HOURS_WINDOW * 60 * 60 * 1000).toISOString();
  let page = 1;
  const pageSize = 100;
  let allItems = [];
  while (true) {
    const params = new URLSearchParams({
      "filters[publishedAt][$gte]": since,
      "sort": "publishedAt:desc",
      "pagination[page]": String(page),
      "pagination[pageSize]": String(pageSize),
      "fields[0]": "slug",
      "fields[1]": "publishedAt",
      "fields[2]": "title_ru",
      "fields[3]": "title_kk",
      "fields[4]": "title_en",
    });
    const res = await fetch(`${API_URL}/news?${params}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for news page ${page}`);
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

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function newsUrlEntry({ loc, language, publicationDate, title }) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>
        <news:language>${language}</news:language>
      </news:publication>
      <news:publication_date>${publicationDate}</news:publication_date>
      <news:title>${escapeXml(title)}</news:title>
    </news:news>
  </url>`;
}

async function fetchAndValidate() {
  try {
    return await fetchRecentNews();
  } catch (err) {
    console.error("Error fetching news for news-sitemap:", err.message);
    return [];
  }
}

async function generateNewsSitemap() {
  const items = await fetchAndValidate();
  const entries = [];

  for (const item of items) {
    const slug = item.slug || item.attributes?.slug;
    const publishedAt = item.publishedAt || item.attributes?.publishedAt;
    if (!slug || !publishedAt) continue;

    const localeMap = [
      { field: "title_ru", locale: "ru" },
      { field: "title_kk", locale: "kk" },
      { field: "title_en", locale: "en" },
    ];

    for (const { field, locale } of localeMap) {
      const title = item[field] || item.attributes?.[field];
      if (!title) continue;
      entries.push(
        newsUrlEntry({
          loc: `${SITE_URL}/${locale}/news/${slug}`,
          language: locale,
          publicationDate: publishedAt,
          title,
        })
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries.join("\n")}
</urlset>`;

  const outputPath = path.join(__dirname, "../frontend/dist/news-sitemap.xml");
  const tmpPath = outputPath + ".tmp";
  fs.writeFileSync(tmpPath, xml, "utf-8");
  fs.renameSync(tmpPath, outputPath);

  console.log(`News sitemap generated: ${outputPath}`);
  console.log(`Total news URLs: ${entries.length}`);
}

generateNewsSitemap().catch((err) => {
  console.error("News sitemap generation failed:", err);
  process.exit(1);
});