import { Link } from "react-router-dom";
import LatestNewsBlocks from "./LatestNewsBlocks/LatestNewsBlocks";
import { useLocale } from "../../context/LocaleContext.jsx";
import { useTranslation } from "../../utils/useTranslation.js";

export default function LatestNews({ news }) {
  const { locale } = useLocale();
  const { t } = useTranslation();

  return (
    <div className="latest">
      <LatestNewsBlocks news={news} />

      <div className="latest__link">
        <Link to={`/${locale}/news/main`} className="view_all">
          {t("mainNews")}
          <svg className="arrow" viewBox="0 0 5 9">
            <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
}
