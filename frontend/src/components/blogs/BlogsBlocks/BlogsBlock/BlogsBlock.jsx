import { Link } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../utils/getLangField.js";

export default function BlogsBlock({ blog }) {
  const imageUrl = blog?.desc_img?.url || "";

  const { locale } = useLocale();

  const title = getLangField(blog, "title", locale);
  const desc = getLangField(blog, "desc", locale);
  const position = getLangField(blog, "position", locale);
  const author = getLangField(blog, "author", locale);

  const slug =
    title
      ?.toLowerCase()
      .replace(/[^\wа-яё\s]/gi, "")
      .replace(/\s+/g, "-") || "";

  return (
    <Link
      to={`/${locale}/blogs/${blog.documentId}/${slug}`}
      className="blogs__block"
    >
      <img src={imageUrl} alt="profile_photo" className="profile" />

      <div className="blogs__block-content">
        <div className="blogs__block-header">
          <p className="author">{author}</p>
          <p className="spec">{position}</p>
        </div>
        <div className="blogs__block-info">
          <h2 className="blogs__block-title">{title}</h2>

          <p className="blogs__block-text">{desc}</p>

          <div className="blogs__block-footer">
            <p className="date">
              {new Date(blog.publishDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
