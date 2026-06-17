import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";

export default function ArticlesFirstBlock({ article }) {
  const { locale } = useLocale();

  const imgUrl =
    article.desc_img?.formats?.small?.url ||
    article.desc_img?.formats?.medium?.url ||
    article.desc_img?.url;

  const title = getLangField(article, "title", locale);

  const category = article?.tags?.[0]?.name || "";

  const text =
    article?.content?.find((block) => block.type === "paragraph")?.children?.[0]
      ?.text || "";

  const slug =
    title
      ?.toLowerCase()
      .trim()
      .replace(/[^\wа-яё\s-]/gi, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "";

  return (
    <Link
      to={`/${locale}/articles/${article.documentId}/${slug}`}
      className="articles__first-block"
    >
      <div className="img_wrapper">
        <img src={imgUrl} alt={article.title} />
      </div>

      <div className="articles__first-content">
        <p className="articles__first-cat">{category}</p>
        <h3 className="articles__first-title">{title}</h3>

        <p className="articles__first-date">
          {new Date(article.publishDate).toLocaleDateString(locale)}
        </p>
      </div>
    </Link>
  );
}
