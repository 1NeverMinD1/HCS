import { useEffect, useState } from "react";

export default function LatestNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:1337/api/news?populate=desc_img")
      .then((res) => res.json())
      .then((data) => {
        const sortedNews = data.data.sort(
          (a, b) => new Date(b.publishDate) - new Date(a.publishDate),
        );
        setNews(sortedNews);
      });
  }, []);

  return (
    <div className="latest">
      <h2>Последние новости</h2>
      <div className="latest__news">
        {news.map((item) => {
          const imageUrl =
            item.desc_img?.formats?.medium?.url || item.desc_img?.url;

          if (item.back) {
            return (
              <div
                className="latest__block__highlated"
                key={item.id}
                style={{
                  backgroundImage: `url(http://localhost:1337${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <h3>{item.title}</h3>
                <small className="latest__time">
                  {new Date(item.publishDate).toLocaleDateString()}
                </small>
              </div>
            );
          } else {
            return (
              <div className="latest__block" key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <small className="latest__time">
                  {new Date(item.publishDate).toLocaleDateString()}
                </small>
              </div>
            );
          }
        })}
      </div>
      <button className="latest__all">Показать все</button>
    </div>
  );
}
