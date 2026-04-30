import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import Trendings from "../../../components/Trendings/Trendings";
import BPIntro from "../BPIntro/BPIntro";
import BPContent from "../BPContent/BPContent";

export default function BlogsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:1337/api/blogs/${id}?populate=desc_img`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data.data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="page-state">Загрузка...</div>;
  if (!item) return <div className="page-state">Блог не найден</div>;

  const imageUrl = item.desc_img?.formats?.large?.url || item.desc_img?.url;

  return (
    <main className="page">
      <Header />
      <div className="home__content">
        <div className="page__block">
          <button className="page__back" onClick={() => navigate(-1)}>
            ← Назад
          </button>
          <BPIntro item={item} imageUrl={imageUrl} />
          <div className="page__divider">
            <span />
            <span />
            <span />
          </div>
          <BPContent item={item} />
        </div>
        <Trendings />
      </div>
      <Footer />
    </main>
  );
}
