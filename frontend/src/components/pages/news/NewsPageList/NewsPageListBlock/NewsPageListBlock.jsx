export default function NewsPageListBlock({ item }) {
  const imgUrl = item.desc_img?.formats?.small?.url || item.desc_img?.url;

  const category = item.categories?.[0]?.name;

  const date = new Date(item.publishDate);

  return (
    <div className="newspage__main-item">
      <img src={imgUrl} alt={item.title} />

      <div className="newspage__main-item-content">
        <p className="newspage__main-item-cat">{category}</p>
        <h3 className="newspage__main-item-title">{item.title}</h3>

        <p className="newspage__main-item-text">{item.desc}</p>

        <div className="newspage__main-item-date">
          <p>
            {date.toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <p>
            {date.toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
