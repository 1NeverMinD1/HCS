import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext.jsx";
import { getLangField } from "../../utils/getLangField.js";
import { formatLocalizedDate } from "../../utils/dateLocale.js";
import { getImageUrl } from "../../utils/getImageUrl.js";

export default function Hero({ onLoadFeatured }) {
  const [featured, setFeatured] = useState(null);
  const { locale } = useLocale();

  useEffect(() => {
    fetch(
      `https://api.zhkh24.kz/api/news?filters[isFeatured][$eq]=true&populate=*&sort=publishDate:desc`,
    )
      .then((res) => res.json())
      .then((data) => {
        const item = data.data?.[0] || null;
        setFeatured(item);

        if (item && onLoadFeatured) {
          onLoadFeatured(item);
        }
      });
  }, []);

  if (!featured) return null;

  const imageUrl = getImageUrl(featured?.desc_img?.url) || "";

  const category = getLangField(featured?.header_cats?.[0], "name", locale);
  const title = getLangField(featured, "title", locale);
  const desc = getLangField(featured, "desc", locale);

  return (
    <Link to={`/${locale}/news/${featured.slug}`} className="hero">
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
