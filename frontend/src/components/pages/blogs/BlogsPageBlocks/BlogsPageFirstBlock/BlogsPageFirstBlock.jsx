import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";
import { getImageUrl } from "../../../../../utils/getImageUrl.js";
import { getResponsiveImage } from "../../../../../utils/getResponsiveImage.js";
import { formatLocalizedDate } from "../../../../../utils/dateLocale.js";
import "./_BlogsPageFirstBlock.scss";

export default function BlogsPageFirstBlock({ blog }) {
  const { locale } = useLocale();

  if (!blog) return null;

  const authorData = blog.authors?.[0];
  const title = getLangField(blog, "title", locale);
  const desc = getLangField(blog, "desc", locale);
  const author = getLangField(authorData, "name", locale);
  const position = getLangField(authorData, "position", locale);
  const profileImg = authorData
    ? getImageUrl(
        authorData.profile_img?.formats?.medium?.url ||
          authorData.profile_img?.formats?.small?.url ||
          authorData.profile_img?.url,
      )
    : null;
  const { src, srcSet } = getResponsiveImage(blog.back_img, "large");

  return (
    <Link to={`/${locale}/blogs/${blog.slug}`} className="blogspage__hero">
      {src && (
        <img
          className="blogspage__hero-bg"
          src={src}
          srcSet={srcSet}
          sizes="(max-width: 430px) 100vw, (max-width: 1630px) 90vw, 1300px"
          alt=""
          fetchPriority="high"
          decoding="async"
        />
      )}
      {authorData && (
        <div className="blogspage__hero-header">
          {profileImg && <img src={profileImg} alt="" className="profile" />}
          <div className="blogspage__hero-about">
            <p className="author">{author}</p>
            {position && <p className="spec">{position}</p>}
          </div>
        </div>
      )}
      <div className="blogspage__hero-content">
        <h2 className="blogspage__hero-title">{title}</h2>
        {desc && <p className="blogspage__hero-text">{desc}</p>}
        <p className="date">{formatLocalizedDate(blog.publishDate, locale)}</p>
      </div>
    </Link>
  );
}
