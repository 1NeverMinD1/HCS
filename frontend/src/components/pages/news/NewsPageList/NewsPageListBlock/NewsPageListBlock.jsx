import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";

export default function NewsPageListBlock({ item }) {
  const { locale } = useLocale();
  const title = getLangField(item, "title", locale);
  const desc = getLangField(item, "desc", locale);

  const slug =
    title
      ?.toLowerCase()
      .replace(/[^\wа-яё\s]/gi, "")
      .replace(/\s+/g, "-") || "";

  const imgUrl = item.desc_img?.formats?.small?.url || item.desc_img?.url;

  const category = item.categories?.[0]?.name;

  const date = new Date(item.publishDate);

  return (
    <Link
      to={`/${locale}/news/${item.documentId}/${slug}`}
      className="newspage__main-item"
    >
      <div className="check">
        <img src={imgUrl} alt={title} />
      </div>

      <div className="newspage__main-item-content">
        <p className="newspage__main-item-cat">{category}</p>
        <h3 className="newspage__main-item-title">{title}</h3>

        <p className="newspage__main-item-text">{desc}</p>

        <div className="newspage__main-item-date">
          <p>
            {date.toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <p>
            {date.toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </Link>
  );
}
