import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogsBlocks from "./BlogsBlocks/BlogsBlocks";
import { useLocale } from "../../context/LocaleContext.jsx";
import { useTranslation } from "../../utils/useTranslation.js";

export default function Blogs() {
  const { locale } = useLocale();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `https://hcs-production-423d.up.railway.app/api/blogs?populate=*&sort=publishDate:desc&pagination[pageSize]=4`,
      );
      const data = await res.json();
      setBlogs(data.data);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  if (isLoading) return null;

  return (
    <div className="blogs">
      <div className="blogs__header">
        <h2 className="blogs__header-title">{t("blogs")}</h2>
        <Link to={`/${locale}/blogs`} className="view_all">
          {t("allBlogs")}
          <svg className="arrow" viewBox="0 0 5 9">
            <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>
          </svg>
        </Link>
      </div>

      <BlogsBlocks blogs={blogs} />
    </div>
  );
}
