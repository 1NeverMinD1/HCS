import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import LatestNews from "../../components/LatestNews/LatestNews";
import Trendings from "../../components/Trendings/Trendings";

export default function NewsListPage() {
  return (
    <main className="page">
      <Header />
      <div className="home__content">
        <LatestNews />
        <Trendings />
      </div>
      <Footer />
    </main>
  );
}
