import Hero from "../hero/Hero";
import LatestNews from "../latestNews/LatestNews";
import Articles from "../articles/Articles";
import Blogs from "../blogs/Blogs";
import Events from "../events/Events";
import Ad from "../ad/Ad";

export default function Home() {
  return (
    <div className="home">
      <div className="wrapper">
        <Hero />
        <LatestNews />
        <Articles />
        <Blogs />
      </div>

      <Events />

      <div className="wrapper">
        <Ad />
      </div>
    </div>
  );
}
