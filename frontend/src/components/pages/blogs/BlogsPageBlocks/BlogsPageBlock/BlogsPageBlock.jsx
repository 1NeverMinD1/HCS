import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";
import { getImageUrl } from "../../../../../utils/getImageUrl.js";
import { getResponsiveImage } from "../../../../../utils/getResponsiveImage.js";
import { formatLocalizedDate } from "../../../../../utils/dateLocale.js";
import "./_BlogsPageBlock.scss";

export default function BlogsPageBlock({ blog }) {
  const { locale } = useLocale();

  if (!blog) return null;

  const authorData = blog.authors?.[0];
  const title = getLangField(blog, "title", locale);
  const desc = getLangField(blog, "desc", locale);
  const author = getLangField(authorData, "name", locale);
  const position = getLangField(authorData, "position", locale);
  const profileImg = authorData
    ? getImageUrl(
        authorData.profile_img?.formats?.small?.url ||
          authorData.profile_img?.formats?.thumbnail?.url ||
          authorData.profile_img?.url,
      )
    : null;
  const cover = getResponsiveImage(blog.back_img, "medium");

  return (
    <Link to={`/${locale}/blogs/${blog.slug}`} className="blogspage__item">
      {authorData && (
        <div className="blogspage__item-header">
          {profileImg && (
            <img
              loading="lazy"
              decoding="async"
              src={profileImg}
              alt=""
              className="profile"
            />
          )}
          <div className="blogspage__item-about">
            <p className="author">{author}</p>
            {position && <p className="spec">{position}</p>}
          </div>
        </div>
      )}
      <div className="blogspage__item-main">
        {cover.src && (
          <img
            loading="lazy"
            decoding="async"
            src={cover.src}
            srcSet={cover.srcSet}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt=""
            className="back_img"
          />
        )}
      </div>
      <div className="blogspage__item-content">
        <h2 className="blogspage__item-title">{title}</h2>
        {desc && <p className="blogspage__item-text">{desc}</p>}
        <p className="date">{formatLocalizedDate(blog.publishDate, locale)}</p>
      </div>
    </Link>
  );
}
