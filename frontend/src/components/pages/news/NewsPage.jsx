import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "../../../utils/useTranslation.js";

import NewsPageBlocks from "./NewsPageBlocks/NewsPageBlocks";
import NewsPageList from "./NewsPageList/NewsPageList";
import { useLocale } from "../../../context/LocaleContext";
import SEO from "../../seo/SEO.jsx";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [categoryName, setCategoryName] = useState(null);

  const { t } = useTranslation();

  const { id } = useParams();
  const location = useLocation();
  const isMain = location.pathname.endsWith("/news/main");
  const { locale } = useLocale();

  useEffect(() => {
    let url;
    if (isMain) {
      url = `https://hcs-production-423d.up.railway.app/api/news?filters[main][$eq]=true&populate=*&sort=publishDate:desc`;
    } else if (id) {
      url = `https://hcs-production-423d.up.railway.app/api/news?filters[categories][id][$eq]=${id}&populate=*&sort=publishDate:desc`;
    } else {
      url = `https://hcs-production-423d.up.railway.app/api/news?populate=*&sort=publishDate:desc`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setNews(data.data || []);

        if (id && data.data?.length > 0) {
          const cat = data.data[0].categories?.find(
            (c) => String(c.id) === String(id),
          );
          setCategoryName(cat?.name || null);
        } else {
          setCategoryName(null);
        }
      });
  }, [id, isMain]);

  if (!news.length) {
    return <h2 className="empty wrapper">Новостей нет</h2>;
  }

  const heroNews = news[0];
  const topNews = news.slice(1, 4);
  const restNews = news.slice(4);

  const title = isMain ? "Главные новости" : (categoryName ?? t("news"));

  return (
    <div className="newspage wrapper">
      <SEO
        title={title}
        description="Актуальные новости и события на портале Вестник"
      />
      <h1 className="newspage__title">{title}</h1>

      <NewsPageBlocks hero={heroNews} list={topNews} />

      <div className="more_news">
        <hr />
        <p>{t("moreNews")}</p>
        <hr />
      </div>

      <NewsPageList news={restNews} />
    </div>
  );
}
