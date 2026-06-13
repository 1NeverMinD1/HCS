import { Link } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";

export default function ArticlesBlock({ article }) {
  const { locale } = useLocale();

  const imgUrl =
    article.desc_img?.formats?.small?.url ||
    article.desc_img?.formats?.medium?.url ||
    article.desc_img?.url;

  const category = article?.tags?.[0]?.name || "";
  const text = article?.content?.[0]?.children?.[0]?.text || "";

  const slug =
    article.title
      ?.toLowerCase()
      .replace(/[^\wа-яё\s]/gi, "")
      .replace(/\s+/g, "-") || "";

  return (
    <Link
      to={`/${locale}/articles/${article.documentId}/${slug}`}
      className="articles__block"
    >
      <div className="img_wrapper">
        <img src={imgUrl} alt={article.title} />
      </div>

      <div className="articles__block-content">
        <p className="articles__block-cat">{category}</p>
        <h3 className="articles__block-title">{article.title}</h3>
        <p className="articles__block-text">{text}</p>

        <p className="articles__block-date">
          {new Date(article.publishDate).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
