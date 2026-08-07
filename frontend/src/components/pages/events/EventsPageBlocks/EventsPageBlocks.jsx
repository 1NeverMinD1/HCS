import EventsPageBlock from "./EventsPageBlock/EventsPageBlock";

export default function EventsPageBlocks({ events }) {
  const remainder = events.length % 3;

  let normalEvents = events;
  let lastRow = [];

  if (events.length > 3 && remainder !== 0) {
    normalEvents = events.slice(0, events.length - (3 + remainder));
    lastRow = events.slice(-(3 + remainder));
  }

  return (
    <>
      <div className="eventspage__list">
        {normalEvents.map((item) => (
          <EventsPageBlock key={item.id} event={item} />
        ))}
      </div>

      {lastRow.length > 0 && (
        <div className="eventspage__list">
          {lastRow.map((item) => (
            <EventsPageBlock key={item.id} event={item} />
          ))}
        </div>
      )}
    </>
  );
}
