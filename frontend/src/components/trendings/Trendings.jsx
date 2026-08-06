import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext.jsx";
import { getLangField } from "../../utils/getLangField.js";
import { useTranslation } from "../../utils/useTranslation.js";
import { formatLocalizedDate } from "../../utils/dateLocale.js";

export default function Trendings({ news }) {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const visibleNews = news.slice(0, 8);

  return (
    <div className="trendings">
      <h2 className="trendings__title">{t("latestNews")}</h2>
      <div className="trendings__list">
        {visibleNews.map((item) => {
          const title = getLangField(item, "title", locale);
          return (
            <Link
              to={`/${locale}/news/${item.slug}`}
              key={item.id}
              className="trendings__block"
            >
              <div className="trendings__block-info">
                <h3>{title}</h3>
                <p className="trendings__block-date">
                  {formatLocalizedDate(item.publishDate, locale)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <Link to={`/${locale}/news`} className="see_all">
        {t("showAll")}
      </Link>
    </div>
  );
}
