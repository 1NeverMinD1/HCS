import React from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";

export default function BlogsPageBlock({ blog }) {
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
  if (!blog) return null;

  const imgUrl =
    blog.desc_img?.formats?.small?.url ||
    blog.desc_img?.formats?.medium?.url ||
    blog.desc_img?.url;

  const backImg =
    blog.back_img?.formats?.medium?.url ||
    blog.back_img?.formats?.small?.url ||
    blog.back_img?.url;

  const category = blog.categories?.[0]?.name || blog.tags?.[0]?.name;

  const date = new Date(blog.publishDate);

  return (
    <Link
      to={`/${locale}/blogs/${blog.documentId}/${slug}`}
      className="blogspage__item"
    >
      <div className="blogspage__item-header">
        <img src={imgUrl} alt="profile_photo" className="profile" />
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
