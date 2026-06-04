import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Hero({ onLoadFeatured }) {
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    fetch(
      "https://hcs-production-423d.up.railway.app/api/news?filters[isFeatured][$eq]=true&populate=*&sort=publishDate:desc",
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

  return (
    <Link to={`/news/${featured.documentId}`} className="hero">
      <div
        className="hero__bg"
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
      />
      {category && <p className="cat">{category}</p>}

      <h1 className="hero__title">{featured.title}</h1>
      <p className="hero__text">{featured.desc}</p>

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
