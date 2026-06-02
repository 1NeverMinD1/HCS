import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LatestNewsBlocks from "./LatestNewsBlocks/LatestNewsBlocks";

export default function LatestNews({ featuredId }) {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function fetchNews() {
      const res = await fetch(
        "https://hcs-production-423d.up.railway.app/api/news?populate=*&sort=publishDate:desc&pagination[pageSize]=10",
      );

      const json = await res.json();

      const filtered = json.data.filter((item) => {
        const isNotHero = item.id !== featuredId;
        const hasTags = item.tags && item.tags.length > 0;

        return isNotHero && hasTags;
      });

      setNews(filtered.slice(0, 4));
    }

    fetchNews();
  }, [featuredId]);

  return (
    <div className="latest">
      <div className="latest__header">
        <h2 className="latest__header-title">Последние новости</h2>

        <Link to="/news" className="view_all">
          Все новости
        </Link>
      </div>

      <LatestNewsBlocks news={news} />
    </div>
  );
}
