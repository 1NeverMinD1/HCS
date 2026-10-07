import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../utils/getLangField.js";
import { getResponsiveImage } from "../../../../utils/getResponsiveImage.js";
import { useTranslation } from "../../../../utils/useTranslation.js";
import { formatLocalizedDate } from "../../../../utils/dateLocale.js";
import "./_SideMenu.scss";

const NEWS_COUNT = 3;
const MAX_ITEMS = 8;
const FETCH_SIZE = 4;

const byDateDesc = (a, b) => new Date(b.publishDate) - new Date(a.publishDate);

const baseFields =
  "&fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en" +
  "&fields[3]=slug&fields[4]=publishDate";

const imagePopulate = (field) =>
  `&populate[${field}][fields][0]=url&populate[${field}][fields][1]=formats`;

const buildUrl = (endpoint, images) =>
  `https://api.zhkh24.kz/api/${endpoint}?sort=publishDate:desc&pagination[pageSize]=${FETCH_SIZE}` +
  baseFields +
  images.map(imagePopulate).join("");

export default function SideMenu({ currentId }) {
  const [items, setItems] = useState([]);
  const { locale } = useLocale();
  const { t } = useTranslation();

  useEffect(() => {
    Promise.all([
      fetch(buildUrl("news", ["desc_img"])).then((res) => res.json()),
      fetch(buildUrl("articles", ["desc_img"])).then((res) => res.json()),
      fetch(buildUrl("blogs", ["back_img"])).then((res) => res.json()),
      fetch(buildUrl("events", ["cover_img", "desc_img"])).then((res) =>
        res.json(),
      ),
    ]).then(([news, articles, blogs, events]) => {
      const prepare = (res, type) =>
        (res.data || [])
          .map((i) => ({ ...i, type }))
          .filter((i) => i.slug !== currentId);

      const newsList = prepare(news, "news").slice(0, NEWS_COUNT);

      const otherLists = [
        prepare(articles, "article"),
        prepare(blogs, "blog"),
        prepare(events, "event"),
      ];

      const guaranteed = otherLists.flatMap((list) => list.slice(0, 1));

      const rest = otherLists.flatMap((list) => list.slice(1)).sort(byDateDesc);

      const freeSlots = Math.max(
        0,
        MAX_ITEMS - newsList.length - guaranteed.length,
      );

      const all = [
        ...newsList,
        ...guaranteed,
        ...rest.slice(0, freeSlots),
      ].sort(byDateDesc);

      setItems(all);
    });
  }, [currentId]);

  const linkMap = {
    news: "news",
    article: "articles",
    blog: "blogs",
    event: "events",
  };

  const labelMap = {
    news: t("labelNews"),
    article: t("labelArticle"),
    blog: t("labelBlog"),
    event: t("labelEvent"),
  };

  return (
    <div className="sidemenu">
      <h2>{t("latest")}</h2>
      <div className="sidemenu__items">
        {items.map((item) => {
          const title = getLangField(item, "title", locale);
          const { src, srcSet } = getResponsiveImage(
            item.back_img || item.cover_img || item.desc_img,
            "thumbnail",
          );

          return (
            <Link
              key={`${item.type}-${item.id}`}
              to={`/${locale}/${linkMap[item.type]}/${item.slug}`}
              className={`sidemenu__item sidemenu__item--${item.type}`}
            >
              <div className="sidemenu__item-img">
                <img
                  loading="lazy"
                  decoding="async"
                  src={src}
                  srcSet={srcSet}
                  sizes="200px"
                  alt=""
                />
              </div>
              <div className="sidemenu__item-content">
                <p className="sidemenu__item-label">{labelMap[item.type]}</p>
                <p className="sidemenu__item-title">{title}</p>
                <p className="sidemenu__item-date">
                  {formatLocalizedDate(item.publishDate, locale)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
