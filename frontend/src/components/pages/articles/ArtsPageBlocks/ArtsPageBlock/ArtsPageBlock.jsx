import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";
import { formatLocalizedDate } from "../../../../../utils/dateLocale.js";
import { slugify } from "../../../../../utils/slugify.js";

export default function ArtsPageBlock({ item, index }) {
  const { locale } = useLocale();
  const title = getLangField(item, "title", locale);
  const desc = getLangField(item, "desc", locale);
  const slug = title ? slugify(title) : "";
  if (!item) return null;

  const imgUrl =
    item.desc_img?.formats?.small?.url ||
    item.desc_img?.formats?.medium?.url ||
    item.desc_img?.url;

  const category = item.categories?.[0]?.name || item.tags?.[0]?.name;

  const isReversed = index % 2 === 1;

  return (
    <Link
      to={`/${locale}/articles/${item.documentId}/${slug}`}
      className={`artspage__list-block ${isReversed ? "reverse" : ""}`}
    >
      {imgUrl && <img src={imgUrl} alt={title} />}

      <div className="artspage__list-block-content">
        <p className="artspage__list-block-cat">{category}</p>
        <h3 className="artspage__list-block-title">{title}</h3>
        <p className="artspage__list-block-text">{desc}</p>

        <div className="newspage__main-item-date">
          <p>{formatLocalizedDate(item.publishDate, locale)}</p>
        </div>
      </div>
    </Link>
  );
}
