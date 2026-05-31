import EventsBlock from "./EventsBlock/EventsBlock";

export default function EventsBlocks({ events }) {
  if (!events?.length) return null;

  return (
    <div className="events__blocks">
      {events.map((event) => (
        <EventsBlock key={event.id} event={event} />
      ))}
    </div>
  );
}
