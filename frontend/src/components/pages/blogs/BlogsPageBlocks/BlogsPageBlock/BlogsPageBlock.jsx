export default function BlogsPageBlock({ item }) {
  if (!item) return null;

  const imgUrl =
    item.desc_img?.formats?.small?.url ||
    item.desc_img?.formats?.medium?.url ||
    item.desc_img?.url;

  const category = item.categories?.[0]?.name || item.tags?.[0]?.name;

  const date = new Date(item.publishDate);

  return (
    <div className="blogspage__item">
      {imgUrl && <img src={imgUrl} alt={item.title} />}
    </div>
  );
}
