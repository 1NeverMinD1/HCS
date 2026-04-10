import { useEffect, useState } from "react";

export default function Trendings() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:1337/api/news?populate=desc_img")
      .then((res) => res.json())
      .then((data) => setNews(data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <article className="trending">
      <div className="trending__header">
        <h2>Популярные новости</h2>
        <button className="trending__button">Показать все</button>
      </div>

      <div className="trending__news">
        {news.map((item) => {
          const imageUrl =
            item?.desc_img?.formats?.medium?.url || item?.desc_img?.url;

          return (
            <div className="trending__block" key={item?.id}>
              {imageUrl && (
                <img
                  src={`http://localhost:1337${imageUrl}`}
                  alt={item?.desc_img?.alternativeText || item?.title}
                />
              )}
              <div className="trending__info">
                <h4>{item?.title}</h4>
                <p>
                  {item.desc.length > 100
                    ? item.desc.slice(0, 100) + "..."
                    : item.desc}
                </p>
                <small>
                  {item?.publishDate &&
                    new Date(item.publishDate).toLocaleDateString()}
                </small>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
