import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function renderBlock(block, i) {
  switch (block.type) {
    case "paragraph": {
      const text = block.children?.[0]?.text;
      if (!text) return null;
      return <p key={i}>{text}</p>;
    }
    case "heading": {
      const Tag = `h${block.level}`;
      return <Tag key={i}>{block.children?.[0]?.text}</Tag>;
    }
    case "quote":
      return <blockquote key={i}>{block.children?.[0]?.text}</blockquote>;
    case "image":
      return (
        <img
          key={i}
          src={block.image.url}
          alt={block.image.alternativeText || ""}
        />
      );
    case "list":
      const ListTag = block.format === "ordered" ? "ol" : "ul";
      return (
        <ListTag key={i}>
          {block.children.map((item, j) => (
            <li key={j}>{item.children?.[0]?.text}</li>
          ))}
        </ListTag>
      );
    default:
      return null;
  }
}

export default function EventsContent() {
  const { documentId } = useParams();
  const [events, setEvents] = useState(null);

  useEffect(() => {
    fetch(
      `https://hcs-production-423d.up.railway.app/api/events/${documentId}?populate=*`,
    )
      .then((res) => res.json())
      .then((data) => setEvents(data.data));
  }, [documentId]);

  if (!events) return <h2>Загрузка...</h2>;

  const date = new Date(events.publishDate);

  const imgUrl = events.desc_img?.formats?.small?.url || events.desc_img?.url;

  return (
    <div className="eventscontent">
      <Link to="/events" className="back">
        <svg
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          className="arrow-left"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.008 10.996L2.004 7.992l5.004-2.996v1.997h6.996v1.998H7.008v2.005z"
          ></path>
        </svg>
        Все события
      </Link>
      <div className="eventscontent__header">
        <p className="cat">{events.event_cats?.[0]?.name}</p>
        <div className="eventscontent__header-date">
          <p>
            {date.toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <h2 className="eventscontent__title">{events.name}</h2>
      <img src={imgUrl} alt="desc_img" className="eventscontent__img" />
      <hr />
      <div className="eventscontent__main">
        {events.content?.map((block, i) => renderBlock(block, i))}
      </div>
    </div>
  );
}
