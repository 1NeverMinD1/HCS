const { pingIndexNow } = require("./indexnow");
const { ROUTE_SEGMENT } = require("./routeSegments");

const BASE_URL = "https://zhkh24.kz";

function createIndexNowLifecycle(collectionKey) {
  const segment = ROUTE_SEGMENT[collectionKey];

  if (!segment) {
    throw new Error(
      `[IndexNow] Нет сегмента маршрута для коллекции "${collectionKey}" в ROUTE_SEGMENT`,
    );
  }

  function buildUrls(entry) {
    if (!entry?.slug) return [];

    const urls = [];
    if (entry.title_ru) urls.push(`${BASE_URL}/ru/${segment}/${entry.slug}`);
    if (entry.title_kk) urls.push(`${BASE_URL}/kk/${segment}/${entry.slug}`);
    if (entry.title_en) urls.push(`${BASE_URL}/en/${segment}/${entry.slug}`);

    return urls;
  }

  async function notify(entry) {
    if (!entry?.publishedAt) return;

    const urls = buildUrls(entry);
    if (urls.length > 0) {
      await pingIndexNow(urls);
    }
  }

  return {
    async afterCreate(event) {
      await notify(event.result);
    },
    async afterUpdate(event) {
      await notify(event.result);
    },
  };
}

module.exports = { createIndexNowLifecycle };
