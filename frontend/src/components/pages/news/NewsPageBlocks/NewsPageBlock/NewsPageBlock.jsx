import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";

export default function NewsPageBlock({ item }) {
  const { locale } = useLocale();
  const slug =
    item.name
      ?.toLowerCase()
      .replace(/[^\wа-яё\s]/gi, "")
      .replace(/\s+/g, "-") || "";
  const imgUrl = item.desc_img?.formats?.small?.url || item.desc_img?.url;

  const category = item.categories?.[0]?.name;

  return (
    <Link
      to={`/${locale}/news/${item.documentId}/${slug}`}
      className="newspage__hero-item"
    >
      <div className="img_wrapper">
        <img src={imgUrl} alt={item.title} />
      </div>

      <div className="newspage__hero-item-info">
        <p className="newspage__hero-item-cat">{category}</p>

        <h3 className="newspage__hero-item-title">{item.title}</h3>

        <p className="newspage__hero-item-text">{item.desc}</p>

        <p className="newspage__hero-item-date">
          {new Date(item.publishDate).toLocaleDateString("ru-RU")}
        </p>
      </div>
    </Link>
  );
}
