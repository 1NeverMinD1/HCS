import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../utils/getLangField.js";

export default function SideMenu({ currentId }) {
  const [items, setItems] = useState([]);
  const { locale } = useLocale();

  useEffect(() => {
    Promise.all([
      fetch(
        "https://hcs-production-423d.up.railway.app/api/news?populate=*&sort=publishDate:desc&pagination[pageSize]=3",
      ).then((res) => res.json()),
      fetch(
        "https://hcs-production-423d.up.railway.app/api/articles?populate=*&sort=publishDate:desc&pagination[pageSize]=3",
      ).then((res) => res.json()),
      fetch(
        "https://hcs-production-423d.up.railway.app/api/blogs?populate=*&sort=publishDate:desc&pagination[pageSize]=3",
      ).then((res) => res.json()),
      fetch(
        "https://hcs-production-423d.up.railway.app/api/events?populate=*&sort=start:desc&pagination[pageSize]=3",
      ).then((res) => res.json()),
    ]).then(([news, articles, blogs, events]) => {
      const all = [
        ...(news.data || []).map((i) => ({ ...i, type: "news" })),
        ...(articles.data || []).map((i) => ({ ...i, type: "article" })),
        ...(blogs.data || []).map((i) => ({ ...i, type: "blog" })),
        ...(events.data || []).map((i) => ({
          ...i,
          type: "event",
          publishDate: i.start,
        })),
      ]
        .filter((i) => i.documentId !== currentId)
        .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

      setItems(all);
    });
  }, []);

  const linkMap = {
    news: "/news",
    article: "/articles",
    blog: "/blogs",
    event: "/events",
  };

  const labelMap = {
    news: "Новость",
    article: "Статья",
    blog: "Блог",
    event: "Событие",
  };

  return (
    <div className="sidemenu">
      <h2>Последнее</h2>
      <div className="sidemenu__items">
        {items.map((item) => {
          const title =
            item.type === "event"
              ? getLangField(item, "name", locale)
              : getLangField(item, "title", locale);

          return (
            <Link
              key={`${item.type}-${item.id}`}
              to={`/${locale}/${linkMap[item.type]}/${item.slug}`}
              className={`sidemenu__item sidemenu__item--${item.type}`}
            >
              <div className="sidemenu__item-img">
                <img
                  src={
                    item.back_img?.url ||
                    item.desc_img?.formats?.small?.url ||
                    item.desc_img?.url
                  }
                  alt={getLangField(item, "title", locale)}
                />
              </div>
              <div className="sidemenu__item-content">
                <p className="sidemenu__item-label">{labelMap[item.type]}</p>
                <p className="sidemenu__item-title">{title}</p>
                <p className="sidemenu__item-date">
                  {new Date(item.publishDate).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Link>
          );
        })}{" "}
      </div>
    </div>
  );
}
