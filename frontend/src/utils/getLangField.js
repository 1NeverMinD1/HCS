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
