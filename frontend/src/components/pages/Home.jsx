import { useState } from "react";

import Hero from "../hero/Hero";
import LatestNews from "../latestNews/LatestNews";
import Articles from "../articles/Articles";
import Blogs from "../blogs/Blogs";
import Events from "../events/Events";
import Ad from "../ad/Ad";

export default function Home() {
  const [featuredId, setFeaturedId] = useState(null);
  const [featuredTag, setFeaturedTag] = useState(null);

  return (
    <div className="home">
      <div className="wrapper">
        <Hero
          onLoadFeatured={(item) => {
            setFeaturedId(item.id);
            setFeaturedTag(item.categories?.[0]?.name || null);
          }}
        />

        <LatestNews featuredId={featuredId} />
        <Articles featuredTag={featuredTag} />
        <Blogs />
      </div>

      <Events />

      <div className="wrapper">
        <Ad />
      </div>
    </div>
  );
}
