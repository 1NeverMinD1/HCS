import { Link } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../utils/getLangField.js";
import { getImageUrl } from "../../../../utils/getImageUrl.js";
import { formatLocalizedDate } from "../../../../utils/dateLocale.js";
// Styles
import "./_BlogsBlock.scss";

export default function BlogsBlock({ blog }) {
  const profileImg = blog?.authors?.[0]?.profile_img;
  const imageUrl = getImageUrl(
    profileImg?.formats?.thumbnail?.url || profileImg?.url || "",
  );
  const { locale } = useLocale();
  const title = getLangField(blog, "title", locale);
  const desc = getLangField(blog, "desc", locale);
  const author = getLangField(blog?.authors?.[0], "name", locale);
  const position = getLangField(blog?.authors?.[0], "position", locale);

  const initials = author
    ? author
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <Link to={`/${locale}/blogs/${blog.slug}`} className="blogs__block">
      {imageUrl ? (
        <img src={imageUrl} alt={author || ""} className="profile" />
      ) : (
        <div className="profile profile--fallback">{initials}</div>
      )}

      <div className="blogs__block-content">
        <div className="blogs__block-header">
          <p className="author">{author}</p>
          <p className="spec">{position}</p>
        </div>
        <div className="blogs__block-info">
          <h2 className="blogs__block-title">{title}</h2>

          <p className="blogs__block-text">{desc}</p>

          <p className="date">
            {formatLocalizedDate(blog.publishDate, locale)}
          </p>
        </div>
      </div>
    </Link>
  );
}
