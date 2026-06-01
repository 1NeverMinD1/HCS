import { useEffect, useState } from "react";
import EventsBlocks from "./EventsBlocks/EventsBlocks";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "https://hcs-production-423d.up.railway.app/api/events?populate=desc_img&sort=start:asc&pagination[pageSize]=3",
      );
      const data = await res.json();
      setEvents(data.data);
    }

    fetchData();
  }, []);

  return (
    <div className="events wrapper">
      <div className="events__header">
        <h2 className="events__header-title">Предстоящие события</h2>
        <a className="view_all">Все события</a>
      </div>

      <EventsBlocks events={events} />
    </div>
  );
}
