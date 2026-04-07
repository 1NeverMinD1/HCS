import { useEffect, useState } from "react";
import NewsBlock from "./NewsBlock";

export default function NewsList({ query }) {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:1337/api/news")
      .then((res) => res.json())
      .then((data) => setNews(data.data));
  }, []);

  // 🔥 Фильтрация
  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="news">
      <h2>Новости</h2>
      <div className="news_list">
        {filteredNews.map((item) => (
          <NewsBlock key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
