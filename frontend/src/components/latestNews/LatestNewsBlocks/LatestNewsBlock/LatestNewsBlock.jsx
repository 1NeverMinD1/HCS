import { Link } from "react-router-dom";

export default function LatestNewsBlock({ item }) {
  const imgUrl =
    item.desc_img?.formats?.small?.url ||
    item.desc_img?.formats?.medium?.url ||
    item.desc_img?.url;

  const category = item.categories?.[0]?.name;

  return (
    <Link to={`/news/${item.documentId}`} className="latest__block">
      <div className="img_wrapper">
        <img src={imgUrl} alt={item.title} className="latest__block-img" />
      </div>

      <div className="latest__block-content">
        <p className="latest__block-cat">{category}</p>

        <h3 className="latest__block-title">{item.title}</h3>

        <p className="latest__block-text">{item.desc}</p>

        <p className="latest__block-date">
          {new Date(item.publishDate).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
