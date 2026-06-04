import React from "react";
import EventsPageBlocks from "./EventsPageBlocks/EventsPageBlocks";
import { useState, useEffect } from "react";

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("https://hcs-production-423d.up.railway.app/api/events?populate=*")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.data || []);
      });
  }, []);
  if (!events.length) return null;

  return (
    <div className="eventspage wrapper">
      <h2 className="eventspage__title">События и мероприятия</h2>
      <p className="eventspage__intro">
        Конференции, выставки, встречи и другие события
      </p>
      <EventsPageBlocks events={events} />
    </div>
  );
}
