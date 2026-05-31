import { useEffect, useState } from "react";
import LatestNewsBlocks from "./LatestNewsBlocks/LatestNewsBlocks";

export default function LatestNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function fetchNews() {
      const res = await fetch(
        "hcs-production-423d.up.railway.app/api/news?populate=*&sort=publishDate:desc&pagination[pageSize]=4",
      );

      const json = await res.json();
      setNews(json.data);
    }

    fetchNews();
  }, []);

  return (
    <div className="latest">
      <div className="latest__header">
        <h2 className="latest__header-title">Последние новости</h2>
        <a className="view_all">Все новости</a>
      </div>

      <LatestNewsBlocks news={news} />
    </div>
  );
}
