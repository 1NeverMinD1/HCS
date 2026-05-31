import BlogsBlock from "../BlogsBlocks/BlogsBlock/BlogsBlock";

export default function BlogsBlocks({ blogs }) {
  if (!blogs?.length) return null;

  return (
    <div className="blogs__blocks">
      {blogs.map((item) => (
        <BlogsBlock key={item.id} blog={item} />
      ))}
    </div>
  );
}
