import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";
import { getResponsiveImage } from "../../../../../utils/getResponsiveImage.js";
import { formatLocalizedDate } from "../../../../../utils/dateLocale.js";
import "./_NewsPageListBlock.scss";

export default function NewsPageListBlock({ item }) {
  const { locale } = useLocale();
  const title = getLangField(item, "title", locale);
  const desc = getLangField(item, "desc", locale);

  const { src, srcSet } = getResponsiveImage(item.desc_img);

  const category = getLangField(item?.header_cats?.[0], "name", locale);

  const date = new Date(item.publishDate);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return (
    <Link to={`/${locale}/news/${item.slug}`} className="newspage__main-item">
      <div className="check">
        <img
          loading="lazy"
          decoding="async"
          src={src}
          srcSet={srcSet}
          sizes="(max-width: 430px) 95vw, (max-width: 1630px) 340px, 430px"
          alt=""
        />
      </div>

      <div className="newspage__main-item-content">
        <p className="newspage__main-item-cat">{category}</p>
        <h3 className="newspage__main-item-title">{title}</h3>

        <p className="newspage__main-item-text">{desc}</p>

        <div className="newspage__main-item-date">
          <p>{formatLocalizedDate(item.publishDate, locale)}</p>
          <p>
            {hours}:{minutes}
          </p>
        </div>
      </div>
    </Link>
  );
}
