import ArtsPageBlock from "./ArtsPageBlock/ArtsPageBlock";

export default function ArtsPageBlocks({ articles }) {
  const remainder = articles.length % 3;

  let normalArticles = articles;
  let lastRow = [];

  if (articles.length > 3 && remainder !== 0) {
    normalArticles = articles.slice(0, articles.length - (3 + remainder));
    lastRow = articles.slice(-(3 + remainder));
  }

  return (
    <>
      <div className="artspage__list">
        {normalArticles.map((item, index) => (
          <ArtsPageBlock key={item.id} item={item} index={index} />
        ))}
      </div>

      {lastRow.length > 0 && (
        <div className="artspage__list">
          {lastRow.map((item, index) => (
            <ArtsPageBlock
              key={item.id}
              item={item}
              index={normalArticles.length + index}
            />
          ))}
        </div>
      )}
    </>
  );
}
