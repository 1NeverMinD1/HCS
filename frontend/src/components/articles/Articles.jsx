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
        </Link>
      </div>

      <ArticlesBlocks articles={filteredArticles} />
    </div>
  );
}
