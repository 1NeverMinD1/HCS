import { useEffect, useState, useCallback } from "react";
import { useLocale } from "../context/LocaleContext.jsx";
import { getLangField } from "../utils/getLangField.js";

const PAGE_SIZE = 3;

export default function useCategoryContent(
  endpoint,
  filterId,
  relationField,
  { imageField = null, sortField = "publishDate", hasDesc = true } = {},
) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState(null);
  const { locale } = useLocale();

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setCategoryName(null);
  }, [endpoint, filterId, relationField]);

  useEffect(() => {
    async function fetchItems() {
      if (loading || !hasMore || !filterId) return;

      setLoading(true);

      const descFields = hasDesc
        ? `&fields[3]=desc_ru&fields[4]=desc_kk&fields[5]=desc_en`
        : "";

      const imagePopulate = imageField
        ? `&populate[${imageField}][fields][0]=url&populate[${imageField}][fields][1]=formats`
        : "";

      const res = await fetch(
        `https://api.zhkh24.kz/api/${endpoint}?filters[${relationField}][id][$eq]=${filterId}` +
          `&sort=${sortField}:desc&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}` +
          `&fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en` +
          descFields +
          `&fields[6]=slug&fields[7]=${sortField}` +
          imagePopulate +
          `&populate[${relationField}][fields][0]=name_ru&populate[${relationField}][fields][1]=name_kk&populate[${relationField}][fields][2]=name_en`,
      );

      const data = await res.json();
      const newItems = data.data || [];

      setItems((prev) => {
        if (page === 1) return newItems;
        const ids = new Set(prev.map((item) => item.id));
        return [...prev, ...newItems.filter((item) => !ids.has(item.id))];
      });

      if (page === 1 && newItems[0]?.[relationField]?.[0]) {
        setCategoryName(
          getLangField(newItems[0][relationField][0], "name", locale),
        );
      }

      const pagination = data.meta?.pagination;
      setHasMore(pagination ? pagination.page < pagination.pageCount : false);
      setLoading(false);
    }

    fetchItems();
  }, [page, endpoint, filterId, relationField]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage((prev) => prev + 1);
  }, [loading, hasMore]);

  return { items, hasMore, loading, loadMore, categoryName };
}
