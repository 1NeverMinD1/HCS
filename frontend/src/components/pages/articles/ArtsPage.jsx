import { useEffect, useState } from "react";
import { useLocale } from "../../../context/LocaleContext.jsx";
import { useTranslation } from "../../../utils/useTranslation.js";
import ArtsPageBlocks from "./ArtsPageBlocks/ArtsPageBlocks";
import SEO from "../../SEO/SEO.jsx";

export default function ArtsPage() {
  const { locale } = useLocale();
  const [articles, setArticles] = useState([]);

  const { t } = useTranslation(locale);

  useEffect(() => {
    fetch(`https://api.zhkh24.kz/api/articles?populate=*&sort=publishDate:desc`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.data || []);
      });
  }, []);

  if (!articles.length) return null;

  return (
    <div className="artspage wrapper">
      <SEO
        title="Аналитические статьи"
        description="Глубокие исследования, экспертные мнения и обзоры ключевых тем от наших авторов"
      />
      <h2 className="artspage__title">{t("artsIntro")}</h2>
      <p className="artspage__intro">{t("artsIntroText")}</p>
      <ArtsPageBlocks articles={articles} />
    </div>
  );
}
