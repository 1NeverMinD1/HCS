import { Link } from "react-router-dom";

export default function ArticlesFirstBlock({ article }) {
  const imageUrl = article?.desc_img?.url
    ? article.desc_img.url.startsWith("http")
      ? article.desc_img.url
      : `https://hcs-production-423d.up.railway.app${article.desc_img.url}`
    : "";

  const category = article?.tags?.[0]?.name || "";

  const text = article?.content?.[0]?.children?.[0]?.text || "";

  return (
    <Link
      to={`/articles/${article.documentId}`}
      className="articles__first-block"
    >
      {imageUrl && <img src={imageUrl} alt={article.title} />}

      <div className="articles__first-content">
        <p className="articles__first-cat">{category}</p>
        <h3 className="articles__first-title">{article.title}</h3>

        <p className="articles__first-date">
          {new Date(article.publishDate).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
