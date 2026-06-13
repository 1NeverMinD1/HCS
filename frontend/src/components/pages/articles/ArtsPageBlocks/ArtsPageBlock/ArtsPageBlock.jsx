import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";

export default function ArtsPageBlock({ item, index }) {
  const { locale } = useLocale();
  const slug =
    item.title
      ?.toLowerCase()
      .replace(/[^\wа-яё\s]/gi, "")
      .replace(/\s+/g, "-") || "";
  if (!item) return null;

  const imgUrl =
    item.desc_img?.formats?.small?.url ||
    item.desc_img?.formats?.medium?.url ||
    item.desc_img?.url;

  const category = item.categories?.[0]?.name || item.tags?.[0]?.name;

  const date = new Date(item.publishDate);

  const isReversed = index % 2 === 1;

  return (
    <Link
      to={`/${locale}/articles/${item.documentId}/${slug}`}
      className={`artspage__list-block ${isReversed ? "reverse" : ""}`}
    >
      {imgUrl && <img src={imgUrl} alt={item.title} />}

      <div className="artspage__list-block-content">
        <p className="artspage__list-block-cat">{category}</p>
        <h3 className="artspage__list-block-title">{item.title}</h3>
        <p className="artspage__list-block-text">{item.desc}</p>

        <div className="newspage__main-item-date">
          <p>
            {date.toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </Link>
  );
}
