import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogsBlocks from "./BlogsBlocks/BlogsBlocks";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "https://hcs-production-423d.up.railway.app/api/blogs?populate=*&sort=publishDate:desc&pagination[pageSize]=4",
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
        <Link to="/blogs" className="view_all">
          Все блоги
        </Link>
      </div>

      <BlogsBlocks blogs={blogs} />
    </div>
  );
}
