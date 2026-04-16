import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
              <Link
                to={`/news/${item.documentId}`}
                key={item.id}
                className="latest__link"
              >
                <div
                  className="latest__block__highlated"
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
              </Link>
            );
          } else {
            return (
              <Link
                to={`/news/${item.documentId}`}
                key={item.id}
                className="latest__link"
              >
                <div className="latest__block">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <small className="latest__time">
                    {new Date(item.publishDate).toLocaleDateString()}
                  </small>
                </div>
              </Link>
            );
          }
        })}
      </div>
      <button className="latest__all">Показать все</button>
    </div>
  );
}
