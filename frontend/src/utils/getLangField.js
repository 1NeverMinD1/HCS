export const getLangField = (item, field, locale) => {
  const map = {
    ru: "ru",
    kk: "kk",
    en: "en",
  };

  const lang = map[locale] || "ru";

  return item?.[`${field}_${lang}`] || item?.[field] || "";
};
