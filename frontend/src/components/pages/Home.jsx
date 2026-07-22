import { useEffect, useState } from "react";
import { useLocale } from "../../context/LocaleContext.jsx";

import Hero from "../hero/Hero";
import LatestNews from "../latestNews/LatestNews";
import Articles from "../articles/Articles";
import Blogs from "../blogs/Blogs";
import Events from "../events/Events";
import Email from "../email/Email";
import Ad from "../ad/Ad";
import Trendings from "../trendings/Trendings";
import EventsList from "../eventslist/EventsList";
import SEO from "../SEO/SEO.jsx";
import { useTranslation } from "../../utils/useTranslation.js";

export default function Home() {
  const { locale } = useLocale();
  const [featuredId, setFeaturedId] = useState(null);
  const [featuredTag, setFeaturedTag] = useState(null);
  const [hasAd, setHasAd] = useState(false);
  const { t } = useTranslation(locale);

  const [allNews, setAllNews] = useState([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      const res = await fetch(
        `https://api.zhkh24.kz/api/news?populate=*&sort=publishDate:desc&pagination[pageSize]=100`,
      );
      const json = await res.json();
      setAllNews(json.data || []);
      setIsNewsLoading(false);
    }
    fetchNews();
  }, []);

  const mainNews = allNews
    .filter((item) => item.id !== featuredId && item.main === true)
    .slice(0, 3);

  const mainIds = new Set(mainNews.map((item) => item.id));
  const trendingNews = allNews.filter((item) => !mainIds.has(item.id));

  return (
    <div className="home">
      <SEO
        title={t("seo_static_title_home")}
        description={t("seo_static_desc_home")}
      />

      <div className="wrapper">
        <div className="home__news-block">
          <div className="home__news-item">
            <div
              className={`home__header ${!hasAd ? "home__header--no-ad" : ""}`}
            >
              <Hero
                onLoadFeatured={(item) => {
                  setFeaturedId(item.id);
                  setFeaturedTag(item.categories?.[0]?.name || null);
                }}
              />
              <Ad hasAd={hasAd} />
            </div>
            {!isNewsLoading && <LatestNews news={mainNews} />}
          </div>
          {!isNewsLoading && <Trendings news={trendingNews} />}
        </div>
        <div className="home__arts-block">
          <Articles featuredTag={featuredTag} />
          <EventsList />
        </div>
        <Blogs />
      </div>

      <Events />

      {!isNewsLoading && (
        <div className="wrapper">
          <Email />
        </div>
      )}
    </div>
  );
}
