export default function NewsPageBlock({ item }) {
  const imgUrl = item.desc_img?.formats?.small?.url || item.desc_img?.url;

  const category = item.categories?.[0]?.name;

  return (
    <div className="newspage__hero-item">
      <img src={imgUrl} alt={item.title} />

      <div className="newspage__hero-item-info">
        <p className="newspage__hero-item-cat">{category}</p>

        <h3 className="newspage__hero-item-title">{item.title}</h3>

        <p className="newspage__hero-item-text">{item.desc}</p>

        <p className="newspage__hero-item-date">
          {new Date(item.publishDate).toLocaleDateString("ru-RU")}
        </p>
      </div>
    </div>
  );
}
