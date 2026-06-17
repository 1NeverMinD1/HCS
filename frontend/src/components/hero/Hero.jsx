import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext.jsx";
import { getLangField } from "../../utils/getLangField.js";

export default function Hero({ onLoadFeatured }) {
  const [featured, setFeatured] = useState(null);
  const { locale } = useLocale();

  useEffect(() => {
    fetch(
      `https://hcs-production-423d.up.railway.app/api/news?filters[isFeatured][$eq]=true&populate=*&sort=publishDate:desc`,
    )
      .then((res) => res.json())
      .then((data) => {
        const item = data.data?.[0] || null;
        setFeatured(item);

        if (item && onLoadFeatured) {
          onLoadFeatured(item);
        }
      });
  }, []);

  if (!featured) return null;

  const imageUrl = featured?.desc_img?.url
    ? featured.desc_img.url.startsWith("http")
      ? featured.desc_img.url
      : `https://hcs-production-423d.up.railway.app${featured.desc_img.url}`
    : "";

  const category = featured?.categories?.[0]?.name;
  const date = new Date(featured.publishDate);

  const title = getLangField(featured, "title", locale);
  const desc = getLangField(featured, "desc", locale);

  const slug =
    title
      ?.toLowerCase()
      .replace(/[^\wа-яё\s]/gi, "")
      .replace(/\s+/g, "-") || "";

  return (
    <Link
      to={`/${locale}/news/${featured.documentId}/${slug}`}
      className="hero"
    >
      <div
        className="hero__bg"
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
      />
      {category && <p className="cat">{category}</p>}

      <h1 className="hero__title">{title}</h1>
      <p className="hero__text">{desc}</p>

      <div className="hero__date">
        <p>
          {date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </Link>
  );
}
