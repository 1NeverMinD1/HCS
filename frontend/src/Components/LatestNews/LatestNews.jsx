import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LatestNews() {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      "http://localhost:1337/api/news?populate=desc_img&pagination[pageSize]=6&sort=publishDate:desc",
    )
      .then((res) => res.json())
      .then((data) => setNews(data.data));
  }, []);

  return (
    <section className="latest">
      <div className="latest__header">
        <h2 className="latest__title">Последние новости</h2>
      </div>

      <div className="latest__grid">
        {news.map((item) => {
          const imageUrl =
            item.desc_img?.formats?.medium?.url || item.desc_img?.url;

          return (
            <Link
              to={`/news/${item.documentId}`}
              key={item.id}
              className="latest__card"
              style={{
                backgroundImage: `url(http://localhost:1337${imageUrl})`,
              }}
            >
              <div className="latest__card-body">
                <span className="latest__time">
                  {new Date(item.publishDate).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <h3 className="latest__card-title">{item.title}</h3>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="latest__footer">
        <button className="latest__all" onClick={() => navigate("/news")}>
          Все новости
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
