import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext.jsx";
import { useTranslation } from "../../utils/useTranslation.js";

export default function NotFoundContent({ text }) {
  const { locale } = useLocale();
  const { t } = useTranslation();

  return (
    <div className="wrapper notfound">
      <Helmet>
        <title>404 | ЖКХ24</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="prerender-status-code" content="404" />
      </Helmet>
      <h2 className="loading">{text || t("notFound")}</h2>
      <Link to={`/${locale}`} className="back">
        {t("home")}
      </Link>
    </div>
  );
}
