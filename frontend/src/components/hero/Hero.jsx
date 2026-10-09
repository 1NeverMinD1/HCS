import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext.jsx";
import { getLangField } from "../../utils/getLangField.js";
import { formatLocalizedDate } from "../../utils/dateLocale.js";
import { getImageUrl } from "../../utils/getImageUrl.js";
import "./_Hero.scss";

const API = "https://api.zhkh24.kz/api";
const COMMON =
  "filters[isFeatured][$eq]=true&fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en&fields[3]=desc_ru&fields[4]=desc_kk&fields[5]=desc_en&fields[6]=slug&fields[7]=publishDate&fields[8]=createdAt&sort=publishDate:desc&pagination[pageSize]=1";
const CATS =
  "populate[categories][fields][0]=name_ru&populate[categories][fields][1]=name_kk&populate[categories][fields][2]=name_en";
const HERO_URLS = [
  `${API}/news?${COMMON}&populate[desc_img][fields][0]=url&populate[desc_img][fields][1]=formats&populate[desc_img][fields][2]=width&populate[header_cats][fields][0]=name_ru&populate[header_cats][fields][1]=name_kk&populate[header_cats][fields][2]=name_en`,
  `${API}/blogs?${COMMON}&populate[back_img][fields][0]=url&populate[back_img][fields][1]=formats&populate[back_img][fields][2]=width&${CATS}`,
  `${API}/articles?${COMMON}&populate[desc_img][fields][0]=url&populate[desc_img][fields][1]=formats&populate[desc_img][fields][2]=width&${CATS}`,
];

const HERO_SIZES = "(max-width: 430px) 70vw, 60vw";
const FORMAT_ORDER = ["small", "medium", "large"];

function isNewer(a, b) {
  const aPublish = new Date(a.publishDate).getTime();
  const bPublish = new Date(b.publishDate).getTime();

  if (aPublish !== bPublish) return aPublish > bPublish;

  const aCreated = new Date(a.createdAt).getTime();
  const bCreated = new Date(b.createdAt).getTime();
  return aCreated >= bCreated;
}

function buildSrcSet(img) {
  if (!img) return undefined;
  const parts = [];
  const formats = img.formats || {};
  for (const key of FORMAT_ORDER) {
    const f = formats[key];
    if (f?.url && f?.width) parts.push(`${getImageUrl(f.url)} ${f.width}w`);
  }
  if (img.url && img.width) parts.push(`${getImageUrl(img.url)} ${img.width}w`);
  return parts.length > 1 ? parts.join(", ") : undefined;
}

function pickSrc(img) {
  if (!img) return "";
  const f = img.formats || {};
  return (
    getImageUrl(f.medium?.url || f.large?.url || f.small?.url || img.url) || ""
  );
}

function readSnapshot() {
  const el = document.getElementById("hero-data");
  if (!el) return null;
  try {
    return JSON.parse(el.textContent);
  } catch {
    return null;
  }
}

function fetchHeroData() {
  const early = window.__heroPromise;
  window.__heroPromise = null;
  const own = () =>
    Promise.all(HERO_URLS.map((url) => fetch(url).then((res) => res.json())));
  if (!early) return own();
  return early.then((data) => data || own());
}

export default function Hero({ onLoadFeatured }) {
  const [featured, setFeatured] = useState(readSnapshot);
  const { locale } = useLocale();

  useEffect(() => {
    if (featured) {
      if (onLoadFeatured) onLoadFeatured(featured);
      return;
    }

    async function fetchFeatured() {
      const [newsRes, blogsRes, articlesRes] = await fetchHeroData();

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
      if (onLoadFeatured)
        onLoadFeatured({ ...winner.item, __type: winner.type });
    }

    fetchFeatured();
  }, []);

  if (!featured) {
    return <div className="hero hero--skeleton" />;
  }

  const isBlog = featured.__type === "blog";
  const isArticle = featured.__type === "article";

  const descImg = isBlog ? featured?.back_img : featured?.desc_img;
  const imageUrl = pickSrc(descImg);
  const srcSet = buildSrcSet(descImg);

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
      <div className="hero__bg">
        {imageUrl && (
          <img
            src={imageUrl}
            srcSet={srcSet}
            sizes={HERO_SIZES}
            alt=""
            fetchPriority="high"
          />
        )}
      </div>
      <p className="cat">{category}</p>

      <h2 className="hero__title">{title}</h2>
      <p className="hero__text">{desc}</p>

      <p className="hero__date">
        {formatLocalizedDate(featured.publishDate, locale)}
      </p>
    </Link>
  );
}
