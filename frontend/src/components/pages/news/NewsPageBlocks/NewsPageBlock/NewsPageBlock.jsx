import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";
import { slugify } from "../../../../../utils/slugify.js";

export default function NewsPageBlock({ item }) {
  const { locale } = useLocale();
  const title = getLangField(item, "title", locale);
  const desc = getLangField(item, "desc", locale);
  const slug = title ? slugify(title) : "";

  const imgUrl = item.desc_img?.formats?.small?.url || item.desc_img?.url;

  const category = getLangField(item?.header_cats?.[0], "name", locale);

  return (
    <Link
      to={`/${locale}/news/${item.documentId}/${slug}`}
      className="newspage__hero-item"
    >
      <div className="img_wrapper">
        <img src={imgUrl} alt={title} />
      </div>

      <div className="newspage__hero-item-info">
        <p className="newspage__hero-item-cat">{category}</p>

        <h3 className="newspage__hero-item-title">{title}</h3>

        <p className="newspage__hero-item-text">{desc}</p>

        <p className="newspage__hero-item-date">
          {new Date(item.publishDate).toLocaleDateString("ru-RU")}
        </p>
      </div>
    </Link>
  );
}
