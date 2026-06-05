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

export default function ArticlesContent() {
  const { documentId } = useParams();
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    fetch(
      `https://hcs-production-423d.up.railway.app/api/articles/${documentId}?populate=*`,
    )
      .then((res) => res.json())
      .then((data) => setArticles(data.data));
  }, [documentId]);

  if (!articles) return <h2>Загрузка...</h2>;

  const date = new Date(articles.publishDate);

  const imgUrl =
    articles.desc_img?.formats?.small?.url || articles.desc_img?.url;

  return (
    <div className="artscontent">
      <Link to="/articles" className="back">
        <svg className="arrow_reverse" viewBox="0 0 5 9">
          <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>
        </svg>
        Все статьи
      </Link>
      <div className="artscontent__header">
        <p className="cat">{articles.tags?.[0]?.name}</p>
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
      <h2 className="artscontent__title">{articles.title}</h2>
      <img src={imgUrl} alt="desc_img" className="artscontent__img" />
      <hr />
      <div className="artscontent__main">
        {articles.content?.map((block, i) => renderBlock(block, i))}
      </div>
    </div>
  );
}
