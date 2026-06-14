import QnasPageBlock from "./QnasPageBlock/QnasPageBlock";

export default function QnasPageBlocks({ qnas }) {
  return (
    <div className="qnaspage__blocks">
      {qnas.map((item) => (
        <QnasPageBlock key={item.id} qna={item} />
      ))}
    </div>
  );
}
