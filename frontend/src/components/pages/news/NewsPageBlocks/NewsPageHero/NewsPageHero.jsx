import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";
import { useTranslation } from "../../../../../utils/useTranslation.js";
import { formatLocalizedDate } from "../../../../../utils/dateLocale.js";

export default function NewsPageHero({ news }) {
  const { locale } = useLocale();
  const title = getLangField(news, "title", locale);
  const desc = getLangField(news, "desc", locale);
  const { t } = useTranslation();
  const latestNewsImage =
    news.desc_img?.formats?.medium?.url ||
    news.desc_img?.formats?.small?.url ||
    news.desc_img?.url;

  const latestNewsCategory = getLangField(
    news?.header_cats?.[0],
    "name",
    locale,
  );

  const latestNewsDate = new Date(news.publishDate);

  return (
    <Link
      to={`/${locale}/news/${news.slug}`}
      className="newspage__hero-main"
      style={{
        "--bg": `url(${latestNewsImage})`,
      }}
    >
      <div className="newspage__hero-overlay" />

      <p className="cat">{latestNewsCategory}</p>

      <h1 className="newspage__hero-main-title">{title}</h1>

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
