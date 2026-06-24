import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";
import { formatLocalizedDate } from "../../../../../utils/dateLocale.js";

export default function QnasPageBlock({ qna }) {
  const { locale } = useLocale();
  const title = getLangField(qna, "title", locale);

  return (
    <Link to={`/${locale}/q-and-as/${qna.slug}`} className="qnas__main-item">
      <h3 className="qnas__main-item-title">{title}</h3>
      <p className="qnas__main-item-date">
        {formatLocalizedDate(qna.publishDate, locale)}
      </p>
    </Link>
  );
}
