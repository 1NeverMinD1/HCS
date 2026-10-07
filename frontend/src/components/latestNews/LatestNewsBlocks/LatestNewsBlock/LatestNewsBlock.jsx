import { Link } from "react-router-dom";
import { formatLocalizedDate } from "../../../../utils/dateLocale.js";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../utils/getLangField.js";
import { getResponsiveImage } from "../../../../utils/getResponsiveImage.js";
import "./_LatestNewsBlock.scss";

export default function LatestNewsBlock({ item }) {
  const { locale } = useLocale();

  const { src, srcSet } = getResponsiveImage(item.desc_img);

  const title = getLangField(item, "title", locale);
  const desc = getLangField(item, "desc", locale);
  const category = getLangField(item.header_cats?.[0], "name", locale);

  return (
    <Link to={`/${locale}/news/${item.slug}`} className="latest__block">
      <div className="img_wrapper">
        <img
          loading="lazy"
          decoding="async"
          src={src}
          srcSet={srcSet}
          sizes="(max-width: 600px) 100vw, (max-width: 1630px) 280px, 340px"
          alt=""
          className="latest__block-img"
        />
      </div>

      <div className="latest__block-content">
        <p className="latest__block-cat">{category}</p>

        <h3 className="latest__block-title">{title}</h3>

        <p className="latest__block-text">{desc}</p>

        <p className="latest__block-date">
          {formatLocalizedDate(item.publishDate, locale)}
        </p>
      </div>
    </Link>
  );
}
