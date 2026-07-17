import React from "react";
import EventsPageBlocks from "./EventsPageBlocks/EventsPageBlocks";
import { useState, useEffect } from "react";
import { useLocale } from "../../../context/LocaleContext";
import { useTranslation } from "../../../utils/useTranslation.js";
import SEO from "../../SEO/SEO.jsx";

export default function EventsPage() {
  const { locale } = useLocale();
  const [events, setEvents] = useState([]);
  const { t } = useTranslation(locale);

  useEffect(() => {
    fetch(`https://api.zhkh24.kz/api/events?populate=*&sort=start:desc`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.data || []);
      });
  }, []);
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
    </div>
  );
}
