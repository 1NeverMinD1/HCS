import { useEffect, useState } from "react";
import { useLocale } from "../../../context/LocaleContext.jsx";
import BlogsPageBlocks from "./BlogsPageBlocks/BlogsPageBlocks";
import { useTranslation } from "../../../utils/useTranslation.js";
import SEO from "../../seo/SEO.jsx";

export default function BlogsPage() {
  const { locale } = useLocale();
  const [blogs, setBlogs] = useState([]);
  const { t } = useTranslation(locale);

  useEffect(() => {
    fetch(
      `https://hcs-production-423d.up.railway.app/api/blogs?populate=*&sort=publishDate:desc`,
    )
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.data || []);
      });
  }, []);

  return (
    <div className="blogspage wrapper">
      <SEO
        title="Авторские блоги"
        description="Личные мнения, истории и размышления от нашего сообщества"
      />
      <h2 className="blogspage__title">{t("blogsIntro")}</h2>
      <p className="blogspage__intro">{t("blogsIntroText")}</p>

      <BlogsPageBlocks blogs={blogs} />
    </div>
  );
}
