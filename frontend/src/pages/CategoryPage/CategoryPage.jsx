import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Trendings from "../../components/Trendings/Trendings";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:1337/api/categories/${categoryId}`)
      .then((res) => res.json())
      .then((data) => setCategoryName(data.data?.name || ""));

    fetch(
      `http://localhost:1337/api/news?populate=desc_img&filters[categories][documentId][$eq]=${categoryId}&sort=publishDate:desc`,
    )
      .then((res) => res.json())
      .then((data) => {
        setNews(data.data);
        setLoading(false);
      });
  }, [categoryId]);

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
            <h2 className="latest__title">{categoryName}</h2>
          </div>

          <div className="latest__grid">
            {news.length === 0 && (
              <p className="category__empty">Новостей в этой категории нет</p>
            )}
            {news.map((item) => {
              const imageUrl =
                item.desc_img?.formats?.medium?.url || item.desc_img?.url;
              return (
                <Link
                  to={`/news/${item.documentId}`}
                  key={item.id}
                  className="latest__card"
                  style={{
                    backgroundImage: `url(http://localhost:1337${imageUrl})`,
                  }}
                >
                  <div className="latest__card-body">
                    <span className="latest__time">
                      {new Date(item.publishDate).toLocaleDateString("ru-RU", {
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
        </div>

        <Trendings />
      </div>

      <Footer />
    </main>
  );
}
