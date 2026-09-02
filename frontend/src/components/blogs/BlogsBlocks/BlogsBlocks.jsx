import BlogsBlock from "../BlogsBlocks/BlogsBlock/BlogsBlock";
// Styles
import "./_BlogsBlocks.scss";

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
