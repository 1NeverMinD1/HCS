import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";
import { formatLocalizedDate } from "../../../../../utils/dateLocale.js";
import { getResponsiveImage } from "../../../../../utils/getResponsiveImage.js";
import "./_ArtsPageBlock.scss";

export default function ArtsPageBlock({ item, index }) {
  const { locale } = useLocale();
  const title = getLangField(item, "title", locale);
  const desc = getLangField(item, "desc", locale);
  if (!item) return null;

  const { src, srcSet } = getResponsiveImage(item.desc_img, "medium");

  const category = getLangField(item?.categories?.[0], "name", locale);

  const isReversed = index % 2 === 1;
  const isFirst = index === 0;

  return (
    <Link
      to={`/${locale}/articles/${item.slug}`}
      className={`artspage__list-block ${isReversed ? "reverse" : ""}`}
    >
      {src && (
        <img
          loading={isFirst ? "eager" : "lazy"}
          decoding={isFirst ? undefined : "async"}
          fetchPriority={isFirst ? "high" : undefined}
          src={src}
          srcSet={srcSet}
          sizes="(max-width: 430px) 50vw, (max-width: 1630px) 420px, 530px"
          alt=""
        />
      )}

      <div className="artspage__list-block-content">
        <p className="artspage__list-block-cat">{category}</p>
        <h2 className="artspage__list-block-title">{title}</h2>
        <p className="artspage__list-block-text">{desc}</p>

        <p className="artspage__list-block-date">
          {formatLocalizedDate(item.publishDate, locale)}
        </p>
      </div>
    </Link>
  );
}
