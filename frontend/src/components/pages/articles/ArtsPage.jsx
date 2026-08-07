import { useEffect, useRef, useState } from "react";
import { useLocale } from "../../../context/LocaleContext.jsx";
import { useTranslation } from "../../../utils/useTranslation.js";
import ArtsPageBlocks from "./ArtsPageBlocks/ArtsPageBlocks";
import SEO from "../../SEO/SEO.jsx";

const PAGE_SIZE = 20;

export default function ArtsPage() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef(null);

  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
  }, []);

  useEffect(() => {
    async function fetchArticles() {
      if (loading || !hasMore) return;

      setLoading(true);

      const res = await fetch(
        `https://api.zhkh24.kz/api/articles?populate=*&sort=publishDate:desc&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`,
      );

      const data = await res.json();

      const newItems = data.data || [];

      setArticles((prev) => {
        if (page === 1) return newItems;

        const ids = new Set(prev.map((item) => item.id));
        return [...prev, ...newItems.filter((item) => !ids.has(item.id))];
      });

      const pagination = data.meta?.pagination;

      if (pagination) {
        setHasMore(pagination.page < pagination.pageCount);
      } else {
        setHasMore(false);
      }

      setLoading(false);
    }

    fetchArticles();
  }, [page]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      {
        rootMargin: "400px",
      },
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  if (!articles.length) return null;

  return (
    <div className="artspage wrapper">
      <SEO
        title={t("seo_static_title_arts")}
        description={t("seo_static_desc_arts")}
      />

      <h2 className="artspage__title">{t("artsIntro")}</h2>
      <p className="artspage__intro">{t("artsIntroText")}</p>

      <ArtsPageBlocks articles={articles} />

      {loading && (
        <p style={{ textAlign: "center", padding: "20px" }}>{t("loading")}</p>
      )}

      {hasMore && <div ref={loaderRef} style={{ height: 1 }} />}
    </div>
  );
}
