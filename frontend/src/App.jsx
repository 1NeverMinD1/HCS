import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { LocaleProvider } from "./context/LocaleContext.jsx";
import { useYandexMetrika } from "./utils/useYandexMetrika.js";

import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";

const Home = lazy(() => import("./components/pages/Home.jsx"));
const NewsPage = lazy(() => import("./components/pages/news/NewsPage.jsx"));
const ArtsPage = lazy(() => import("./components/pages/articles/ArtsPage.jsx"));
const BlogsPage = lazy(() => import("./components/pages/blogs/BlogsPage.jsx"));
const EventsPage = lazy(
  () => import("./components/pages/events/EventsPage.jsx"),
);
const QNA = lazy(() => import("./components/pages/qna/QNA.jsx"));

const NewsContent = lazy(
  () => import("./components/pages/contentpages/news/NewsContent.jsx"),
);
const ArticlesContent = lazy(
  () => import("./components/pages/contentpages/articles/ArticlesContent.jsx"),
);
const BlogsContent = lazy(
  () => import("./components/pages/contentpages/blogs/BlogsContent.jsx"),
);
const EventsContent = lazy(
  () => import("./components/pages/contentpages/events/EventsContent.jsx"),
);
const QnasContent = lazy(
  () => import("./components/pages/contentpages/qnas/QnasContent.jsx"),
);

const Authors = lazy(
  () => import("./components/pages/contentpages/authors/Authors.jsx"),
);
const CategoryPage = lazy(
  () => import("./components/pages/contentpages/сategoryPage/CategoryPage.jsx"),
);
const TagPage = lazy(
  () => import("./components/pages/contentpages/tagPage/TagPage.jsx"),
);

// FooterLinks

const Imprint = lazy(() => import("./components/footer-links/Imprint.jsx"));
const About = lazy(() => import("./components/footer-links/About.jsx"));
const Advertising = lazy(
  () => import("./components/footer-links/Advertising.jsx"),
);
const Contacts = lazy(() => import("./components/footer-links/Contacts.jsx"));
const EditorialPolicy = lazy(
  () => import("./components/footer-links/Editorial-policy.jsx"),
);
const Privacy = lazy(() => import("./components/footer-links/Privacy.jsx"));
const Terms = lazy(() => import("./components/footer-links/Terms.jsx"));

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

        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Navigate to="/ru" replace />} />
            {/* Домашняя страница */}
            <Route path="/:locale" element={<Home />} />
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
            <Route
              path="/:locale/articles/:slug"
              element={<ArticlesContent />}
            />
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
            {/* Автор */}
            <Route path="/:locale/author/:slug" element={<Authors />} />
            {/* FooterLinks */}
            {/* Imprint */}
            <Route path="/:locale/imprint" element={<Imprint />} />
            {/* About */}
            <Route path="/:locale/about" element={<About />} />
            {/* Advertising */}
            <Route path="/:locale/advertising" element={<Advertising />} />
            {/* Contacts */}
            <Route path="/:locale/contacts" element={<Contacts />} />
            {/* Editorial-policy */}
            <Route
              path="/:locale/editorial-policy"
              element={<EditorialPolicy />}
            />
            {/* Privacy */}
            <Route path="/:locale/privacy" element={<Privacy />} />
            {/* Terms */}
            <Route path="/:locale/terms" element={<Terms />} />
            {/* Категория (для статей/блогов/событий/qna) */}
            <Route path="/:locale/category/:id" element={<CategoryPage />} />
            {/* Тег */}
            <Route path="/:locale/tag/:id" element={<TagPage />} />
          </Routes>
        </Suspense>

        <hr className="main_divide" />
        <div className="wrapper">
          <Footer />
        </div>
      </div>
    </LocaleProvider>
  );
}
