import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LatestNewsBlocks from "./LatestNewsBlocks/LatestNewsBlocks";
import { useLocale } from "../../context/LocaleContext.jsx";

export default function LatestNews({ featuredId }) {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useLocale();

  useEffect(() => {
    async function fetchNews() {
      const res = await fetch(
        `https://hcs-production-423d.up.railway.app/api/news?populate=*&sort=publishDate:desc&pagination[pageSize]=6&locale=${locale}`,
      );

      const json = await res.json();

      const filtered = json.data.filter(
        (item) => item.id !== featuredId && item.main === true,
      );
      setNews(filtered.slice(0, 4));
      setIsLoading(false);
    }

    fetchNews();
  }, [featuredId, locale]);

  if (isLoading) return null;

  return (
    <div className="latest">
      <LatestNewsBlocks news={news} />

      <div className="latest__link">
        <Link to={`/${locale}/news/main`} className="view_all">
          Все главные новости
          <svg className="arrow" viewBox="0 0 5 9">
            <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
}
