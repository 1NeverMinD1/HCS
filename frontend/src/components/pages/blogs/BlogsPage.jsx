import { useEffect, useState } from "react";

import BlogsPageBlocks from "./BlogsPageBlocks/BlogsPageBlocks";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch(
      "https://hcs-production-423d.up.railway.app/api/blogs?populate=*&&sort=publishDate:desc",
    )
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.data || []);
      });
  }, []);

  return (
    <div className="blogspage wrapper">
      <h2 className="blogspage__title">Авторские блоги</h2>
      <p className="blogspage__intro">
        Личные мнения, истории и размышления от нашего сообщества
      </p>

      <BlogsPageBlocks blogs={blogs} />
    </div>
  );
}
