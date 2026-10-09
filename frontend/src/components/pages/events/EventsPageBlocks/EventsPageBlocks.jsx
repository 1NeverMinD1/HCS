import EventsPageBlock from "./EventsPageBlock/EventsPageBlock";
import "./_EventsPageBlocks.scss";

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
        {normalEvents.map((item, index) => (
          <EventsPageBlock key={item.id} event={item} index={index} />
        ))}
      </div>

      {lastRow.length > 0 && (
        <div className="eventspage__list">
          {lastRow.map((item, index) => (
            <EventsPageBlock
              key={item.id}
              event={item}
              index={normalEvents.length + index}
            />
          ))}
        </div>
      )}
    </>
  );
}
