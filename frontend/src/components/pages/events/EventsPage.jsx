import { useEffect, useRef, useState } from "react";
import EventsPageBlocks from "./EventsPageBlocks/EventsPageBlocks";
import { useLocale } from "../../../context/LocaleContext";
import { useTranslation } from "../../../utils/useTranslation.js";
import SEO from "../../SEO/SEO.jsx";
import Breadcrumbs from "../../breadcrumbs/Breadcrumbs.jsx";
// Styles
import "./_EventsPage.scss";

const PAGE_SIZE = 20;

export default function EventsPage() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef(null);

  useEffect(() => {
    setEvents([]);
    setPage(1);
    setHasMore(true);
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      if (loading || !hasMore) return;

      setLoading(true);

      const res = await fetch(
        `https://api.zhkh24.kz/api/events?sort=start:desc&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}` +
          `&fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en` +
          `&fields[3]=desc_ru&fields[4]=desc_kk&fields[5]=desc_en` +
          `&fields[6]=place_ru&fields[7]=place_kk&fields[8]=place_en` +
          `&fields[9]=slug&fields[10]=start&fields[11]=end` +
          `&fields[12]=start_time&fields[13]=amount&fields[14]=price` +
          `&populate[cover_img][fields][0]=url` +
          `&populate[cover_img][fields][1]=formats` +
          `&populate[desc_img][fields][0]=url` +
          `&populate[desc_img][fields][1]=formats` +
          `&populate[categories][fields][0]=name_ru` +
          `&populate[categories][fields][1]=name_kk` +
          `&populate[categories][fields][2]=name_en`,
      );

      const data = await res.json();

      const newItems = data.data || [];

      setEvents((prev) => {
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

    fetchEvents();
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

  if (!events.length) {
    return <h2 className="empty wrapper">Событий нет</h2>;
  }

  const breadcrumbItems = [
    { name: t("home") || "Главная", url: `/${locale}` },
    { name: t("events") || "События" },
  ];

  return (
    <div className="eventspage wrapper">
      <SEO
        title={t("seo_static_title_events")}
        description={t("seo_static_desc_events")}
        breadcrumbs={breadcrumbItems}
      />

      <h1 className="eventspage__title">{t("eventsIntro")}</h1>
      <p className="eventspage__intro">{t("eventsIntroText")}</p>
      <Breadcrumbs items={breadcrumbItems} />
      <EventsPageBlocks events={events} />

      {loading && (
        <p style={{ textAlign: "center", padding: "20px" }}>{t("loading")}</p>
      )}

      {hasMore && <div ref={loaderRef} style={{ height: 1 }} />}
    </div>
  );
}
