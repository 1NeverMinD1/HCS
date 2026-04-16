import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Filter from "../components/Filter/Filter";
import Footer from "../components/Footer/Footer";

export default function NewsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:1337/api/news/${id}?populate=desc_img`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data.data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="news-page__loading">Загрузка...</div>;
  if (!item) return <div className="news-page__error">Новость не найдена</div>;

  const imageUrl = item.desc_img?.formats?.large?.url || item.desc_img?.url;

  return (
    <main className="page">
      <Header />
      <div className="bg_color">
        <Filter />
      </div>
      <div className="page__block">
        <button className="page__back" onClick={() => navigate(-1)}>
          ← Назад
        </button>

        <article className="page__art">
          <div className="page__intro">
            {imageUrl && (
              <img
                src={`http://localhost:1337${imageUrl}`}
                alt={item.title}
                className="page__img"
              />
            )}
            <div className="page__info">
              <h1 className="page__title">{item.title}</h1>
              <small className="page__date">
                {new Date(item.publishDate).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </small>
            </div>
          </div>
          <hr className="line" />
          <div className="page__content">
            {item.content?.map((block, index) => {
              switch (block.type) {
                case "paragraph": {
                  const text = block.children.map((c) => c.text).join("");
                  if (!text.trim()) return null;
                  return (
                    <p key={index}>
                      {block.children.map((child, i) => {
                        if (child.bold)
                          return <strong key={i}>{child.text}</strong>;
                        if (child.italic) return <em key={i}>{child.text}</em>;
                        return child.text;
                      })}
                    </p>
                  );
                }

                case "heading": {
                  const Tag = `h${block.level}`;
                  return (
                    <Tag key={index}>
                      {block.children.map((c) => c.text).join("")}
                    </Tag>
                  );
                }

                case "list":
                  if (block.format === "ordered") {
                    return (
                      <ol key={index}>
                        {block.children.map((li, i) => (
                          <li key={i}>
                            {li.children.map((c) => c.text).join("")}
                          </li>
                        ))}
                      </ol>
                    );
                  }
                  return (
                    <ul key={index}>
                      {block.children.map((li, i) => (
                        <li key={i}>
                          {li.children.map((c) => c.text).join("")}
                        </li>
                      ))}
                    </ul>
                  );

                case "image":
                  return (
                    <img
                      key={index}
                      src={block.image.url}
                      alt={block.image.alternativeText || ""}
                      className="page__content-img"
                    />
                  );

                case "quote":
                  return (
                    <blockquote key={index}>
                      {block.children.map((c) => c.text).join("")}
                    </blockquote>
                  );

                default:
                  return null;
              }
            })}
          </div>
        </article>
      </div>
      <div className="bg_color">
        <Footer />
      </div>
    </main>
  );
}
