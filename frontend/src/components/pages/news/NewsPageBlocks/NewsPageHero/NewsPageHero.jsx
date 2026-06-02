export default function NewsPageHero({ news }) {
  const latestNewsImage =
    news.desc_img?.formats?.medium?.url ||
    news.desc_img?.formats?.small?.url ||
    news.desc_img?.url;

  const latestNewsCategory = news.categories?.[0]?.name;

  const latestNewsDate = new Date(news.publishDate);

  return (
    <div
      className="newspage__hero-main"
      style={{
        "--bg": `url(${latestNewsImage})`,
      }}
    >
      <div className="newspage__hero-overlay" />

      {latestNewsCategory && <p className="cat">{latestNewsCategory}</p>}

      <h1 className="newspage__hero-main-title">{news.title}</h1>

      <p className="newspage__hero-main-text">{news.desc}</p>

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
  );
}
