import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Trendings() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      const res = await fetch(
        "https://hcs-production-423d.up.railway.app/api/news?populate=*&sort=publishDate:desc&pagination[pageSize]=6",
      );

      const json = await res.json();

      const filtered = json.data.filter((item) => !item.main);

      setNews(filtered);
      setIsLoading(false);
    }

    fetchNews();
  }, []);

  if (isLoading) return null;

  return (
    <div className="trendings">
      <h2 className="trendings__title">Последние новости</h2>
      <div className="trendings__list">
        {news.map((item) => {
          const imgUrl =
            item.desc_img?.formats?.thumbnail?.url || item.desc_img?.url;
          return (
            <Link
              to={`/news/${item.documentId}`}
              key={item.id}
              className="trendings__block"
            >
              <div className="trendings__block-info">
                <h3>{item.title}</h3>
                <p className="trendings__block-date">
                  {new Date(item.publishDate).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <Link to="/news" className="see_all">
        Показать все
      </Link>
    </div>
  );
}
