import ArticlesBlock from "./ArticlesBlock/ArticlesBlock";

export default function ArticlesBlocks({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="articles__blocks">
      {articles.map((item) => (
        <ArticlesBlock key={item.id} article={item} />
      ))}
    </div>
  );
}
