import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../Header/Header";
import Filter from "../Filter/Filter";
import LatestNews from "../LatestNews/LatestNews";
import Trendings from "../Trendings/Trendings";
import Footer from "../Footer/Footer";
import NewsPage from "../../pages/NewsPage";

function Home() {
  return (
    <main className="home">
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news/:id" element={<NewsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
