import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SideMenu from "../sidemenu/SideMenu";
import SEO from "../../../SEO/SEO.jsx";
import { useLocale } from "../../../../context/LocaleContext";
import {
  getLangField,
  parseMultilangField,
} from "../../../../utils/getLangField.js";
import { getImageUrl } from "../../../../utils/getImageUrl.js";
import { useTranslation } from "../../../../utils/useTranslation.js";
import AuthorsHeader from "../../../authorsHeader/AuthorsHeader.jsx";
import Tags from "../tags/Tags.jsx";

function renderBlock(block, i, locale, t) {
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

    case "image": {
      const rawCaption = block.image.caption?.trim();
      const caption = parseMultilangField(rawCaption, locale);
      const isUrl = caption && /^(https?:\/\/|www\.)/i.test(caption);

      const rawAlt = block.image.alternativeText?.trim();
      const alt = parseMultilangField(rawAlt, locale);

      return (
        <figure key={i} className="richtext-image">
          <img src={getImageUrl(block.image.url)} alt={alt || ""} />
          {caption && (
            <figcaption className="img_source">
              {t("source")}:{" "}
              {isUrl ? (
                <a
                  href={
                    caption.startsWith("http") ? caption : `https://${caption}`
                  }
                  target="_blank"
                  rel="nofollow noopener"
                >
                  {caption.replace(/^https?:\/\//, "")}
                </a>
              ) : (
                caption
              )}
            </figcaption>
          )}
        </figure>
      );
    }
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
function NewsItem({ item, isFirst }) {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const date = new Date(item.publishDate);
  const imgUrl = getImageUrl(item.desc_img?.url);
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
      {item.authors?.[0] && (
        <div className="authorsHeader">
          <AuthorsHeader
            profileImg={getImageUrl(
              item.authors?.[0]?.profile_img?.formats?.medium?.url ||
                item.authors?.[0]?.profile_img?.formats?.small?.url ||
                item.authors?.[0]?.profile_img?.url,
            )}
            author={getLangField(item.authors?.[0], "name", locale)}
            position={getLangField(item.authors?.[0], "position", locale)}
            authorSlug={item.authors?.[0]?.slug}
          />
        </div>
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
      <h1 className="newscontent__title">{title}</h1>
      <p className="newscontent__intro">{desc}</p>
      <figure className="newscontent__cover">
        <img
          src={imgUrl}
          alt={
            parseMultilangField(
              item.desc_img?.alternativeText?.trim(),
              locale,
            ) || title
          }
          className="newscontent__img"
        />
        {parseMultilangField(item.desc_img?.caption?.trim(), locale) && (
          <figcaption className="img_source">
            {t("source")}:{" "}
            {(() => {
              const c = parseMultilangField(
                item.desc_img?.caption?.trim(),
                locale,
              );
              const isUrl = /^(https?:\/\/|www\.)/i.test(c);
              return isUrl ? (
                <a
                  href={c.startsWith("http") ? c : `https://${c}`}
                  target="_blank"
                  rel="nofollow noopener"
                >
                  {c.replace(/^https?:\/\//, "")}
                </a>
              ) : (
                c
              );
            })()}
          </figcaption>
        )}
      </figure>
      <hr />
      <div className="newscontent__main">
        {content?.map((block, i) => renderBlock(block, i))}
      </div>
      <Tags item={item} locale={locale} />
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
      `https://api.zhkh24.kz/api/news?filters[slug][$eq]=${slug}` +
        `&populate[OG][populate]=og_image` +
        `&populate[SEO][populate]=*` +
        `&populate[desc_img][populate]=*` +
        `&populate[authors][fields][0]=name_ru` +
        `&populate[authors][fields][1]=name_kk` +
        `&populate[authors][fields][2]=name_en` +
        `&populate[authors][fields][3]=position_ru` +
        `&populate[authors][fields][4]=position_kk` +
        `&populate[authors][fields][5]=position_en` +
        `&populate[authors][fields][6]=slug` +
        `&populate[authors][populate][profile_img][fields][0]=url` +
        `&populate[authors][populate][profile_img][fields][1]=formats` +
        `&populate[header_cats][populate]=*` +
        `&populate[tags][populate]=*` +
        `&populate[cities][populate]=*`,
    )
      .then((res) => res.json())
      .then((data) => setNewsList([data.data?.[0]]));
  }, [slug]);

  const loadNext = useCallback(async () => {
    if (newsList.length === 0) return;

    const last = newsList[newsList.length - 1];

    const res = await fetch(
      `https://api.zhkh24.kz/api/news?sort=publishDate:desc&pagination[pageSize]=1&filters[publishDate][$lt]=${last.publishDate}` +
        `&populate[OG][populate]=og_image` +
        `&populate[SEO][populate]=*` +
        `&populate[desc_img][populate]=*` +
        `&populate[authors][fields][0]=name_ru` +
        `&populate[authors][fields][1]=name_kk` +
        `&populate[authors][fields][2]=name_en` +
        `&populate[authors][fields][3]=position_ru` +
        `&populate[authors][fields][4]=position_kk` +
        `&populate[authors][fields][5]=position_en` +
        `&populate[authors][fields][6]=slug` +
        `&populate[authors][populate][profile_img][fields][0]=url` +
        `&populate[authors][populate][profile_img][fields][1]=formats` +
        `&populate[header_cats][populate]=*` +
        `&populate[tags][populate]=*` +
        `&populate[cities][populate]=*`,
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
        datePublished={mainItem.publishDate}
        dateModified={mainItem.updatedAt}
        authorName={
          mainItem.authors?.[0]
            ? getLangField(mainItem.authors[0], "name", locale)
            : undefined
        }
      />
      <div className="newscontent__layout-main">
        {newsList
          .filter(
            (item, index, arr) =>
              arr.findIndex((i) => i.id === item.id) === index,
          )
          .map((item, index) => (
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
