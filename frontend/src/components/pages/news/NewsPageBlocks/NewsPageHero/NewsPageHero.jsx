import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";
import { useTranslation } from "../../../../../utils/useTranslation.js";
import { formatLocalizedDate } from "../../../../../utils/dateLocale.js";
import { getImageUrl } from "../../../../../utils/getImageUrl.js";
import "./_NewsPageHero.scss";

const FORMAT_ORDER = ["small", "medium", "large"];

function buildSrcSet(img) {
  if (!img) return undefined;
  const parts = [];
  const formats = img.formats || {};
  for (const key of FORMAT_ORDER) {
    const f = formats[key];
    if (f?.url && f?.width) parts.push(`${getImageUrl(f.url)} ${f.width}w`);
  }
  if (img.url && img.width) parts.push(`${getImageUrl(img.url)} ${img.width}w`);
  return parts.length > 1 ? parts.join(", ") : undefined;
}

function pickSrc(img) {
  if (!img) return null;
  const f = img.formats || {};
  return getImageUrl(f.medium?.url || f.large?.url || f.small?.url || img.url);
}

export default function NewsPageHero({ news }) {
  const { locale } = useLocale();
  const title = getLangField(news, "title", locale);
  const desc = getLangField(news, "desc", locale);
  const { t } = useTranslation();

  const img = news.desc_img;
  const src = pickSrc(img);
  const srcSet = buildSrcSet(img);

  const latestNewsCategory = getLangField(
    news?.header_cats?.[0],
    "name",
    locale,
  );

  const latestNewsDate = new Date(news.publishDate);

  return (
    <Link to={`/${locale}/news/${news.slug}`} className="newspage__hero-main">
      {src && (
        <img
          className="newspage__hero-img"
          src={src}
          srcSet={srcSet}
          sizes="(max-width: 430px) 70vw, 50vw"
          alt=""
          fetchPriority="high"
        />
      )}

      <div className="newspage__hero-overlay" />

      <p className="cat">{latestNewsCategory}</p>

      <h2 className="newspage__hero-main-title">{title}</h2>

      <p className="newspage__hero-main-text">{desc}</p>

      <div className="newspage__hero-main-date">
        <p>{formatLocalizedDate(news.publishDate, locale)}</p>

        <p>
          {latestNewsDate.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </Link>
  );
}
