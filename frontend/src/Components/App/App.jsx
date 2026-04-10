import Header from "../Header/Header";
import Filter from "../Filter/Filter";
import LatestNews from "../LatestNews/LatestNews";
import Trendings from "../Trendings/Trendings";
import Footer from "../Footer/Footer";

export default function App() {
  return (
    <main>
      <Header />
      <div className="bg_color">
        <Filter />
      </div>
      <div className="main_info">
        <LatestNews />
        <Trendings />
      </div>
      <div className="bg_color">
        <Footer />
      </div>
    </main>
  );
}
