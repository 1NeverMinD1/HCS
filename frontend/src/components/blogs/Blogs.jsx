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
        `https://api.zhkh24.kz/api/blogs?fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en&fields[3]=desc_ru&fields[4]=desc_kk&fields[5]=desc_en&fields[6]=slug&fields[7]=publishDate&fields[8]=createdAt&populate[authors][fields][0]=name_ru&populate[authors][fields][1]=name_kk&populate[authors][fields][2]=name_en&populate[authors][fields][3]=position_ru&populate[authors][fields][4]=position_kk&populate[authors][fields][5]=position_en&populate[authors][populate][profile_img][fields][0]=url&sort=publishDate:desc&pagination[pageSize]=1`,
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
