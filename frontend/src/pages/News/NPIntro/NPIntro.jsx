export default function NPIntro({ item, imageUrl }) {
  return (
    <div className="page__intro">
      <div className="page__intro-meta">
        <span className="page__date">
          {new Date(item.publishDate).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
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
    </div>
  );
}
