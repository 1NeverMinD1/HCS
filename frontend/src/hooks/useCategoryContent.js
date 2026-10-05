import { useEffect, useState, useCallback } from "react";

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

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
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

      try {
        const res = await fetch(
          `https://api.zhkh24.kz/api/${endpoint}?filters[${relationField}][id][$eq]=${filterId}` +
            `&sort=${sortField}:desc&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}` +
            `&fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en` +
            descFields +
            `&fields[6]=slug&fields[7]=${sortField}` +
            imagePopulate,
        );

        const data = await res.json();
        const newItems = data.data || [];

        setItems((prev) => {
          if (page === 1) return newItems;
          const ids = new Set(prev.map((item) => item.id));
          return [...prev, ...newItems.filter((item) => !ids.has(item.id))];
        });

        const pagination = data.meta?.pagination;
        setHasMore(pagination ? pagination.page < pagination.pageCount : false);
      } catch (err) {
        console.error(`Failed to fetch ${endpoint}:`, err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [page, endpoint, filterId, relationField]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage((prev) => prev + 1);
  }, [loading, hasMore]);

  return { items, hasMore, loading, loadMore };
}
