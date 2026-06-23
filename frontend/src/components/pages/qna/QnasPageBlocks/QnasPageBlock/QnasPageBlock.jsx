import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";
import { formatLocalizedDate } from "../../../../../utils/dateLocale.js";
import { slugify } from "../../../../../utils/slugify.js";

export default function QnasPageBlock({ qna }) {
  const { locale } = useLocale();
  const title = getLangField(qna, "title", locale);
  const slug = title ? slugify(title) : "";

  return (
    <Link
      to={`/${locale}/q-and-as/${qna.documentId}/${slug}`}
      className="qnas__main-item"
    >
      <h3 className="qnas__main-item-title">{title}</h3>
      <div className="qnas__main-item-date">
        <p>{formatLocalizedDate(qna.publishDate, locale)}</p>
      </div>
    </Link>
  );
}
