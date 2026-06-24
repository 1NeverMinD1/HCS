import { Link } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../utils/getLangField.js";

export default function ArticlesBlock({ article }) {
  const { locale } = useLocale();

  const imgUrl =
    article.desc_img?.formats?.small?.url ||
    article.desc_img?.formats?.medium?.url ||
    article.desc_img?.url;

  const title = getLangField(article, "title", locale);
  const content = article?.[`content_${locale}`] || article?.content_ru || [];
  const category = getLangField(article?.categories?.[0], "name", locale);
  const text =
    content?.find((block) => block.type === "paragraph")?.children?.[0]?.text ||
    "";

  return (
    <Link
      to={`/${locale}/articles/${article.slug}`}
      className="articles__block"
    >
      <div className="img_wrapper">
        <img src={imgUrl} alt={title} />
      </div>

      <div className="articles__block-content">
        <p className="articles__block-cat">{category}</p>
        <h3 className="articles__block-title">{title}</h3>
        <p className="articles__block-text">{text}</p>

        <p className="articles__block-date">
          {new Date(article.publishDate).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
