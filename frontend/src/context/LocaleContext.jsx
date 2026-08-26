import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const LocaleContext = createContext();

const SUPPORTED_LOCALES = ["ru", "kk", "en"];

function getLocaleFromPath() {
  const segment = window.location.pathname.split("/")[1];
  return SUPPORTED_LOCALES.includes(segment) ? segment : null;
}

export function LocaleProvider({ children }) {
  const location = useLocation();
  const [locale, setLocale] = useState(
    () => getLocaleFromPath() || localStorage.getItem("locale") || "ru",
  );

  useEffect(() => {
    const pathLocale = getLocaleFromPath();
    if (pathLocale && pathLocale !== locale) {
      setLocale(pathLocale);
    }
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
