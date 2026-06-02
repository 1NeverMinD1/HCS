import NewsPageBlock from "./NewsPageBlock/NewsPageBlock";
import NewsPageHero from "./NewsPageHero/NewsPageHero";

export default function NewsPageBlocks({ hero, list }) {
  return (
    <div className="newspage__hero">
      <NewsPageHero news={hero} />

      <div className="newspage__hero-list">
        {list.map((item) => (
          <NewsPageBlock key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
