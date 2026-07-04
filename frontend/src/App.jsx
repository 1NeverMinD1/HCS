import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { LocaleProvider } from "./context/LocaleContext.jsx";
import { useYandexMetrika } from "./utils/useYandexMetrika.js";

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
import QnasContent from "./components/pages/contentpages/qnas/QnasContent.jsx";

export default function App() {
  useYandexMetrika();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <LocaleProvider>
      <div className="main">
        <Header />

        <Routes>
          {/* Домашняя страница */}
          <Route path="/" element={<Home />} />
          {/* Все новости */}
          <Route path="/:locale/news" element={<NewsPage />} />
          {/* Главные новости */}
          <Route path="/:locale/news/main" element={<NewsPage />} />
          {/* Категории новостей */}
          <Route path="/:locale/news/category/:id" element={<NewsPage />} />
          {/* Полная новость */}
          <Route path="/:locale/news/:slug" element={<NewsContent />} />
          {/* Все статьи */}
          <Route path="/:locale/articles" element={<ArtsPage />} />
          {/* Полная статья */}
          <Route path="/:locale/articles/:slug" element={<ArticlesContent />} />
          {/* Все блоги */}
          <Route path="/:locale/blogs" element={<BlogsPage />} />
          {/* Полный блог */}
          <Route path="/:locale/blogs/:slug" element={<BlogsContent />} />
          {/* Все мероприятия */}
          <Route path="/:locale/events" element={<EventsPage />} />
          {/* Полное мероприятие */}
          <Route path="/:locale/events/:slug" element={<EventsContent />} />
          {/* Вопросы и ответы */}
          <Route path="/:locale/q-and-as" element={<QNA />} />
          {/* Полный вопрос */}
          <Route path="/:locale/q-and-as/:slug" element={<QnasContent />} />
        </Routes>
        <hr className="main_divide" />
        <div className="wrapper">
          <Footer />
        </div>
      </div>
    </LocaleProvider>
  );
}
