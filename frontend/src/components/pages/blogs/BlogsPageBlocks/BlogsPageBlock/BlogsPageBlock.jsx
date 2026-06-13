import React from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";

export default function BlogsPageBlock({ blog }) {
  const { locale } = useLocale();
  const slug =
    blog.title
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
          <p className="author">{blog.author}</p>
          <p className="spec">{blog.position}</p>
        </div>
      </div>
      <div className="blogspage__item-main">
        <img src={backImg} alt="back_img" className="back_img" />
      </div>
      <div className="blogspage__item-content">
        <h2 className="blogspage__item-title">{blog.title}</h2>
        <p className="blogspage__item-text">{blog.desc}</p>
        <div className="blogs__block-footer">
          <p className="date">
            {new Date(blog.publishDate).toLocaleDateString()}
          </p>

          <div className="likes">
            <svg
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M109.057 77.0774C64.0176 90.6447 27.4864 128.737 23.4054 184.058C21.848 205.17 30.6355 228.687 46.8978 253.392C63.0972 278.001 86.2238 303.049 112.068 326.983C163.753 374.849 225.295 417.349 261.212 442.017C265 444.619 265.737 449.502 262.858 452.925C259.98 456.348 254.576 457.014 250.788 454.413C214.922 429.779 152.424 386.649 99.7377 337.857C73.3956 313.461 49.2533 287.423 32.0917 261.352C14.993 235.376 4.3275 208.618 6.21567 183.023C10.7486 121.576 51.7426 77.9311 103.609 62.3072C155.558 46.6588 217.368 59.4262 262.618 108.498C265.663 111.8 265.169 116.709 261.515 119.461C257.86 122.214 252.428 121.768 249.383 118.465C208.493 74.1218 154.015 63.5347 109.057 77.0774Z"
                fill="black"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M402.943 77.0774C447.982 90.6447 484.514 128.737 488.595 184.058C490.152 205.17 481.364 228.687 465.102 253.392C448.903 278.001 425.776 303.049 399.932 326.983C348.247 374.849 286.705 417.349 250.788 442.017C247 444.619 246.263 449.502 249.142 452.925C252.02 456.348 257.424 457.014 261.212 454.413C297.078 429.779 359.576 386.649 412.262 337.857C438.604 313.461 462.747 287.423 479.908 261.352C497.007 235.376 507.673 208.618 505.784 183.023C501.251 121.576 460.257 77.9311 408.391 62.3072C356.442 46.6588 294.632 59.4262 249.382 108.498C246.337 111.8 246.831 116.709 250.485 119.461C254.14 122.214 259.572 121.768 262.617 118.465C303.507 74.1218 357.985 63.5347 402.943 77.0774Z"
                fill="black"
              />
            </svg>
            320
          </div>

          <div className="comms">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
              <path d="M 25 4.0625 C 12.414063 4.0625 2.0625 12.925781 2.0625 24 C 2.0625 30.425781 5.625 36.09375 11 39.71875 C 10.992188 39.933594 11 40.265625 10.71875 41.3125 C 10.371094 42.605469 9.683594 44.4375 8.25 46.46875 L 7.21875 47.90625 L 9 47.9375 C 15.175781 47.964844 18.753906 43.90625 19.3125 43.25 C 21.136719 43.65625 23.035156 43.9375 25 43.9375 C 37.582031 43.9375 47.9375 35.074219 47.9375 24 C 47.9375 12.925781 37.582031 4.0625 25 4.0625 Z M 25 5.9375 C 36.714844 5.9375 46.0625 14.089844 46.0625 24 C 46.0625 33.910156 36.714844 42.0625 25 42.0625 C 22.996094 42.0625 21.050781 41.820313 19.21875 41.375 L 18.65625 41.25 L 18.28125 41.71875 C 18.28125 41.71875 15.390625 44.976563 10.78125 45.75 C 11.613281 44.257813 12.246094 42.871094 12.53125 41.8125 C 12.929688 40.332031 12.9375 39.3125 12.9375 39.3125 L 12.9375 38.8125 L 12.5 38.53125 C 7.273438 35.21875 3.9375 29.941406 3.9375 24 C 3.9375 14.089844 13.28125 5.9375 25 5.9375 Z" />
            </svg>{" "}
            89
          </div>
        </div>
      </div>
    </Link>
  );
}
