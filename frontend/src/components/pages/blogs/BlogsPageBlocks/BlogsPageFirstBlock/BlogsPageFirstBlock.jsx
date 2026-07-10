import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";
import { slugify } from "../../../../../utils/slugify.js";
import { getImageUrl } from "../../../../../utils/getImageUrl.js";

export default function BlogsPageFirstBlock({ blog }) {
  if (!blog) return null;
  const { locale } = useLocale();
  const title = getLangField(blog, "title", locale);
  const desc = getLangField(blog, "desc", locale);
  const position = getLangField(blog, "position", locale);
  const author = getLangField(blog, "author", locale);

  const imageUrl = getImageUrl(
    blog.desc_img?.formats?.medium?.url ||
      blog.desc_img?.formats?.small?.url ||
      blog.desc_img?.url,
  );
  const firstBlockImg = getImageUrl(
    blog.back_img?.formats?.medium?.url ||
      blog.back_img?.formats?.small?.url ||
      blog.back_img?.url,
  );

  return (
    <Link
      to={`/${locale}/blogs/${blog.slug}`}
      className="blogspage__hero"
      style={{
        backgroundImage: `url(${firstBlockImg})`,
      }}
    >
      <div className="blogspage__hero-header">
        <img src={imageUrl} alt="profile_photo" className="profile" />
        <div className="blogspage__hero-about">
          <p className="author">{author}</p>
          <p className="spec">{position}</p>
        </div>
      </div>
      <div className="blogspage__hero-content">
        <h2 className="blogspage__hero-title">{title}</h2>
        <p className="blogspage__hero-text">{desc}</p>
      </div>

      <p className="date">{new Date(blog.publishDate).toLocaleDateString()}</p>
    </Link>
  );
}
