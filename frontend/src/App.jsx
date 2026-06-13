// Изменить проблему с картинками, если их нет, добавить стиль.
// Добавить Q&A
// Добавить перевод

import { Routes, Route } from "react-router-dom";

import { LocaleProvider } from "./context/LocaleContext.jsx";

import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";

import Home from "./components/pages/Home.jsx";
import NewsPage from "./components/pages/news/NewsPage.jsx";
import ArtsPage from "./components/pages/articles/ArtsPage.jsx";
import BlogsPage from "./components/pages/blogs/BlogsPage.jsx";
import EventsPage from "./components/pages/events/EventsPage.jsx";
import QNA from "./components/pages/qna/QNA.jsx";

import NewsContent from "./components/pages/contentpages/news/NewsContent.jsx";
import ArticlesContent from "./components/pages/contentpages/articles/ArticlesContent.jsx";
import BlogsContent from "./components/pages/contentpages/blogs/BlogsContent.jsx";
import EventsContent from "./components/pages/contentpages/events/EventsContent.jsx";

export default function App() {
  return (
    <LocaleProvider>
      <div className="main">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/main" element={<NewsPage />} />
          <Route path="/news/category/:id" element={<NewsPage />} />
          <Route path="/news/:documentId" element={<NewsContent />} />
          <Route path="/articles" element={<ArtsPage />} />
          <Route path="/articles/:documentId" element={<ArticlesContent />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:documentId" element={<BlogsContent />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:documentId" element={<EventsContent />} />
          <Route path="/q-and-as" element={<QNA />} />
        </Routes>
        <hr />
        <div className="wrapper">
          <Footer />
        </div>
      </div>
    </LocaleProvider>
  );
}
