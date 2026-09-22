// src/utils/dateLocale.js
const monthNames = {
  ru: [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ],
  kk: [
    "қаңтар",
    "ақпан",
    "наурыз",
    "сәуір",
    "мамыр",
    "маусым",
    "шілде",
    "тамыз",
    "қыркүйек",
    "қазан",
    "қараша",
    "желтоқсан",
  ],
  en: [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ],
};

export const formatLocalizedDate = (dateStr, locale) => {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Almaty",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(date);

  const day = Number(parts.find((p) => p.type === "day").value);
  const monthIndex = Number(parts.find((p) => p.type === "month").value) - 1;
  const year = Number(parts.find((p) => p.type === "year").value);

  const month = monthNames[locale]?.[monthIndex] ?? monthNames.ru[monthIndex];

  return `${day} ${month} ${year}`;
};
