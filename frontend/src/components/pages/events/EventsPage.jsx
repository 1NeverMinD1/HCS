import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EventsPageBlocks from "./EventsPageBlocks/EventsPageBlocks";
import { useLocale } from "../../../context/LocaleContext";
import { useTranslation } from "../../../utils/useTranslation.js";
import {
  getTodayISO,
  buildEventFilters,
  toQuery,
} from "../../../utils/eventStatus.js";
import {
  readListSnapshot,
  markListSnapshotUsed,
} from "../../../utils/listSnapshot.js";
import SEO from "../../SEO/SEO.jsx";
import Breadcrumbs from "../../breadcrumbs/Breadcrumbs.jsx";
import "./_EventsPage.scss";

const PAGE_SIZE = 20;

const API_URL = "https://api.zhkh24.kz/api/events";

const FIELDS =
  `&fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en` +
  `&fields[3]=desc_ru&fields[4]=desc_kk&fields[5]=desc_en` +
  `&fields[6]=place_ru&fields[7]=place_kk&fields[8]=place_en` +
  `&fields[9]=slug&fields[10]=start&fields[11]=end` +
  `&fields[12]=start_time&fields[13]=amount&fields[14]=price` +
  `&populate[cover_img][fields][0]=url` +
  `&populate[cover_img][fields][1]=formats` +
  `&populate[cover_img][fields][2]=width` +
  `&populate[desc_img][fields][0]=url` +
  `&populate[desc_img][fields][1]=formats` +
  `&populate[desc_img][fields][2]=width` +
  `&populate[categories][fields][0]=name_ru` +
  `&populate[categories][fields][1]=name_kk` +
  `&populate[categories][fields][2]=name_en`;

const STATUSES = [
  { key: "all", labelKey: "filterAll" },
  { key: "upcoming", labelKey: "statusUpcoming" },
  { key: "running", labelKey: "statusRunning" },
  { key: "finished", labelKey: "statusFinished" },
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function readDate(value) {
  return value && DATE_RE.test(value) ? value : "";
}

export default function EventsPage() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [searchParams, setSearchParams] = useSearchParams();

  const statusParam = searchParams.get("status");
  const status = STATUSES.some((s) => s.key === statusParam)
    ? statusParam
    : "all";

  const rawFrom = readDate(searchParams.get("from"));
  const rawTo = readDate(searchParams.get("to"));
  const [from, to] =
    rawFrom && rawTo && rawFrom > rawTo ? [rawTo, rawFrom] : [rawFrom, rawTo];

  const today = getTodayISO();
  const filterKey = `${status}|${from}|${to}`;
  const hasFilters = status !== "all" || Boolean(from) || Boolean(to);

  const [snapshot] = useState(() =>
    hasFilters ? null : readListSnapshot("events"),
  );

  const [events, setEvents] = useState(() => snapshot?.data || []);
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const [hasMore, setHasMore] = useState(() =>
    snapshot ? snapshot.pagination.page < snapshot.pagination.pageCount : true,
  );
  const [loading, setLoading] = useState(() => !snapshot);

  const page = pageState.key === filterKey ? pageState.page : 1;

  const loaderRef = useRef(null);
  const skipFirstFetch = useRef(Boolean(snapshot));

  useEffect(() => {
    markListSnapshotUsed("events");
  }, []);

  useEffect(() => {
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    if (page === 1) {
      setEvents([]);
      setHasMore(true);
    }

    const filters = buildEventFilters({ status, from, to, today });
    const sort = status === "upcoming" ? "start:asc" : "start:desc";
    const filterQuery = filters
      ? "&" + toQuery(filters, "filters").join("&")
      : "";

    fetch(
      `${API_URL}?sort=${sort}&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}` +
        FIELDS +
        filterQuery,
      { signal: controller.signal },
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const newItems = data.data || [];

        setEvents((prev) => {
          if (page === 1) return newItems;
          const ids = new Set(prev.map((item) => item.id));
          return [...prev, ...newItems.filter((item) => !ids.has(item.id))];
        });

        const pagination = data.meta?.pagination;
        setHasMore(pagination ? pagination.page < pagination.pageCount : false);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("Failed to fetch events:", err);
        setHasMore(false);
        setLoading(false);
      });

    return () => controller.abort();
  }, [status, from, to, today, page]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setPageState((prev) => ({
            key: filterKey,
            page: (prev.key === filterKey ? prev.page : 1) + 1,
          }));
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading, filterKey]);

  const updateParam = (key, value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value && value !== "all") {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      },
      { replace: true },
    );
  };

  const resetFilters = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("status");
        next.delete("from");
        next.delete("to");
        return next;
      },
      { replace: true },
    );
  };

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

      <div className="eventspage__filters">
        <div className="eventspage__statuses" role="group">
          {STATUSES.map((item) => {
            const isActive = item.key === status;
            return (
              <button
                key={item.key}
                type="button"
                aria-pressed={isActive}
                className={
                  "eventspage__status" +
                  (isActive ? " eventspage__status--active" : "")
                }
                onClick={() => updateParam("status", item.key)}
              >
                {t(item.labelKey)}
              </button>
            );
          })}
        </div>

        <div className="eventspage__dates">
          <label className="eventspage__date">
            <span>{t("dateFrom")}</span>
            <input
              type="date"
              value={from}
              max={to || undefined}
              onChange={(e) => updateParam("from", e.target.value)}
            />
          </label>
          <label className="eventspage__date">
            <span>{t("dateTo")}</span>
            <input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(e) => updateParam("to", e.target.value)}
            />
          </label>
          {hasFilters && (
            <button
              type="button"
              className="eventspage__reset"
              onClick={resetFilters}
            >
              {t("resetFilters")}
            </button>
          )}
        </div>
      </div>

      {events.length > 0 && <EventsPageBlocks events={events} />}

      {!loading && events.length === 0 && (
        <p className="eventspage__empty">{t("noContent")}</p>
      )}

      {loading && <p className="eventspage__loading">{t("loading")}</p>}

      {hasMore && <div ref={loaderRef} style={{ height: 1 }} />}
    </div>
  );
}
