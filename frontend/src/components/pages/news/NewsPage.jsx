import { useEffect, useState } from "react";

export default function NewsPage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch(
      "https://hcs-production-423d.up.railway.app/api/news?populate=*&&sort=publishDate:desc",
    )
      .then((res) => res.json())
      .then((data) => {
        setNews(data.data || []);
      });
  }, []);

  if (!news.length) return null;

  const latestNews = news[0];

  const latestNewsImage =
    latestNews.desc_img?.formats?.medium?.url ||
    latestNews.desc_img?.formats?.small?.url ||
    latestNews.desc_img?.url;

  const latestNewsCategory = latestNews.tags?.[0]?.name;

  const latestNewsDate = new Date(latestNews.publishDate);

  return (
    <div className="newspage wrapper">
      <h2 className="newspage__title">Новости</h2>

      <div className="newspage__hero">
        <div
          className="newspage__hero-main"
          style={{
            backgroundImage: latestNewsImage
              ? `url(${latestNewsImage})`
              : "none",
          }}
        >
          <div className="newspage__hero-overlay" />

          {latestNewsCategory && <p className="cat">{latestNewsCategory}</p>}

          <h1 className="newspage__hero-main-title">{latestNews.title}</h1>

          <p className="newspage__hero-main-text">{latestNews.desc}</p>

          <div className="newspage__hero-main-date">
            <p>
              {latestNewsDate.toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            <p>
              {latestNewsDate.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="newspage__hero-list">
          {news.slice(1).map((item) => {
            const imgUrl =
              item.desc_img?.formats?.small?.url || item.desc_img?.url;

            const category = item.tags?.[0]?.name;

            return (
              <div key={item.id} className="newspage__hero-item">
                <img src={imgUrl} alt={item.title} />

                <div className="newspage__hero-item-info">
                  <p className="newspage__hero-item-cat">{category}</p>

                  <h3 className="newspage__hero-item-title">{item.title}</h3>

                  <p className="newspage__hero-item-text">{item.desc}</p>

                  <p className="newspage__hero-item-date">
                    {new Date(item.publishDate).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
