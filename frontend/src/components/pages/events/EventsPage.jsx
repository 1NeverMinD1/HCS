import { useEffect, useRef, useState } from "react";
import EventsPageBlocks from "./EventsPageBlocks/EventsPageBlocks";
import { useLocale } from "../../../context/LocaleContext";
import { useTranslation } from "../../../utils/useTranslation.js";
import SEO from "../../SEO/SEO.jsx";

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
        `https://api.zhkh24.kz/api/events?populate=*&sort=start:desc&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`,
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

  if (!events.length) return null;

  return (
    <div className="eventspage wrapper">
      <SEO
        title={t("seo_static_title_events")}
        description={t("seo_static_desc_events")}
      />

      <h2 className="eventspage__title">{t("eventsIntro")}</h2>
      <p className="eventspage__intro">{t("eventsIntroText")}</p>

      <EventsPageBlocks events={events} />

      {loading && (
        <p style={{ textAlign: "center", padding: "20px" }}>{t("loading")}</p>
      )}

      {hasMore && <div ref={loaderRef} style={{ height: 1 }} />}
    </div>
  );
}
