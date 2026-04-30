export default function BPIntro({ item, imageUrl }) {
  const date = item.publishDate || item.createdAt;

  return (
    <div className="page__intro">
      <div className="page__intro-meta">
        <span className="page__date">
          {new Date(date).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        {item.author && <span className="bp__author-badge">{item.author}</span>}
      </div>

      <h1 className="page__title">{item.title}</h1>

      {imageUrl && (
        <div className="page__img-wrap">
          <img
            src={`http://localhost:1337${imageUrl}`}
            alt={item.title}
            className="page__img"
          />
        </div>
      )}

      {item.desc && <p className="bp__desc">{item.desc}</p>}
    </div>
  );
}
