import NewsPageBlock from "./NewsPageBlock/NewsPageBlock";
import NewsPageHero from "./NewsPageHero/NewsPageHero";

export default function NewsPageBlocks({ news }) {
  const latestNews = news[0];

  return (
    <div className="newspage__hero">
      <NewsPageHero news={latestNews} />

      <div className="newspage__hero-list">
        {news.slice(1).map((item) => (
          <NewsPageBlock key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
