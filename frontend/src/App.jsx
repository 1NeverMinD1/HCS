import { Routes, Route } from "react-router-dom";

import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";

// Routes

import Home from "./components/pages/Home.jsx";
import NewsPage from "./components/pages/news/NewsPage.jsx";

export default function App() {
  return (
    <div className="main">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<NewsPage />} />
      </Routes>
      <hr />
      <div className="wrapper">
        <Footer />
      </div>
    </div>
  );
}
