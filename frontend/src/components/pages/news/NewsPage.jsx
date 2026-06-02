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

  return (
    <div className="newspage wrapper">
      <h2 className="newspage__title">Новости</h2>
      <hr />
      <NewsPageBlocks news={news} />

      <div className="more_news">
        <hr />
        <p>ЕЩЁ НОВОСТИ</p>
        <hr />
      </div>
      <NewsPageList news={news} />
    </div>
  );
}
