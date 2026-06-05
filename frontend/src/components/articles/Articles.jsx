import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArticlesBlocks from "./ArticlesBlocks/ArticlesBlocks";

export default function Articles({ featuredTag }) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "https://hcs-production-423d.up.railway.app/api/articles?populate=*&sort=publishDate:desc&pagination[pageSize]=10",
      );

      const data = await res.json();
      setArticles(data.data || []);
    }

    fetchData();
  }, []);

  const filteredArticles = featuredTag
    ? articles.filter((item) => item.tags?.some((t) => t.name === featuredTag))
    : articles;

  return (
    <div className="articles">
      <div className="articles__header">
        <h2 className="articles__header-title">Статьи</h2>
        <Link to="/articles" className="view_all">
          Все статьи
          <svg className="arrow" viewBox="0 0 5 9">
            <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>
          </svg>
        </Link>
      </div>

      <ArticlesBlocks articles={filteredArticles} />
    </div>
  );
}
