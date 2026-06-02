export default function ArticlesBlock({ article }) {
  const imageUrl = article?.desc_img?.url
    ? article.desc_img.url.startsWith("http")
      ? article.desc_img.url
      : `https://hcs-production-423d.up.railway.app${article.desc_img.url}`
    : "";

  const category = article?.tags?.[0]?.name || "";

  const text = article?.content?.[0]?.children?.[0]?.text || "";

  return (
    <div className="articles__block">
      {imageUrl && <img src={imageUrl} alt={article.title} />}

      <div className="articles__block-content">
        <p className="articles__block-cat">{category}</p>
        <h3 className="articles__block-title">{article.title}</h3>
        <p className="articles__block-text">{text}</p>

        <p className="articles__block-date">
          {new Date(article.publishDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
