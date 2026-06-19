import { useLocale } from "../context/LocaleContext.jsx";
import { translations } from "./translations.js";

export const useTranslation = () => {
  const { locale } = useLocale();
  const dict = translations[locale] || translations.ru;

  const t = (key) => dict[key] || key;

  return { t, locale };
};
