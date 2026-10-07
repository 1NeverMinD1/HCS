import { Link } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../utils/getLangField.js";
import { getResponsiveImage } from "../../../../utils/getResponsiveImage.js";
import { formatLocalizedDate } from "../../../../utils/dateLocale.js";
import "./_ArticlesBlock.scss";

export default function ArticlesBlock({ article }) {
  const { locale } = useLocale();

  const { src, srcSet } = getResponsiveImage(article.desc_img);

  const title = getLangField(article, "title", locale);
  const category = getLangField(article?.categories?.[0], "name", locale);
  const desc = getLangField(article, "desc", locale);

  return (
    <Link
      to={`/${locale}/articles/${article.slug}`}
      className="articles__block"
    >
      <div className="img_wrapper">
        <img
          loading="lazy"
          decoding="async"
          src={src}
          srcSet={srcSet}
          sizes="(max-width: 600px) 112px, 300px"
          alt=""
        />
      </div>

      <div className="articles__block-content">
        <p className="articles__block-cat">{category}</p>
        <h3 className="articles__block-title">{title}</h3>
        <p className="articles__block-text">{desc}</p>

        <p className="articles__block-date">
          {formatLocalizedDate(article.publishDate, locale)}
        </p>
      </div>
    </Link>
  );
}
