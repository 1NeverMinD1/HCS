import { useEffect, useState } from "react";

export default function Hero() {
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    fetch(
      "http://localhost:1337/api/news?filters[isFeatured][$eq]=true&populate=desc_img&populate=tags&sort=publishDate:desc",
    )
      .then((res) => res.json())
      .then((data) => {
        setFeatured(data.data?.[0] || null);
      });
  }, []);

  if (!featured) return null;

  const imageUrl =
    featured.desc_img?.formats?.large?.url || featured.desc_img?.url;

  const category = featured.tags?.[0]?.name;

  const date = new Date(featured.publishDate);

  return (
    <div
      className="hero"
      style={{
        backgroundImage: imageUrl
          ? `url(http://localhost:1337${imageUrl})`
          : "none",
      }}
    >
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
        <p>
          {date.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
