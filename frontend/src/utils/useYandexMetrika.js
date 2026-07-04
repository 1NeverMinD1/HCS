import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useYandexMetrika() {
  const location = useLocation();

  useEffect(() => {
    if (window.ym) {
      window.ym(110367191, "hit", location.pathname + location.search);
    }
  }, [location]);
}
