export const getLangField = (item, field, locale) => {
  const map = {
    ru: "ru",
    kk: "kk",
    en: "en",
  };

  const lang = map[locale] || "ru";

  if (lang === "ru") {
    return item?.[`${field}_ru`] || item?.[field] || "";
  }

  return (
    item?.[`${field}_${lang}`] || item?.[`${field}_ru`] || item?.[field] || ""
  );
};

const LOCALE_ORDER = ["ru", "kk", "en"];

export const parseMultilangField = (value, locale) => {
  if (!value) return "";

  const parts = value.split("|").map((p) => p.trim());
  const index = LOCALE_ORDER.indexOf(locale);

  return parts[index] || parts[0] || "";
};
