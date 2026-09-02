import LatestNewsBlock from "./LatestNewsBlock/LatestNewsBlock";
// Styles
import "./_LatestNewsBlocks.scss";

export default function LatestNewsBlocks({ news }) {
  return (
    <div className="latest__blocks">
      {news.map((item) => (
        <LatestNewsBlock key={item.id} item={item} />
      ))}
    </div>
  );
}
