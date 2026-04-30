import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Trendings() {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:1337/api/news?populate=desc_img")
      .then((res) => res.json())
      .then((data) => setNews(data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <aside className="trending">
      <div className="trending__header">
        <h2 className="trending__title">Популярное</h2>
        <button className="trending__button" onClick={() => navigate("/news")}>
          Все
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
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

      <div className="trending__list">
        {news.map((item, index) => (
          <Link
            to={`/news/${item.documentId}`}
            key={item.id}
            className="trending__card"
          >
            <span className="trending__index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="trending__content">
              <h4 className="trending__card-title">{item.title}</h4>
              <p className="trending__card-desc">
                {item.desc?.length > 80
                  ? item.desc.slice(0, 80) + "..."
                  : item.desc}
              </p>
              <span className="trending__time">
                {item.publishDate &&
                  new Date(item.publishDate).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "short",
                  })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
