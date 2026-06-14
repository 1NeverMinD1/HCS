import { createContext, useContext, useState } from "react";

const LocaleContext = createContext();

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState("ru-RU");
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
