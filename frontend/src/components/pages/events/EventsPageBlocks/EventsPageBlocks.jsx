import EventsPageBlock from "./EventsPageBlock/EventsPageBlock";

export default function EventsPageBlocks({ events }) {
  return (
    <div className="eventspage__list">
      {events.map((item) => (
        <EventsPageBlock key={item.id} event={item} />
      ))}
    </div>
  );
}
