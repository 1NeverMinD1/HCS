import ArticlesBlock from "./ArticlesBlock/ArticlesBlock";
import ArticlesFirstBlock from "./ArticlesBlock/ArticlesFirstBlock/ArticlesFirstBlock";

export default function ArticlesBlocks({ articles }) {
  if (!articles || articles.length === 0) return null;

  const [first, ...rest] = articles;

  return (
    <div className="articles__blocks">
      <ArticlesFirstBlock article={first} />

      {rest.map((item) => (
        <ArticlesBlock key={item.id} article={item} />
      ))}
    </div>
  );
}
