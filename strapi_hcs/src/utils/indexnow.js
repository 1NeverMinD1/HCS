// utils/indexnow.js
const INDEXNOW_KEY = "e6e3b4be88df587f30acf3e8274fd98e";
const HOST = "zhkh24.kz";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

/**
 * Отправляет один или несколько URL в IndexNow (Bing, Yandex и др.)
 * @param {string|string[]} urls
 */
async function pingIndexNow(urls) {
  const urlList = Array.isArray(urls)
    ? urls.filter(Boolean)
    : [urls].filter(Boolean);
  if (urlList.length === 0) return;

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 202) {
      console.log(
        `[IndexNow] Отправлено ${urlList.length} URL(ов), статус: ${response.status}`,
      );
    } else {
      const text = await response.text();
      console.error(`[IndexNow] Ошибка ${response.status}: ${text}`);
    }
  } catch (err) {
    console.error("[IndexNow] Не удалось отправить запрос:", err.message);
  }
}

module.exports = { pingIndexNow };
