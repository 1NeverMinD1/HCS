import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "../../../utils/useTranslation.js";
import { getLangField } from "../../../utils/getLangField.js";
import NewsPageBlocks from "./NewsPageBlocks/NewsPageBlocks";
import NewsPageList from "./NewsPageList/NewsPageList";
import { useLocale } from "../../../context/LocaleContext";
import SEO from "../../SEO/SEO.jsx";
import Breadcrumbs from "../../breadcrumbs/Breadcrumbs.jsx";
// Styles
import "./_NewsPage.scss";

const PAGE_SIZE = 20;

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [categoryName, setCategoryName] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef(null);

  const { t } = useTranslation();

  const { id } = useParams();
  const location = useLocation();
  const isMain = location.pathname.endsWith("/news/main");
  const { locale } = useLocale();

  useEffect(() => {
    setNews([]);
    setPage(1);
    setHasMore(true);
    setCategoryName(null);
  }, [id, isMain]);

  useEffect(() => {
    async function fetchNews() {
      if (loading || !hasMore) return;

      setLoading(true);

      let url;

      const POPULATE_PARAMS =
        `&fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en` +
        `&fields[3]=desc_ru&fields[4]=desc_kk&fields[5]=desc_en` +
        `&fields[6]=slug&fields[7]=publishDate` +
        `&populate[desc_img][fields][0]=url` +
        `&populate[desc_img][fields][1]=formats` +
        `&populate[header_cats][fields][0]=name_ru` +
        `&populate[header_cats][fields][1]=name_kk` +
        `&populate[header_cats][fields][2]=name_en`;

      if (isMain) {
        url =
          `https://api.zhkh24.kz/api/news?filters[main][$eq]=true` +
          `&sort=publishDate:desc&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}` +
          POPULATE_PARAMS;
      } else if (id) {
        url =
          `https://api.zhkh24.kz/api/news?filters[header_cats][id][$eq]=${id}` +
          `&sort=publishDate:desc&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}` +
          POPULATE_PARAMS;
      } else {
        url =
          `https://api.zhkh24.kz/api/news?sort=publishDate:desc` +
          `&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}` +
          POPULATE_PARAMS;
      }

      const res = await fetch(url);
      const data = await res.json();

      const newItems = data.data || [];

      setNews((prev) => {
        if (page === 1) return newItems;

        const ids = new Set(prev.map((item) => item.id));
        return [...prev, ...newItems.filter((item) => !ids.has(item.id))];
      });

      if (page === 1 && id && newItems.length > 0) {
        const cat = newItems[0].header_cats?.find(
          (c) => String(c.id) === String(id),
        );
        setCategoryName(getLangField(cat, "name", locale) || null);
      }

      if (page === 1 && !id) {
        setCategoryName(null);
      }

      const pagination = data.meta?.pagination;

      if (pagination) {
        setHasMore(pagination.page < pagination.pageCount);
      } else {
        setHasMore(false);
      }

      setLoading(false);
    }

    fetchNews();
  }, [page, id, isMain]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      {
        rootMargin: "800px",
      },
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading, news]);

  if (!news.length) {
    return <h2 className="empty wrapper">Новостей нет</h2>;
  }

  const heroNews = news[0];
  const topNews = news.slice(1, 4);
  const restNews = news.slice(4);

  const title = isMain ? "Главные новости" : (categoryName ?? t("news"));

  const breadcrumbItems = [
    { name: t("home") || "Главная", url: `/${locale}` },
    ...(isMain || !id
      ? [{ name: t("news") || "Новости" }]
      : [
          { name: t("news") || "Новости", url: `/${locale}/news` },
          { name: categoryName || t("news") },
        ]),
  ];

  return (
    <div className="newspage wrapper">
      <SEO
        title={t("seo_static_title_news")}
        description={t("seo_static_desc_news")}
        breadcrumbs={breadcrumbItems}
      />
      <h1 className="newspage__title">{title}</h1>
      <Breadcrumbs items={breadcrumbItems} />
      <NewsPageBlocks hero={heroNews} list={topNews} />

      <div className="more_news">
        <hr />
        <p>{t("moreNews")}</p>
        <hr />
      </div>

      <NewsPageList news={restNews} loaderRef={hasMore ? loaderRef : null} />

      {loading && (
        <p style={{ textAlign: "center", padding: "20px" }}>{t("loading")}</p>
      )}
    </div>
  );
}
