import { useEffect, useRef, useState } from "react";
import { useLocale } from "../../../context/LocaleContext.jsx";
import { useTranslation } from "../../../utils/useTranslation.js";
import ArtsPageBlocks from "./ArtsPageBlocks/ArtsPageBlocks";
import SEO from "../../SEO/SEO.jsx";
import Breadcrumbs from "../../breadcrumbs/Breadcrumbs.jsx";

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
        `https://api.zhkh24.kz/api/articles?sort=publishDate:desc&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}` +
          `&fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en` +
          `&fields[3]=desc_ru&fields[4]=desc_kk&fields[5]=desc_en` +
          `&fields[6]=slug&fields[7]=publishDate` +
          `&populate[desc_img][fields][0]=url` +
          `&populate[desc_img][fields][1]=formats` +
          `&populate[categories][fields][0]=name_ru` +
          `&populate[categories][fields][1]=name_kk` +
          `&populate[categories][fields][2]=name_en`,
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

  if (!articles.length) {
    return <h2 className="empty wrapper">Статей нет</h2>;
  }

  const breadcrumbItems = [
    { name: t("home") || "Главная", url: `/${locale}` },
    { name: t("articles") || "Статьи" },
  ];

  return (
    <div className="artspage wrapper">
      <SEO
        title={t("seo_static_title_arts")}
        description={t("seo_static_desc_arts")}
        breadcrumbs={breadcrumbItems}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="artspage__title">{t("artsIntro")}</h1>
      <p className="artspage__intro">{t("artsIntroText")}</p>

      <ArtsPageBlocks articles={articles} />

      {loading && (
        <p style={{ textAlign: "center", padding: "20px" }}>{t("loading")}</p>
      )}

      {hasMore && <div ref={loaderRef} style={{ height: 1 }} />}
    </div>
  );
}
