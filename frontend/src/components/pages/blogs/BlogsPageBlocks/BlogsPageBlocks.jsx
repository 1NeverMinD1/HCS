import BlogsBlock from "./BlogsPageBlock/BlogsPageBlock";
import BlogsPageFirstBlock from "./BlogsPageFirstBlock/BlogsPageFirstBlock";

export default function BlogsPageBlocks({ blogs }) {
  return (
    <div className="blogspge__blocks">
      <BlogsPageFirstBlock blogs={item} />
      {blogs.map((item) => (
        <BlogsBlock key={item.id} blog={item} />
      ))}
    </div>
  );
}
