import { useEffect, useState } from "react";
import { useLocale } from "../../../context/LocaleContext.jsx";

import ArtsPageBlocks from "./ArtsPageBlocks/ArtsPageBlocks";

export default function ArtsPage() {
  const { locale } = useLocale();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(
      `https://hcs-production-423d.up.railway.app/api/articles?populate=*&&sort=publishDate:desc&locale=${locale}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.data || []);
      });
  }, [locale]);

  if (!articles.length) return null;

  return (
    <div className="artspage wrapper">
      <h2 className="artspage__title">Аналитические статьи</h2>
      <p className="artspage__intro">
        Глубокие исследования, экспертные мнения и обзоры ключевых тем от наших
        авторов
      </p>
      <ArtsPageBlocks articles={articles} />
    </div>
  );
}
