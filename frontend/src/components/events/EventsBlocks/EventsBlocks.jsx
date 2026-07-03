import { useEffect, useRef } from "react";
import EventsBlock from "./EventsBlock/EventsBlock";

export default function EventsBlocks({ events }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!events?.length || !containerRef.current) return;

    const middleIndex = Math.floor(events.length / 2);
    const container = containerRef.current;
    const middleElement = container.children[middleIndex];

    if (middleElement) {
      middleElement.scrollIntoView({
        behavior: "instant",
        inline: "center",
        block: "nearest",
      });
    }
  }, [events]);

  if (!events?.length) return null;

  return (
    <div className="events__blocks" ref={containerRef}>
      {events.map((event) => (
        <EventsBlock key={event.id} event={event} />
      ))}
    </div>
  );
}
