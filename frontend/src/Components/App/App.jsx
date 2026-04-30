import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../Header/Header";
import LatestNews from "../LatestNews/LatestNews";
import Trendings from "../Trendings/Trendings";
import Footer from "../Footer/Footer";
import CategoryPage from "../../pages/CategoryPage/CategoryPage";
import NewsListPage from "../../pages/News/NewsListPage";
import NewsPage from "../../pages/News/NewsPage/NewsPage";
import BlogsListPage from "../../pages/Blogs/BlogsListPage/BlogsListPage";
import BlogsPage from "../../pages/Blogs/BlogsPage/BlogsPage";
import ArticlesListPage from "../../pages/Articles/ArticlesListPage/ArticlesListPage";
import ArticlesPage from "../../pages/Articles/ArticlesPage/ArticlesPage";

function Home() {
  return (
    <main className="home">
      <Header />
      <div className="home__content">
        <LatestNews />
        <Trendings />
      </div>
      <Footer />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<NewsListPage />} />
        <Route path="/news/:id" element={<NewsPage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/articles" element={<ArticlesListPage />} />
        <Route path="/articles/:id" element={<ArticlesPage />} />
        <Route path="/blogs" element={<BlogsListPage />} />
        <Route path="/blogs/:id" element={<BlogsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
