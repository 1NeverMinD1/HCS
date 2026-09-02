import { Link } from "react-router-dom";
import LatestNewsBlocks from "./LatestNewsBlocks/LatestNewsBlocks";
import { useLocale } from "../../context/LocaleContext.jsx";
import { useTranslation } from "../../utils/useTranslation.js";
// Styles
import "./_LatestNews.scss";

export default function LatestNews({ news }) {
  const { locale } = useLocale();
  const { t } = useTranslation();

  return (
    <div className="latest">
      <LatestNewsBlocks news={news} />

      <div className="latest__link">
        <Link to={`/${locale}/news/`} className="view_all">
          {t("showAll")}
        </Link>
      </div>
    </div>
  );
}
