import { useEffect, useState } from "react";
import NewsPageBlocks from "./NewsPageBlocks/NewsPageBlocks";
import NewsPageList from "./NewsPageList/NewsPageList";

export default function NewsPage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch(
      "https://hcs-production-423d.up.railway.app/api/news?populate=*&&sort=publishDate:desc",
    )
      .then((res) => res.json())
      .then((data) => {
        setNews(data.data || []);
      });
  }, []);

  if (!news.length) return null;

  const heroNews = news[0];
  const topNews = news.slice(1, 4);
  const restNews = news.slice(4);

  return (
    <div className="newspage wrapper">
      <h2 className="newspage__title">Новости</h2>
      <hr />

      <NewsPageBlocks hero={heroNews} list={topNews} />

      <div className="more_news">
        <hr />
        <p>ЕЩЁ НОВОСТИ</p>
        <hr />
      </div>

      <NewsPageList news={restNews} />
    </div>
  );
}
