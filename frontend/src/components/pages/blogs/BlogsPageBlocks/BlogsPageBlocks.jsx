import BlogsPageBlock from "./BlogsPageBlock/BlogsPageBlock";
import BlogsPageFirstBlock from "./BlogsPageFirstBlock/BlogsPageFirstBlock";
import "./_BlogsPageBlocks.scss";

export default function BlogsPageBlocks({ blogs }) {
  const [first, ...rest] = blogs;

  return (
    <div className="blogspage__blocks">
      <BlogsPageFirstBlock blog={first} />

      {rest.length > 0 && (
        <div className="blogspage__list">
          {rest.map((item) => (
            <BlogsPageBlock key={item.id} blog={item} />
          ))}
        </div>
      )}
    </div>
  );
}
