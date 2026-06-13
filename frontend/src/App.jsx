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
          {/* Домашняя страница */}
          <Route path="/" element={<Home />} />
          {/* Все новости */}
          <Route path="/:locale/news" element={<NewsPage />} />
          {/* Главные новости */}
          <Route path="/:locale/news/main" element={<NewsPage />} />
          {/* Категории новостей */}
          <Route path="/:locale/news/category/:id" element={<NewsPage />} />
          {/* Полная новость */}
          <Route
            path="/:locale/news/:documentId/:slug"
            element={<NewsContent />}
          />
          {/* Все статьи */}
          <Route path="/:locale/articles" element={<ArtsPage />} />
          {/* Полная статья */}
          <Route
            path="/:locale/articles/:documentId/:slug"
            element={<ArticlesContent />}
          />
          {/* Все блоги */}
          <Route path="/:locale/blogs" element={<BlogsPage />} />
          {/* Полный блог */}
          <Route
            path="/:locale/blogs/:documentId/:slug"
            element={<BlogsContent />}
          />
          {/* Все мероприятия */}
          <Route path="/:locale/events" element={<EventsPage />} />
          {/* Полное мероприятие */}
          <Route
            path="/:locale/events/:documentId/:slug"
            element={<EventsContent />}
          />
          {/* Вопросы и ответы */}
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
