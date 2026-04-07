export default function NewsBlock({ item }) {
  return (
    <div className="news_block">
      <h3>{item.title}</h3>
      <p>{item.content}</p>
      <small>{item.publishTime}</small>
    </div>
  );
}
