export default function LatestNewsBlock({ item }) {
  const imgUrl = `hcs-production-423d.up.railway.app${item.desc_img.url}`;

  const category = item.categories?.[0]?.name;

  return (
    <div className="latest__block">
      <img src={imgUrl} alt={item.title} />

      <div className="latest__block-content">
        <p className="latest__block-cat">{category}</p>

        <h3 className="latest__block-title">{item.title}</h3>

        <p className="latest__block-text">{item.desc}</p>

        <p className="latest__block-date">
          {new Date(item.publishDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
