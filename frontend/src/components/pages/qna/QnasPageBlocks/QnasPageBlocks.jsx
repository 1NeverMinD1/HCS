import QnasPageBlock from "./QnasPageBlock/QnasPageBlock";
// Styles
import "./_QnasPageBlocks.scss";

export default function QnasPageBlocks({ qnas }) {
  return (
    <div className="qnaspage__blocks">
      {qnas.map((item) => (
        <QnasPageBlock key={item.id} qna={item} />
      ))}
    </div>
  );
}
