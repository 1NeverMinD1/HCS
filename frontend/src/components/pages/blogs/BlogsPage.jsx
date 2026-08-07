import { useEffect, useRef, useState } from "react";
import { useLocale } from "../../../context/LocaleContext.jsx";
import BlogsPageBlocks from "./BlogsPageBlocks/BlogsPageBlocks";
import { useTranslation } from "../../../utils/useTranslation.js";
import SEO from "../../SEO/SEO.jsx";

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
        `https://api.zhkh24.kz/api/blogs?populate[authors][populate]=profile_img&populate[back_img][populate]=*&sort=publishDate:desc&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`,
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

  if (!blogs.length) return null;

  return (
    <div className="blogspage wrapper">
      <SEO
        title={t("seo_static_title_blogs")}
        description={t("seo_static_desc_blogs")}
      />

      <h2 className="blogspage__title">{t("blogsIntro")}</h2>
      <p className="blogspage__intro">{t("blogsIntroText")}</p>

      <BlogsPageBlocks blogs={blogs} />

      {loading && (
        <p style={{ textAlign: "center", padding: "20px" }}>{t("loading")}</p>
      )}

      {hasMore && <div ref={loaderRef} style={{ height: 1 }} />}
    </div>
  );
}
