const TELEGRAM_API = "https://api.telegram.org";

interface TelegramPostParams {
  title: string;
  description: string;
  imageUrl?: string;
  articleUrl: string;
}

export async function sendToTelegramChannel(params: TelegramPostParams) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;

  if (!token || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN или TELEGRAM_CHANNEL_ID не заданы в .env");
  }

  const caption = `<b>${escapeHtml(params.title)}</b>\n\n${escapeHtml(params.description)}\n\n<a href="${params.articleUrl}">Смотрите полную новость по ссылке</a>`;

  if (params.imageUrl) {
    const response = await fetch(`${TELEGRAM_API}/bot${token}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        photo: params.imageUrl,
        caption,
        parse_mode: "HTML",
      }),
    });
    const data = await response.json() as any;
    if (!data.ok) throw new Error(`Telegram API error: ${data.description}`);
    return data;
  }

  const response = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: caption,
      parse_mode: "HTML",
    }),
  });
  const data = await response.json() as any;
  if (!data.ok) throw new Error(`Telegram API error: ${data.description}`);
  return data;
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
