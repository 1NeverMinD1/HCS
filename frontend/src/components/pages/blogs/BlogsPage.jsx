import { useEffect, useRef, useState } from "react";
import { useLocale } from "../../../context/LocaleContext.jsx";
import BlogsPageBlocks from "./BlogsPageBlocks/BlogsPageBlocks";
import { useTranslation } from "../../../utils/useTranslation.js";
import SEO from "../../SEO/SEO.jsx";
import Breadcrumbs from "../../breadcrumbs/Breadcrumbs.jsx";
// Styles
import "./_BlogsPage.scss";

const PAGE_SIZE = 20;

export default function BlogsPage() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef(null);

  useEffect(() => {
    setBlogs([]);
    setPage(1);
    setHasMore(true);
  }, []);

  useEffect(() => {
    async function fetchBlogs() {
      if (loading || !hasMore) return;

      setLoading(true);

      const res = await fetch(
        `https://api.zhkh24.kz/api/blogs?sort=publishDate:desc&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}` +
          `&fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en` +
          `&fields[3]=desc_ru&fields[4]=desc_kk&fields[5]=desc_en` +
          `&fields[6]=slug&fields[7]=publishDate` +
          `&populate[back_img][fields][0]=url` +
          `&populate[back_img][fields][1]=formats` +
          `&populate[authors][fields][0]=name_ru` +
          `&populate[authors][fields][1]=name_kk` +
          `&populate[authors][fields][2]=name_en` +
          `&populate[authors][fields][3]=position_ru` +
          `&populate[authors][fields][4]=position_kk` +
          `&populate[authors][fields][5]=position_en` +
          `&populate[authors][fields][6]=slug` +
          `&populate[authors][populate][profile_img][fields][0]=url` +
          `&populate[authors][populate][profile_img][fields][1]=formats` +
          `&populate[categories][fields][0]=name_ru` +
          `&populate[categories][fields][1]=name_kk` +
          `&populate[categories][fields][2]=name_en` +
          `&populate[tags][fields][0]=name_ru` +
          `&populate[tags][fields][1]=name_kk` +
          `&populate[tags][fields][2]=name_en`,
      );

      const data = await res.json();

      const newItems = data.data || [];

      setBlogs((prev) => {
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

    fetchBlogs();
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

  if (!blogs.length) {
    return <h2 className="empty wrapper">Блогов нет</h2>;
  }

  const breadcrumbItems = [
    { name: t("home") || "Главная", url: `/${locale}` },
    { name: t("blogs") || "Блоги" },
  ];

  return (
    <div className="blogspage wrapper">
      <SEO
        title={t("seo_static_title_blogs")}
        description={t("seo_static_desc_blogs")}
        breadcrumbs={breadcrumbItems}
      />

      <h1 className="blogspage__title">{t("blogsIntro")}</h1>
      <p className="blogspage__intro">{t("blogsIntroText")}</p>
      <Breadcrumbs items={breadcrumbItems} />

      <BlogsPageBlocks blogs={blogs} />

      {loading && (
        <p style={{ textAlign: "center", padding: "20px" }}>{t("loading")}</p>
      )}

      {hasMore && <div ref={loaderRef} style={{ height: 1 }} />}
    </div>
  );
}
