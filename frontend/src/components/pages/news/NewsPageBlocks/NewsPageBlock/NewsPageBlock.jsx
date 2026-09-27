import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";
import { getResponsiveImage } from "../../../../../utils/getResponsiveImage.js";
import { formatLocalizedDate } from "../../../../../utils/dateLocale.js";
import "./_NewsPageBlock.scss";

export default function NewsPageBlock({ item }) {
  const { locale } = useLocale();
  const title = getLangField(item, "title", locale);
  const desc = getLangField(item, "desc", locale);

  const { src, srcSet } = getResponsiveImage(item.desc_img);

  const category = getLangField(item?.header_cats?.[0], "name", locale);

  return (
    <Link to={`/${locale}/news/${item.slug}`} className="newspage__hero-item">
      <div className="img_wrapper">
        <img
          loading="lazy"
          decoding="async"
          src={src}
          srcSet={srcSet}
          sizes="(max-width: 430px) 35vw, (max-width: 1630px) 190px, 230px"
          alt=""
        />
      </div>

      <div className="newspage__hero-item-info">
        <p className="newspage__hero-item-cat">{category}</p>

        <h3 className="newspage__hero-item-title">{title}</h3>

        <p className="newspage__hero-item-text">{desc}</p>

        <p className="newspage__hero-item-date">
          {formatLocalizedDate(item.publishDate, locale)}
        </p>
      </div>
    </Link>
  );
}
