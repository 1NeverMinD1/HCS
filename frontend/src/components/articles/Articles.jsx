import { useEffect, useState } from "react";
import ArticlesBlocks from "./ArticlesBlocks/ArticlesBlocks";

export default function Articles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "https://hcs-production-423d.up.railway.app/api/articles?populate=*&sort=publishDate:desc&pagination[pageSize]=4",
      );
      const data = await res.json();
      setArticles(data.data);
    }

    fetchData();
  }, []);

  return (
    <div className="articles">
      <div className="articles__header">
        <h2 className="articles__header-title">Статьи</h2>
        <a className="view_all">Все статьи</a>
      </div>

      <ArticlesBlocks articles={articles} />
    </div>
  );
}
