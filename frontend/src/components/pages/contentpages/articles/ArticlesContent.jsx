import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SideMenu from "../sidemenu/SideMenu";
import SEO from "../../../SEO/SEO.jsx";
import RenderHtml from "../../../renderHtml/RenderHtml.jsx";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../utils/getLangField.js";
import { getImageUrl } from "../../../../utils/getImageUrl.js";

function renderBlock(block, i) {
  const renderChildren = (children = []) =>
    children.map((child, j) => {
      let content = child.text || "";

      if (child.bold) {
        content = <strong>{content}</strong>;
      }

      if (child.italic) {
        content = <em>{content}</em>;
      }

      if (child.underline) {
        content = <u>{content}</u>;
      }

      if (child.strikethrough) {
        content = <s>{content}</s>;
      }

      if (child.code) {
        content = <code>{content}</code>;
      }

      if (child.type === "link") {
        return (
          <a key={j} href={child.url} target="_blank" rel="noopener noreferrer">
            {renderChildren(child.children)}
          </a>
        );
      }

      return <span key={j}>{content}</span>;
    });

  switch (block.type) {
    case "paragraph":
      return <p key={i}>{renderChildren(block.children)}</p>;

    case "heading": {
      const Tag = `h${block.level || 2}`;
      return <Tag key={i}>{renderChildren(block.children)}</Tag>;
    }

    case "quote":
      return <blockquote key={i}>{renderChildren(block.children)}</blockquote>;

    case "image":
      return (
        <img
          key={i}
          src={getImageUrl(block.image.url)}
          alt={block.image.alternativeText || ""}
        />
      );

    case "list": {
      const ListTag = block.format === "ordered" ? "ol" : "ul";

      return (
        <ListTag key={i}>
          {block.children?.map((item, j) => (
            <li key={j}>{renderChildren(item.children)}</li>
          ))}
        </ListTag>
      );
    }

    case "code":
      return <RenderHtml key={i} html={block.children?.[0]?.text || ""} />;

    default:
      return null;
  }
}
function ArticleItem({ item, isFirst }) {
  const { locale } = useLocale();
  const date = new Date(item.publishDate);
  const imgUrl = getImageUrl(
    item.desc_img?.formats?.small?.url || item.desc_img?.url,
  );
  const title = getLangField(item, "title", locale);
  const desc = getLangField(item, "desc", locale);
  const content = item?.[`content_${locale}`] || item?.content_ru || [];
  const category = getLangField(item?.categories?.[0], "name", locale);

  return (
    <div className="artscontent">
      {isFirst && (
        <Link to={`/${locale}/articles`} className="back">
          <svg className="arrow_reverse" viewBox="0 0 5 9">
            <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>
          </svg>
          Все статьи
        </Link>
      )}
      <div className="artscontent__header">
        <p className="cat">{category}</p>
        <div className="artscontent__header-date">
          <p>
            {date.toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <h2 className="artscontent__title">{title}</h2>
      <img src={imgUrl} alt="desc_img" className="artscontent__img" />
      <hr />
      <div className="artscontent__main">
        {content?.map((block, i) => renderBlock(block, i))}
      </div>
      <div className="artscontent__tags">
        {item.tags?.map((tag) => (
          <p key={tag.id}>{getLangField(tag, "name", locale)}</p>
        ))}
      </div>
    </div>
  );
}

export default function ArticlesContent() {
  const { locale } = useLocale();
  const { slug } = useParams();
  const [articlesList, setArticlesList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    setArticlesList([]);
    setHasMore(true);

    fetch(
      `https://api.zhkh24.kz/api/articles?filters[slug][$eq]=${slug}&populate=*`,
    )
      .then((res) => res.json())
      .then((data) => setArticlesList([data.data?.[0]]));
  }, [slug]);

  const loadNext = useCallback(async () => {
    if (articlesList.length === 0) return;

    const last = articlesList[articlesList.length - 1];

    const res = await fetch(
      `https://api.zhkh24.kz/api/articles?populate=*&sort=publishDate:desc&pagination[pageSize]=1&filters[publishDate][$lt]=${last.publishDate}`,
    );
    const data = await res.json();
    const next = data.data?.[0];

    if (next) {
      setArticlesList((prev) => [...prev, next]);
    } else {
      setHasMore(false);
    }
  }, [articlesList]);

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

  if (articlesList.length === 0)
    return <h2 className="loading wrapper">Загрузка...</h2>;

  const mainItem = articlesList[0];

  return (
    <div className="artscontent__layout">
      <SEO
        seo={mainItem.SEO}
        og={mainItem.OG}
        title={getLangField(mainItem, "title", locale)}
        description={getLangField(mainItem, "desc", locale)}
        image={getImageUrl(
          mainItem.OG?.og_image?.formats?.large?.url ||
            mainItem.OG?.og_image?.url ||
            mainItem.desc_img?.formats?.large?.url ||
            mainItem.desc_img?.formats?.medium?.url ||
            mainItem.desc_img?.url,
        )}
        type="article"
      />
      <div className="artscontent__layout-main">
        {articlesList.map((item, index) => (
          <ArticleItem key={item.id} item={item} isFirst={index === 0} />
        ))}

        {hasMore && <div ref={loaderRef} style={{ height: "60px" }} />}

        {!hasMore && (
          <p style={{ textAlign: "center", padding: "2rem" }}>
            Больше статей нет
          </p>
        )}
      </div>
      <div className="artscontent__layout-sidemenu">
        <SideMenu currentId={slug} />
      </div>
    </div>
  );
}
