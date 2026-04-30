import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Trendings from "../../../components/Trendings/Trendings";

export default function BlogsListPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "http://localhost:1337/api/blogs?populate=desc_img&pagination[pageSize]=6&sort=publishDate:desc",
    )
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page-state">Загрузка...</div>;

  return (
    <main className="page">
      <Header />
      <div className="home__content">
        <div className="latest">
          <button className="page__back" onClick={() => navigate(-1)}>
            ← Назад
          </button>

          <div className="latest__header">
            <h2 className="latest__title">Блоги</h2>
          </div>

          <div className="blogs__grid">
            {blogs.length === 0 && (
              <p className="category__empty">Блогов пока нет</p>
            )}
            {blogs.map((item) => {
              const imageUrl =
                item.desc_img?.formats?.medium?.url || item.desc_img?.url;
              return (
                <Link
                  to={`/blogs/${item.documentId}`}
                  key={item.id}
                  className="blog__card"
                  style={{
                    backgroundImage: `url(http://localhost:1337${imageUrl})`,
                  }}
                >
                  <div className="blog__card-meta">
                    <span className="blog__card-author">{item.author}</span>
                  </div>
                  <div className="latest__card-body">
                    <span className="latest__time">
                      {item.publishDate
                        ? new Date(item.publishDate).toLocaleDateString(
                            "ru-RU",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : new Date(item.createdAt).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                    </span>
                    <h3 className="latest__card-title">{item.title}</h3>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="latest__footer">
            <button className="latest__all">
              Показать все
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <Trendings />
      </div>
      <Footer />
    </main>
  );
}
