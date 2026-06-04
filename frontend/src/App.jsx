import { Routes, Route } from "react-router-dom";

import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";

// Routes

import Home from "./components/pages/Home.jsx";
import NewsPage from "./components/pages/news/NewsPage.jsx";
import ArtsPage from "./components/pages/articles/ArtsPage.jsx";
import BlogsPage from "./components/pages/blogs/BlogsPage.jsx";
import EventsPage from "./components/pages/events/EventsPage.jsx";

import NewsContent from "./components/pages/contentpages/news/NewsContent.jsx";
import ArticlesContent from "./components/pages/contentpages/articles/ArticlesContent.jsx";
import BlogsContent from "./components/pages/contentpages/blogs/BlogsContent.jsx";
import EventsContent from "./components/pages/contentpages/events/EventsContent.jsx";

export default function App() {
  return (
    <div className="main">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/category/:id" element={<NewsPage />} />
        <Route path="/news/:documentId" element={<NewsContent />} />
        <Route path="/articles" element={<ArtsPage />} />
        <Route path="/articles/:documentId" element={<ArticlesContent />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:documentId" element={<BlogsContent />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:documentId" element={<EventsContent />} />
      </Routes>
      <hr />
      <div className="wrapper">
        <Footer />
      </div>
    </div>
  );
}
