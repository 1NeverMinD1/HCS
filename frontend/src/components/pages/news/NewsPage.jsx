import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "../../../utils/useTranslation.js";
import { getLangField } from "../../../utils/getLangField.js";
import NewsPageBlocks from "./NewsPageBlocks/NewsPageBlocks";
import NewsPageList from "./NewsPageList/NewsPageList";
import { useLocale } from "../../../context/LocaleContext";
import SEO from "../../SEO/SEO.jsx";
import Breadcrumbs from "../../breadcrumbs/Breadcrumbs.jsx";
import NotFoundContent from "../../notFound/NotFoundContent.jsx";
import "./_NewsPage.scss";

const PAGE_SIZE = 20;

const CATEGORY_DESCRIPTIONS = {
  ru: (name) =>
    `${name} — новости жилищно-коммунального хозяйства Казахстана на портале ЖКХ24.`,
  kk: (name) =>
    `${name} — Қазақстанның тұрғын үй-коммуналдық шаруашылығы жаңалықтары ЖКХ24 порталында.`,
  en: (name) =>
    `${name} — housing and utilities news from Kazakhstan on the ZhKH24 portal.`,
};

let listSnapshotUsed = false;

function readListSnapshot(key) {
  if (listSnapshotUsed) return null;
  const el = document.getElementById("list-data");
  if (!el) return null;
  try {
    const parsed = JSON.parse(el.textContent);
    if (parsed?.key !== key || !Array.isArray(parsed.data)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function NewsPage() {
  const { id } = useParams();
  const location = useLocation();
  const isMain = location.pathname.endsWith("/news/main");
  const isCategory = Boolean(id) && !isMain;
  const { locale } = useLocale();

  const [snapshot] = useState(() =>
    !id && !isMain ? readListSnapshot("news") : null,
  );

  const [news, setNews] = useState(() => snapshot?.data || []);
  const [category, setCategory] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(() =>
    snapshot ? snapshot.pagination.page < snapshot.pagination.pageCount : true,
  );
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef(null);
  const isFirstRender = useRef(true);
  const skipFirstFetch = useRef(Boolean(snapshot));

  const { t } = useTranslation();

  useEffect(() => {
    listSnapshotUsed = true;
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    skipFirstFetch.current = false;
    setNews([]);
    setPage(1);
    setHasMore(true);
    setCategory(null);
    setNotFound(false);
  }, [id, isMain]);

  useEffect(() => {
    if (!isCategory) return;

    let cancelled = false;

    fetch(
      `https://api.zhkh24.kz/api/header-cats?filters[id][$eq]=${id}` +
        `&fields[0]=name_ru&fields[1]=name_kk&fields[2]=name_en`,
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const cat = data.data?.[0];
        if (cat) setCategory(cat);
        else setNotFound(true);
      })
      .catch((err) => console.error("Failed to fetch category:", err));

    return () => {
      cancelled = true;
    };
  }, [id, isCategory]);

  useEffect(() => {
    if (page === 1 && skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return;
    }

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
        `&populate[desc_img][fields][2]=width` +
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

      try {
        const res = await fetch(url);
        const data = await res.json();

        const newItems = data.data || [];

        setNews((prev) => {
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
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
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

  if (notFound) return <NotFoundContent />;

  if ((isCategory && !category) || (!news.length && (loading || hasMore))) {
    return <h2 className="empty wrapper">{t("loading")}</h2>;
  }

  const categoryName = category ? getLangField(category, "name", locale) : null;

  const heroNews = news[0];
  const topNews = news.slice(1, 4);
  const restNews = news.slice(4);

  const title = isMain ? t("mainNewsTitle") : (categoryName ?? t("news"));

  const lang = locale.split("-")[0];
  const seoTitle = isMain || isCategory ? title : t("seo_static_title_news");
  const seoDescription =
    isCategory && categoryName
      ? (CATEGORY_DESCRIPTIONS[lang] || CATEGORY_DESCRIPTIONS.ru)(categoryName)
      : t("seo_static_desc_news");

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
        title={seoTitle}
        description={seoDescription}
        breadcrumbs={breadcrumbItems}
      />
      <h1 className="newspage__title">{title}</h1>
      <Breadcrumbs items={breadcrumbItems} />

      {news.length === 0 ? (
        <p className="newspage__empty">{t("noContent")}</p>
      ) : (
        <>
          <NewsPageBlocks hero={heroNews} list={topNews} />

          <div className="more_news">
            <hr />
            <p>{t("moreNews")}</p>
            <hr />
          </div>

          <NewsPageList
            news={restNews}
            loaderRef={hasMore ? loaderRef : null}
          />
        </>
      )}

      {loading && (
        <p style={{ textAlign: "center", padding: "20px" }}>{t("loading")}</p>
      )}
    </div>
  );
}
