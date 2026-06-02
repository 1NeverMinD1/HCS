import ArtsPageBlock from "./ArtsPageBlock/ArtsPageBlock";

export default function ArtsPageBlocks({ articles }) {
  return (
    <div className="artspage__list">
      {articles.map((item, index) => (
        <ArtsPageBlock key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
