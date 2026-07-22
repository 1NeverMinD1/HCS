import React from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";
import { getImageUrl } from "../../../../../utils/getImageUrl.js";

export default function BlogsPageBlock({ blog }) {
  const { locale } = useLocale();
  const title = getLangField(blog, "title", locale);
  const desc = getLangField(blog, "desc", locale);
  const author = getLangField(blog?.authors?.[0], "name", locale);
  const position = getLangField(blog?.authors?.[0], "position", locale);
  if (!blog) return null;

  const profileImg = getImageUrl(
    blog?.authors?.[0]?.profile_img?.formats?.medium?.url ||
      blog?.authors?.[0]?.profile_img?.formats?.small?.url ||
      blog?.authors?.[0]?.profile_img?.url,
  );

  const backImg = getImageUrl(
    blog?.back_img?.formats?.medium?.url ||
      blog?.back_img?.formats?.small?.url ||
      blog?.back_img?.url,
  );

  const category = blog.categories?.[0]?.name || blog.tags?.[0]?.name;

  const date = new Date(blog.publishDate);

  return (
    <Link to={`/${locale}/blogs/${blog.slug}`} className="blogspage__item">
      <div className="blogspage__item-header">
        <img src={profileImg} alt="profile_photo" className="profile" />
        <div className="blogspage__item-about">
          <p className="author">{author}</p>
          <p className="spec">{position}</p>
        </div>
      </div>
      <div className="blogspage__item-main">
        <img src={backImg} alt="back_img" className="back_img" />
      </div>
      <div className="blogspage__item-content">
        <h2 className="blogspage__item-title">{title}</h2>
        <p className="blogspage__item-text">{desc}</p>
        <div className="blogs__block-footer">
          <p className="date">
            {new Date(blog.publishDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
