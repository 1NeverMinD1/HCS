import { useEffect, useState } from "react";
import { useLocale } from "../../../context/LocaleContext.jsx";
import BlogsPageBlocks from "./BlogsPageBlocks/BlogsPageBlocks";
import { useTranslation } from "../../../utils/useTranslation.js";
import SEO from "../../SEO/SEO.jsx";

export default function BlogsPage() {
  const { locale } = useLocale();
  const [blogs, setBlogs] = useState([]);
  const { t } = useTranslation(locale);

  useEffect(() => {
    fetch(
      `https://api.zhkh24.kz/api/blogs?populate[authors][populate]=profile_img&populate[back_img][populate]=*&sort=publishDate:desc`,
    )
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.data || []);
      });
  }, []);

  return (
    <div className="blogspage wrapper">
      <SEO
        title={t("seo_static_title_blogs")}
        description={t("seo_static_desc_blogs")}
      />
      <h2 className="blogspage__title">{t("blogsIntro")}</h2>
      <p className="blogspage__intro">{t("blogsIntroText")}</p>

      <BlogsPageBlocks blogs={blogs} />
    </div>
  );
}
