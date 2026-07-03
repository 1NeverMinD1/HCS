import { Link } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../utils/getLangField.js";

export default function LatestNewsBlock({ item }) {
  const { locale } = useLocale();

  const imgUrl =
    item.desc_img?.formats?.small?.url ||
    item.desc_img?.formats?.medium?.url ||
    item.desc_img?.url;

  const title = getLangField(item, "title", locale);
  const desc = getLangField(item, "desc", locale);
  const category = getLangField(item.header_cats?.[0], "name", locale);

  return (
    <Link to={`/${locale}/news/${item.slug}`} className="latest__block">
      <div className="img_wrapper">
        <img src={imgUrl} alt={item.title} className="latest__block-img" />
      </div>

      <div className="latest__block-content">
        <p className="latest__block-cat">{category}</p>

        <h3 className="latest__block-title">{title}</h3>

        <p className="latest__block-text">{desc}</p>

        <p className="latest__block-date">
          {new Date(item.publishDate).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
