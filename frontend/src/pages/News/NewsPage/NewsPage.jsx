import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Trendings from "../../../components/Trendings/Trendings";
import NewsPageArticle from "../NPArticle/NPArticle";

export default function NewsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `http://localhost:1337/api/news/${id}?populate[0]=desc_img&populate[1]=tags`,
    )
      .then((res) => res.json())
      .then((data) => {
        setItem(data.data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="page-state">Загрузка...</div>;
  if (!item) return <div className="page-state">Новость не найдена</div>;

  const imageUrl = item.desc_img?.formats?.large?.url || item.desc_img?.url;

  return (
    <main className="page">
      <Header />
      <div className="home__content">
        <div className="page__block">
          <button className="page__back" onClick={() => navigate(-1)}>
            ← Назад
          </button>
          <NewsPageArticle item={item} imageUrl={imageUrl} />
        </div>
        <Trendings />
      </div>
      <Footer />
    </main>
  );
}
