import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SideMenu from "../sidemenu/SideMenu";
import SEO from "../../../seo/SEO.jsx";

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

function ArticleItem({ item, isFirst }) {
  const date = new Date(item.publishDate);
  const imgUrl = item.desc_img?.formats?.small?.url || item.desc_img?.url;

  return (
    <div className="artscontent">
      {isFirst && (
        <Link to="/articles" className="back">
          <svg className="arrow_reverse" viewBox="0 0 5 9">
            <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>
          </svg>
          Все статьи
        </Link>
      )}
      <div className="artscontent__header">
        <p className="cat">{item.tags?.[0]?.name}</p>
        <div className="artscontent__header-date">
          <p>
            {date.toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <h2 className="artscontent__title">{item.title}</h2>
      <img src={imgUrl} alt="desc_img" className="artscontent__img" />
      <hr />
      <div className="artscontent__main">
        {item.content?.map((block, i) => renderBlock(block, i))}
      </div>
    </div>
  );
}

export default function ArticlesContent() {
  const { documentId } = useParams();
  const [articlesList, setArticlesList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    setArticlesList([]);
    setHasMore(true);

    fetch(
      `https://hcs-production-423d.up.railway.app/api/articles/${documentId}?populate=*`,
    )
      .then((res) => res.json())
      .then((data) => setArticlesList([data.data]));
  }, [documentId]);

  const loadNext = useCallback(async () => {
    if (articlesList.length === 0) return;

    const last = articlesList[articlesList.length - 1];

    const res = await fetch(
      `https://hcs-production-423d.up.railway.app/api/articles?populate=*&sort=publishDate:desc&pagination[pageSize]=1&filters[publishDate][$lt]=${last.publishDate}`,
    );
    const data = await res.json();
    const next = data.data?.[0];

    if (next) {
      setArticlesList((prev) => [...prev, next]);
    } else {
      setHasMore(false);
    }
  }, [articlesList]);

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

  if (articlesList.length === 0) return <h2>Загрузка...</h2>;

  return (
    <div className="artscontent__layout">
      <SEO
        title={mainItem.title}
        description={mainItem.tags?.[0]?.name}
        image={imgUrl}
        type="article"
      />
      <div className="artscontent__layout-main">
        {articlesList.map((item, index) => (
          <ArticleItem key={item.id} item={item} isFirst={index === 0} />
        ))}

        {hasMore && <div ref={loaderRef} style={{ height: "60px" }} />}

        {!hasMore && (
          <p style={{ textAlign: "center", padding: "2rem" }}>
            Больше статей нет
          </p>
        )}
      </div>
      <div className="artscontent__layout-sidemenu">
        <SideMenu currentId={documentId} />
      </div>
    </div>
  );
}
