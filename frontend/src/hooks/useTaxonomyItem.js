import { useEffect, useState } from "react";

export default function useTaxonomyItem(endpoint, id) {
  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setItem(null);
    setNotFound(false);

    if (!id || !/^\d+$/.test(id)) {
      setNotFound(true);
      return;
    }

    let cancelled = false;

    fetch(
      `https://api.zhkh24.kz/api/${endpoint}?filters[id][$eq]=${id}` +
        `&fields[0]=name_ru&fields[1]=name_kk&fields[2]=name_en`,
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const first = data.data?.[0];
        if (first) setItem(first);
        else setNotFound(true);
      })
      .catch((err) => console.error(`Failed to fetch ${endpoint}:`, err));

    return () => {
      cancelled = true;
    };
  }, [endpoint, id]);

  return { item, notFound };
}
