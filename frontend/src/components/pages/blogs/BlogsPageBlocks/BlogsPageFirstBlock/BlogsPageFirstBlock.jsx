import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";
import { getImageUrl } from "../../../../../utils/getImageUrl.js";
import { getResponsiveImage } from "../../../../../utils/getResponsiveImage.js";
import { formatLocalizedDate } from "../../../../../utils/dateLocale.js";
import "./_BlogsPageFirstBlock.scss";

export default function BlogsPageFirstBlock({ blog }) {
  const { locale } = useLocale();
  const title = getLangField(blog, "title", locale);
  const desc = getLangField(blog, "desc", locale);
  const author = getLangField(blog?.authors?.[0], "name", locale);
  const position = getLangField(blog?.authors?.[0], "position", locale);

  const profileImg = getImageUrl(
    blog?.authors?.[0]?.profile_img?.formats?.medium?.url ||
      blog?.authors?.[0]?.profile_img?.formats?.small?.url ||
      blog?.authors?.[0]?.profile_img?.url,
  );

  if (!blog) return null;

  const { src, srcSet } = getResponsiveImage(blog.back_img, "large");

  return (
    <Link to={`/${locale}/blogs/${blog.slug}`} className="blogspage__hero">
      {src && (
        <img
          className="blogspage__hero-bg"
          src={src}
          srcSet={srcSet}
          sizes="(max-width: 430px) 70vw, (max-width: 1630px) 90vw, 1300px"
          alt=""
          fetchPriority="high"
        />
      )}
      <div className="blogspage__hero-header">
        <img src={profileImg} alt={author || ""} className="profile" />
        <div className="blogspage__hero-about">
          <p className="author">{author}</p>
          <p className="spec">{position}</p>
        </div>
      </div>
      <div className="blogspage__hero-content">
        <h2 className="blogspage__hero-title">{title}</h2>
        <p className="blogspage__hero-text">{desc}</p>
      </div>

      <p className="date">{formatLocalizedDate(blog.publishDate, locale)}</p>
    </Link>
  );
}
