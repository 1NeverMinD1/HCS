import Header from "./components/header/Header.jsx";
import Hero from "./components/hero/Hero.jsx";
import LatestNews from "./components/latestNews/LatestNews.jsx";
import Articles from "./components/articles/Articles.jsx";
import Blogs from "./components/blogs/Blogs.jsx";
import Events from "./components/events/Events.jsx";
import Ad from "./components/ad/Ad.jsx";
import Footer from "./components/footer/Footer.jsx";

export default function App() {
  return (
    <div className="main">
      <Header />
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
      <hr />
      <div className="wrapper">
        <Footer />
      </div>
    </div>
  );
}
