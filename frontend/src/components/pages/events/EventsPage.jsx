import React from "react";
import EventsPageBlocks from "./EventsPageBlocks/EventsPageBlocks";
import { useState, useEffect } from "react";
import { useLocale } from "../../../context/LocaleContext";
import { useTranslation } from "../../../utils/useTranslation.js";
import SEO from "../../seo/SEO.jsx";

export default function EventsPage() {
  const { locale } = useLocale();
  const [events, setEvents] = useState([]);
  const { t } = useTranslation(locale);

  useEffect(() => {
    fetch(`https://hcs-production-423d.up.railway.app/api/events?populate=*`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.data || []);
      });
  }, []);
  if (!events.length) return null;

  return (
    <div className="eventspage wrapper">
      <SEO
        title="События и мероприятия"
        description="Конференции, выставки, встречи и другие события"
      />
      <h2 className="eventspage__title">{t("eventsIntro")}</h2>
      <p className="eventspage__intro">{t("eventsIntroText")}</p>
      <EventsPageBlocks events={events} />
    </div>
  );
}
