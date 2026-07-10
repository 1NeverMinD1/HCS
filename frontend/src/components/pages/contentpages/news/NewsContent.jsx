import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SideMenu from "../sidemenu/SideMenu";
import SEO from "../../../SEO/SEO.jsx";
import { useLocale } from "../../../../context/LocaleContext";
import { getLangField } from "../../../../utils/getLangField";
import { getImageUrl } from "../../../../utils/getImageUrl";

function renderBlock(block, i) {
  switch (block.type) {
    case "paragraph": {
      const text = block.children?.[0]?.text;
      if (!text) return null;
      return <p key={i}>{text}</p>;
    }
    case "heading": {
      const Tag = `h${block.level}`;
      return <Tag key={i}>{block.children?.[0]?.text}</Tag>;
    }
    case "quote":
      return <blockquote key={i}>{block.children?.[0]?.text}</blockquote>;
    case "image":
      return (
        <img
          key={i}
          src={getImageUrl(block.image.url)}
          alt={block.image.alternativeText || ""}
        />
      );
    case "list":
      const ListTag = block.format === "ordered" ? "ol" : "ul";
      return (
        <ListTag key={i}>
          {block.children.map((item, j) => (
            <li key={j}>{item.children?.[0]?.text}</li>
          ))}
        </ListTag>
      );
    default:
      return null;
  }
}

function NewsItem({ item, isFirst }) {
  const { locale } = useLocale();
  const date = new Date(item.publishDate);
  const imgUrl = getImageUrl(
    item.desc_img?.formats?.small?.url || item.desc_img?.url,
  );
  const title = getLangField(item, "title", locale);
  const desc = getLangField(item, "desc", locale);
  const content = item?.[`content_${locale}`] || item?.content_ru || [];
  const category = getLangField(item?.header_cats?.[0], "name", locale);

  return (
    <div className="newscontent">
      {isFirst && (
        <Link to={`/${locale}/news`} className="back">
          <svg className="arrow_reverse" viewBox="0 0 5 9">
            <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>
          </svg>
          Все новости
        </Link>
      )}
      <div className="newscontent__header">
        <p className="cat">{category}</p>
        <p className="newscontent__header-date">
          {date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
      <h2 className="newscontent__title">{title}</h2>
      <p className="newscontent__intro">{desc}</p>
      <img src={imgUrl} alt="desc_img" className="newscontent__img" />
      <hr />
      <div className="newscontent__main">
        {content?.map((block, i) => renderBlock(block, i))}
      </div>
      <div className="newscontent__tags">
        {item.tags?.map((tag) => (
          <p key={tag.id}>{getLangField(tag, "name", locale)}</p>
        ))}
      </div>
    </div>
  );
}

export default function NewsContent() {
  const { locale } = useLocale();
  const { slug } = useParams();
  const [newsList, setNewsList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    setNewsList([]);
    setHasMore(true);

    fetch(
      `https://api.zhkh24.kz/api/news?filters[slug][$eq]=${slug}&populate=*`,
    )
      .then((res) => res.json())
      .then((data) => setNewsList([data.data?.[0]]));
  }, [slug]);

  const loadNext = useCallback(async () => {
    if (newsList.length === 0) return;

    const last = newsList[newsList.length - 1];

    const res = await fetch(
      `https://api.zhkh24.kz/api/news?populate=*&sort=publishDate:desc&pagination[pageSize]=1&filters[publishDate][$lt]=${last.publishDate}`,
    );
    const data = await res.json();
    const next = data.data?.[0];

    if (next) {
      setNewsList((prev) => [...prev, next]);
    } else {
      setHasMore(false);
    }
  }, [newsList]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadNext();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadNext, hasMore]);

  if (newsList.length === 0)
    return <h2 className="loading wrapper">Загрузка...</h2>;

  const mainItem = newsList[0];

  return (
    <div className="newscontent__layout">
      <SEO
        title={mainItem.seo_title || getLangField(mainItem, "title", locale)}
        description={
          mainItem.seo_desc || getLangField(mainItem, "desc", locale)
        }
        image={getImageUrl(
          mainItem.seo_image?.formats?.large?.url ||
            mainItem.seo_image?.url ||
            mainItem.desc_img?.formats?.large?.url ||
            mainItem.desc_img?.formats?.medium?.url ||
            mainItem.desc_img?.url,
        )}
        type="article"
      />

      <div className="newscontent__layout-main">
        {newsList.map((item, index) => (
          <NewsItem key={item.id} item={item} isFirst={index === 0} />
        ))}

        {hasMore && <div ref={loaderRef} style={{ height: "60px" }} />}

        {!hasMore && (
          <p style={{ textAlign: "center", padding: "2rem" }}>
            Больше новостей нет
          </p>
        )}
      </div>
      <div className="newscontent__layout-sidemenu">
        <SideMenu currentId={slug} />
      </div>
    </div>
  );
}
