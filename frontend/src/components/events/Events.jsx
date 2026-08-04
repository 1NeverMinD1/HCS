import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventsBlocks from "./EventsBlocks/EventsBlocks";
import { useLocale } from "../../context/LocaleContext.jsx";
import { useTranslation } from "../../utils/useTranslation.js";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useLocale();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchData() {
      const today = new Date().toISOString().split("T")[0];

      const params = new URLSearchParams({
        "fields[0]": "title_ru",
        "fields[1]": "title_kk",
        "fields[2]": "title_en",

        "fields[3]": "desc_ru",
        "fields[4]": "desc_kk",
        "fields[5]": "desc_en",

        "fields[6]": "place_ru",
        "fields[7]": "place_kk",
        "fields[8]": "place_en",

        "fields[9]": "slug",
        "fields[10]": "start",
        "fields[11]": "end",
        "fields[12]": "amount",

        "populate[cover_img][fields][0]": "url",
        "populate[cover_img][fields][1]": "formats",

        "populate[desc_img][fields][0]": "url",
        "populate[desc_img][fields][1]": "formats",

        "populate[categories][fields][0]": "name_ru",
        "populate[categories][fields][1]": "name_kk",
        "populate[categories][fields][2]": "name_en",

        sort: "start:asc",
        "pagination[page]": "2",
        "pagination[pageSize]": "3",
      });

      params.append("filters[$or][0][end][$gte]", today);
      params.append("filters[$or][1][end][$null]", "true");
      params.append("filters[$or][1][start][$gte]", today);

      const res = await fetch(
        `https://api.zhkh24.kz/api/events?${params.toString()}`,
      );
      const data = await res.json();
      setEvents(data.data);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  if (isLoading) return null;
  if (!events || events.length === 0) return null;

  return (
    <div className="events wrapper">
      <div className="events__header">
        <h2 className="events__header-title">{t("futureEvents")}</h2>
        <Link to={`/${locale}/events`} className="view_all">
          {t("allEvents")}
          <svg className="arrow" viewBox="0 0 5 9">
            <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>
          </svg>
        </Link>
      </div>

      <EventsBlocks events={events} />
    </div>
  );
}
