import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";

export default function QnasPageBlock({ qna }) {
  const { locale } = useLocale();
  const title = getLangField(qna, "title", locale);
  const slug =
    title
      ?.toLowerCase()
      .replace(/[^\wа-яё\s]/gi, "")
      .replace(/\s+/g, "-") || "";

  const date = new Date(qna.publishDate);

  return (
    <Link
      to={`/${locale}/q-and-as/${qna.documentId}/${slug}`}
      className="qnas__main-item"
    >
      <h3 className="qnas__main-item-title">{title}</h3>

      <div className="qnas__main-item-date">
        <p>
          {date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </Link>
  );
}
