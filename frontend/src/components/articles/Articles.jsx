import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArticlesBlocks from "./ArticlesBlocks/ArticlesBlocks";
import { useLocale } from "../../context/LocaleContext.jsx";
import { useTranslation } from "../../utils/useTranslation.js";

export default function Articles() {
  const { locale } = useLocale();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `https://api.zhkh24.kz/api/articles?populate=*&sort=publishDate:desc&pagination[pageSize]=3`,
      );

      const data = await res.json();
      setArticles(data.data || []);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  if (isLoading) return null;

  return (
    <div className="articles">
      <div className="articles__header">
        <h2 className="articles__header-title">{t("articles")}</h2>
        <Link to={`/${locale}/articles`} className="view_all">
          {t("allArts")}
          <svg className="arrow" viewBox="0 0 5 9">
            <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>
          </svg>
        </Link>
      </div>

      <ArticlesBlocks articles={articles} />
    </div>
  );
}
