import { useEffect, useState, useRef, useCallback } from "react";
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

function NewsItem({ item, isFirst }) {
  const date = new Date(item.publishDate);
  const imgUrl = item.desc_img?.formats?.small?.url || item.desc_img?.url;

  return (
    <div className="newscontent">
      {isFirst && (
        <Link to="/news" className="back">
          <svg className="arrow_reverse" viewBox="0 0 5 9">
            <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>
          </svg>
          Все новости
        </Link>
      )}
      <div className="newscontent__header">
        <p className="cat">{item.categories?.[0]?.name}</p>
        <div className="newscontent__header-date">
          <p>
            {date.toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <h2 className="newscontent__title">{item.title}</h2>
      <p className="newscontent__intro">{item.desc}</p>
      <img src={imgUrl} alt="desc_img" className="newscontent__img" />
      <hr />
      <div className="newscontent__main">
        {item.content?.map((block, i) => renderBlock(block, i))}
      </div>
    </div>
  );
}

export default function NewsContent() {
  const { documentId } = useParams();
  const [newsList, setNewsList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    setNewsList([]);
    setHasMore(true);

    fetch(
      `https://hcs-production-423d.up.railway.app/api/news/${documentId}?populate=*`,
    )
      .then((res) => res.json())
      .then((data) => setNewsList([data.data]));
  }, [documentId]);

  const loadNext = useCallback(async () => {
    if (newsList.length === 0) return;

    const last = newsList[newsList.length - 1];

    const res = await fetch(
      `https://hcs-production-423d.up.railway.app/api/news?populate=*&sort=publishDate:desc&pagination[pageSize]=1&filters[publishDate][$lt]=${last.publishDate}`,
    );
    const data = await res.json();
    const next = data.data?.[0];

    if (next) {
      setNewsList((prev) => [...prev, next]);
    } else {
      setHasMore(false);
    }
  }, [newsList]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadNext();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadNext, hasMore]);

  if (newsList.length === 0) return <h2>Загрузка...</h2>;

  return (
    <div>
      {newsList.map((item, index) => (
        <NewsItem key={item.id} item={item} isFirst={index === 0} />
      ))}

      {hasMore && <div ref={loaderRef} style={{ height: "60px" }} />}

      {!hasMore && (
        <p style={{ textAlign: "center", padding: "2rem" }}>
          Больше новостей нет
        </p>
      )}
    </div>
  );
}
