import { Link } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../utils/getLangField.js";
import { getImageUrl } from "../../../../utils/getImageUrl.js";

export default function BlogsBlock({ blog }) {
  const imageUrl = getImageUrl(blog?.desc_img?.url || "");

  const { locale } = useLocale();

  const title = getLangField(blog, "title", locale);
  const desc = getLangField(blog, "desc", locale);
  const position = getLangField(blog, "position", locale);
  const author = getLangField(blog, "author", locale);

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
        <img
          src={imageUrl}
          alt={author || "profile_photo"}
          className="profile"
        />
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
            {new Date(blog.publishDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
