import { useEffect, useState } from "react";
import EventsBlocks from "./EventsBlocks/EventsBlocks";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "https://hcs-production-423d.up.railway.app/api/events?populate=*&sort=start:asc&pagination[pageSize]=3",
      );
      const data = await res.json();
      setEvents(data.data);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  if (isLoading) return null;

  return (
    <div className="events wrapper">
      <div className="events__header">
        <h2 className="events__header-title">Предстоящие события</h2>
        <a className="view_all">
          Все события
          <svg className="arrow" viewBox="0 0 5 9">
            <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>
          </svg>
        </a>
      </div>

      <EventsBlocks events={events} />
    </div>
  );
}
