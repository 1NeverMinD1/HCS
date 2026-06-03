import BlogsPageBlock from "./BlogsPageBlock/BlogsPageBlock";
import BlogsPageFirstBlock from "./BlogsPageFirstBlock/BlogsPageFirstBlock";

export default function BlogsPageBlocks({ blogs }) {
  const blog = blogs[0];
  return (
    <div className="blogspage__blocks">
      <BlogsPageFirstBlock blog={blog} />
      <div className="blogspage__list">
        {blogs.slice(1).map((item) => (
          <BlogsPageBlock key={item.id} blog={item} />
        ))}
      </div>
    </div>
  );
}
