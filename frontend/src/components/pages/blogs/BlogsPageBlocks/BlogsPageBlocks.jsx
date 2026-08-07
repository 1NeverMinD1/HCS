import BlogsPageBlock from "./BlogsPageBlock/BlogsPageBlock";
import BlogsPageFirstBlock from "./BlogsPageFirstBlock/BlogsPageFirstBlock";

export default function BlogsPageBlocks({ blogs }) {
  const blog = blogs[0];

  const list = blogs.slice(1);

  const remainder = list.length % 3;

  let normalBlogs = list;
  let lastRow = [];

  if (list.length > 3 && remainder !== 0) {
    normalBlogs = list.slice(0, list.length - (3 + remainder));
    lastRow = list.slice(-(3 + remainder));
  }

  return (
    <div className="blogspage__blocks">
      <BlogsPageFirstBlock blog={blog} />

      <div className="blogspage__list">
        {normalBlogs.map((item) => (
          <BlogsPageBlock key={item.id} blog={item} />
        ))}
      </div>

      {lastRow.length > 0 && (
        <div className="blogspage__list">
          {lastRow.map((item) => (
            <BlogsPageBlock key={item.id} blog={item} />
          ))}
        </div>
      )}
    </div>
  );
}
