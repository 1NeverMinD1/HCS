import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext.jsx";
import { getLangField } from "../../utils/getLangField.js";
import { formatLocalizedDate } from "../../utils/dateLocale.js";
import { getImageUrl } from "../../utils/getImageUrl.js";

function isNewer(a, b) {
  const aPublish = new Date(a.publishDate).getTime();
  const bPublish = new Date(b.publishDate).getTime();

  if (aPublish !== bPublish) return aPublish > bPublish;

  const aCreated = new Date(a.createdAt).getTime();
  const bCreated = new Date(b.createdAt).getTime();
  return aCreated >= bCreated;
}

export default function Hero({ onLoadFeatured }) {
  const [featured, setFeatured] = useState(null);
  const { locale } = useLocale();

  useEffect(() => {
    async function fetchFeatured() {
      const [newsRes, blogsRes, articlesRes] = await Promise.all([
        fetch(
          `https://api.zhkh24.kz/api/news?filters[isFeatured][$eq]=true&fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en&fields[3]=desc_ru&fields[4]=desc_kk&fields[5]=desc_en&fields[6]=slug&fields[7]=publishDate&fields[8]=createdAt&populate[desc_img][fields][0]=url&populate[header_cats][fields][0]=name_ru&populate[header_cats][fields][1]=name_kk&populate[header_cats][fields][2]=name_en&sort=publishDate:desc&pagination[pageSize]=1`,
        ).then((res) => res.json()),
        fetch(
          `https://api.zhkh24.kz/api/blogs?filters[isFeatured][$eq]=true&fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en&fields[3]=desc_ru&fields[4]=desc_kk&fields[5]=desc_en&fields[6]=slug&fields[7]=publishDate&fields[8]=createdAt&populate[back_img][fields][0]=url&populate[categories][fields][0]=name_ru&populate[categories][fields][1]=name_kk&populate[categories][fields][2]=name_en&sort=publishDate:desc&pagination[pageSize]=1`,
        ).then((res) => res.json()),
        fetch(
          `https://api.zhkh24.kz/api/articles?filters[isFeatured][$eq]=true&fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en&fields[3]=desc_ru&fields[4]=desc_kk&fields[5]=desc_en&fields[6]=slug&fields[7]=publishDate&fields[8]=createdAt&populate[desc_img][fields][0]=url&populate[categories][fields][0]=name_ru&populate[categories][fields][1]=name_kk&populate[categories][fields][2]=name_en&sort=publishDate:desc&pagination[pageSize]=1`,
        ).then((res) => res.json()),
      ]);

      const candidates = [
        { item: newsRes.data?.[0] || null, type: "news" },
        { item: blogsRes.data?.[0] || null, type: "blog" },
        { item: articlesRes.data?.[0] || null, type: "article" },
      ].filter((c) => c.item !== null);

      if (candidates.length === 0) return;

      const winner = candidates.reduce((best, current) =>
        isNewer(current.item, best.item) ? current : best,
      );

      setFeatured({ ...winner.item, __type: winner.type });
      if (onLoadFeatured) onLoadFeatured(winner.item);
    }

    fetchFeatured();
  }, []);

  if (!featured) return null;

  const isBlog = featured.__type === "blog";
  const isArticle = featured.__type === "article";

  const imageUrl = getImageUrl(featured?.desc_img?.url) || "";

  const category = isBlog
    ? getLangField(featured?.categories?.[0], "name", locale)
    : isArticle
      ? getLangField(featured?.categories?.[0], "name", locale)
      : getLangField(featured?.header_cats?.[0], "name", locale);

  const title = getLangField(featured, "title", locale);
  const desc = getLangField(featured, "desc", locale);

  const link = isBlog
    ? `/${locale}/blogs/${featured.slug}`
    : isArticle
      ? `/${locale}/articles/${featured.slug}`
      : `/${locale}/news/${featured.slug}`;

  return (
    <Link to={link} className="hero">
      <div
        className="hero__bg"
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
      />
      <p className="cat">{category}</p>

      <h1 className="hero__title">{title}</h1>
      <p className="hero__text">{desc}</p>

      <p className="hero__date">
        {formatLocalizedDate(featured.publishDate, locale)}
      </p>
    </Link>
  );
}
