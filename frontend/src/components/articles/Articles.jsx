import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArticlesBlocks from "./ArticlesBlocks/ArticlesBlocks";
import { useLocale } from "../../context/LocaleContext.jsx";
import { useTranslation } from "../../utils/useTranslation.js";

export default function Articles({ featuredTag, fullWidth }) {
  const { locale } = useLocale();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `https://api.zhkh24.kz/api/articles?fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en&fields[3]=desc_ru&fields[4]=desc_kk&fields[5]=desc_en&fields[6]=slug&fields[7]=publishDate&populate[desc_img][fields][0]=url&populate[desc_img][fields][1]=formats&populate[categories][fields][0]=name_ru&populate[categories][fields][1]=name_kk&populate[categories][fields][2]=name_en&sort=publishDate:desc&pagination[pageSize]=3`,
      );

      const data = await res.json();
      setArticles(data.data || []);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  if (isLoading) return null;

  return (
    <div className={`articles ${fullWidth ? "articles--full" : ""}`}>
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
