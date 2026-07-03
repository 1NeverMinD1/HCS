import { useState } from "react";
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

export default function Home() {
  const { locale } = useLocale();
  const [featuredId, setFeaturedId] = useState(null);
  const [featuredTag, setFeaturedTag] = useState(null);

  return (
    <div className="home">
      <SEO
        title="Главная"
        description="Актуальные новости, статьи, блоги и события на портале Вестник"
      />

      <div className="wrapper">
        <div className="home__news-block">
          <div className="home__news-item">
            <div className="home__header">
              <Hero
                onLoadFeatured={(item) => {
                  setFeaturedId(item.id);
                  setFeaturedTag(item.categories?.[0]?.name || null);
                }}
              />
              <Ad />
            </div>
            <LatestNews featuredId={featuredId} />
          </div>
          <Trendings />
        </div>
        <div className="home__arts-block">
          <Articles featuredTag={featuredTag} />
          <EventsList />
        </div>
        <Blogs />
      </div>

      <Events />

      <div className="wrapper">
        <Email />
      </div>
    </div>
  );
}
