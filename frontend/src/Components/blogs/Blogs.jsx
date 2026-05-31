import { useEffect, useState } from "react";
import BlogsBlocks from "./BlogsBlocks/BlogsBlocks";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "http://localhost:1337/api/blogs?populate=*&sort=publishDate:desc&pagination[pageSize]=4",
      );
      const data = await res.json();
      setBlogs(data.data);
    }

    fetchData();
  }, []);

  return (
    <div className="blogs">
      <div className="blogs__header">
        <h2 className="blogs__header-title">Блоги</h2>
        <a className="view_all">Все блоги</a>
      </div>

      <BlogsBlocks blogs={blogs} />
    </div>
  );
}
