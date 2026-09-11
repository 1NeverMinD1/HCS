import { useEffect, useState, useRef, useCallback, Fragment } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SideMenu from "../sidemenu/SideMenu";
import SEO from "../../../SEO/SEO.jsx";
import RenderHtml from "../../../renderHtml/RenderHtml.jsx";
import { useLocale } from "../../../../context/LocaleContext";
import {
  getLangField,
  parseMultilangField,
} from "../../../../utils/getLangField.js";
import { getImageUrl } from "../../../../utils/getImageUrl.js";
import { useTranslation } from "../../../../utils/useTranslation.js";
import AuthorsHeader from "../../../authorsHeader/AuthorsHeader.jsx";
import Tags from "../tags/Tags.jsx";
import ReadMore from "../readMore/ReadMore.jsx";
import Breadcrumbs from "../../../breadcrumbs/Breadcrumbs.jsx";
// Styles
import "./_NewsContent.scss";

function renderBlock(block, i, locale, t, scripts = []) {
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

    case "code": {
      const codeword = block.children?.[0]?.text?.trim() || "";
      const matchedScript = scripts.find((s) => s.name?.trim() === codeword);
      const scriptHtml = matchedScript ? matchedScript.script : codeword;
      return <RenderHtml key={i} html={scriptHtml} locale={locale} />;
    }

    case "table": {
      return (
        <table key={i} className="richtext-table">
          <tbody>
            {block.children?.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.children?.map((cell, cIdx) => {
                  const CellTag =
                    cell.type === "table-header-cell" ? "th" : "td";
                  return (
                    <CellTag key={cIdx}>
                      {renderChildren(cell.children)}
                    </CellTag>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    default:
      return null;
  }
}

function findMidpointIndex(content) {
  if (!content || content.length === 0) return -1;
  if (content.length < 4) return -1;

  const weights = content.map((block) => {
    if (block.type === "paragraph" || block.type === "quote") {
      const text = (block.children || []).map((c) => c.text || "").join("");
      return Math.max(text.length, 20);
    }
    if (block.type === "heading") return 10;
    if (block.type === "image") return 150;
    if (block.type === "list") return 100;
    return 20;
  });

  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  let idx = content.length - 1;

  for (let i = 0; i < weights.length; i++) {
    acc += weights[i];
    if (acc >= total / 2) {
      idx = i;
      break;
    }
  }

  while (
    idx < content.length - 1 &&
    (content[idx].type === "heading" || content[idx].type === "list")
  ) {
    idx++;
  }

  if (idx === 0 && content.length > 1) idx = 1;

  if (idx >= content.length - 1) return -1;

  return idx;
}

const NEWS_POPULATE_QUERY =
  `populate[OG][populate][og_image][fields][0]=url` +
  `&populate[OG][populate][og_image][fields][1]=formats` +
  `&populate[SEO][fields][0]=seo_title_ru` +
  `&populate[SEO][fields][1]=seo_desc_ru` +
  `&populate[SEO][fields][2]=seo_title_kk` +
  `&populate[SEO][fields][3]=seo_desc_kk` +
  `&populate[SEO][fields][4]=seo_title_en` +
  `&populate[SEO][fields][5]=seo_desc_en` +
  `&populate[SEO][fields][6]=seo_keywords_ru` +
  `&populate[SEO][fields][7]=seo_keywords_kk` +
  `&populate[SEO][fields][8]=seo_keywords_en` +
  `&populate[SEO][populate][seo_image][fields][0]=url` +
  `&populate[SEO][populate][seo_image][fields][1]=formats` +
  `&populate[desc_img][fields][0]=url` +
  `&populate[desc_img][fields][1]=alternativeText` +
  `&populate[desc_img][fields][2]=caption` +
  `&populate[desc_img][fields][3]=formats` +
  `&populate[authors][fields][0]=name_ru` +
  `&populate[authors][fields][1]=name_kk` +
  `&populate[authors][fields][2]=name_en` +
  `&populate[authors][fields][3]=position_ru` +
  `&populate[authors][fields][4]=position_kk` +
  `&populate[authors][fields][5]=position_en` +
  `&populate[authors][fields][6]=slug` +
  `&populate[authors][populate][profile_img][fields][0]=url` +
  `&populate[authors][populate][profile_img][fields][1]=formats` +
  `&populate[header_cats][fields][0]=name_ru` +
  `&populate[header_cats][fields][1]=name_kk` +
  `&populate[header_cats][fields][2]=name_en` +
  `&populate[tags][fields][0]=name_ru` +
  `&populate[tags][fields][1]=name_kk` +
  `&populate[tags][fields][2]=name_en` +
  `&populate[cities][fields][0]=city_ru` +
  `&populate[cities][fields][1]=city_kk` +
  `&populate[cities][fields][2]=city_en`;

function NewsItem({ item, isFirst, registerRef }) {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const date = new Date(item.publishDate);
  const imgUrl = getImageUrl(item.desc_img?.url);
  const title = getLangField(item, "title", locale);
  const desc = getLangField(item, "desc", locale);
  const content = item?.[`content_${locale}`] || item?.content_ru || [];
  const category = getLangField(item?.header_cats?.[0], "name", locale);
  const scripts = item?.scripts || [];

  const breadcrumbItems = [
    { name: t("home") || "Главная", url: `/${locale}` },
    { name: t("news") || "Новости", url: `/${locale}/news` },
    { name: title },
  ];

  const midpointIndex = findMidpointIndex(content);

  return (
    <div className="newscontent" ref={(el) => registerRef(item.id, el)}>
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
        {item?.header_cats?.[0] && (
          <Link
            to={`/${locale}/news/category/${item.header_cats[0].id}`}
            className="cat"
          >
            {category}
          </Link>
        )}
        <p className="newscontent__header-date">
          {date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
      <Breadcrumbs items={breadcrumbItems} />
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
        {content?.map((block, i) => {
          const rendered = renderBlock(block, i, locale, t, scripts);

          if (i === midpointIndex) {
            return (
              <Fragment key={`block-wrap-${i}`}>
                {rendered}
                <ReadMore item={item} locale={locale} contentType="news" />{" "}
              </Fragment>
            );
          }

          return rendered;
        })}
      </div>
      {midpointIndex === -1 && <ReadMore item={item} locale={locale} />}
      <Tags item={item} locale={locale} />
    </div>
  );
}

export default function NewsContent() {
  const { locale } = useLocale();
  const { slug } = useParams();
  const [newsList, setNewsList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const loaderRef = useRef(null);
  const itemRefs = useRef(new Map());

  useEffect(() => {
    setNewsList([]);
    setHasMore(true);
    setActiveId(null);
    itemRefs.current.clear();

    fetch(
      `https://api.zhkh24.kz/api/news?filters[slug][$eq]=${slug}` +
        `&populate[OG][populate][og_image][fields][0]=url` +
        `&populate[OG][populate][og_image][fields][1]=formats` +
        `&populate[SEO][fields][0]=seo_title_ru` +
        `&populate[SEO][fields][1]=seo_desc_ru` +
        `&populate[SEO][fields][2]=seo_title_kk` +
        `&populate[SEO][fields][3]=seo_desc_kk` +
        `&populate[SEO][fields][4]=seo_title_en` +
        `&populate[SEO][fields][5]=seo_desc_en` +
        `&populate[SEO][fields][6]=seo_keywords_ru` +
        `&populate[SEO][fields][7]=seo_keywords_kk` +
        `&populate[SEO][fields][8]=seo_keywords_en` +
        `&populate[SEO][populate][seo_image][fields][0]=url` +
        `&populate[SEO][populate][seo_image][fields][1]=formats` +
        `&populate[desc_img][fields][0]=url` +
        `&populate[desc_img][fields][1]=alternativeText` +
        `&populate[desc_img][fields][2]=caption` +
        `&populate[desc_img][fields][3]=formats` +
        `&populate[authors][fields][0]=name_ru` +
        `&populate[authors][fields][1]=name_kk` +
        `&populate[authors][fields][2]=name_en` +
        `&populate[authors][fields][3]=position_ru` +
        `&populate[authors][fields][4]=position_kk` +
        `&populate[authors][fields][5]=position_en` +
        `&populate[authors][fields][6]=slug` +
        `&populate[authors][populate][profile_img][fields][0]=url` +
        `&populate[authors][populate][profile_img][fields][1]=formats` +
        `&populate[header_cats][fields][0]=name_ru` +
        `&populate[header_cats][fields][1]=name_kk` +
        `&populate[header_cats][fields][2]=name_en` +
        `&populate[tags][fields][0]=name_ru` +
        `&populate[tags][fields][1]=name_kk` +
        `&populate[tags][fields][2]=name_en` +
        `&populate[cities][fields][0]=city_ru` +
        `&populate[cities][fields][1]=city_kk` +
        `&populate[cities][fields][2]=city_en` +
        `&populate[scripts][fields][0]=name` +
        `&populate[scripts][fields][1]=script`,
    )
      .then((res) => res.json())
      .then((data) => {
        const first = data.data?.[0];
        setNewsList([first]);
        if (first) setActiveId(first.id);
      });
  }, [slug]);

  const loadNext = useCallback(async () => {
    if (newsList.length === 0) return;

    const last = newsList[newsList.length - 1];

    const res = await fetch(
      `https://api.zhkh24.kz/api/news?sort=publishDate:desc&pagination[pageSize]=1&filters[publishDate][$lt]=${last.publishDate}` +
        `&populate[OG][populate][og_image][fields][0]=url` +
        `&populate[OG][populate][og_image][fields][1]=formats` +
        `&populate[SEO][fields][0]=seo_title_ru` +
        `&populate[SEO][fields][1]=seo_desc_ru` +
        `&populate[SEO][fields][2]=seo_title_kk` +
        `&populate[SEO][fields][3]=seo_desc_kk` +
        `&populate[SEO][fields][4]=seo_title_en` +
        `&populate[SEO][fields][5]=seo_desc_en` +
        `&populate[SEO][fields][6]=seo_keywords_ru` +
        `&populate[SEO][fields][7]=seo_keywords_kk` +
        `&populate[SEO][fields][8]=seo_keywords_en` +
        `&populate[SEO][populate][seo_image][fields][0]=url` +
        `&populate[SEO][populate][seo_image][fields][1]=formats` +
        `&populate[desc_img][fields][0]=url` +
        `&populate[desc_img][fields][1]=alternativeText` +
        `&populate[desc_img][fields][2]=caption` +
        `&populate[desc_img][fields][3]=formats` +
        `&populate[authors][fields][0]=name_ru` +
        `&populate[authors][fields][1]=name_kk` +
        `&populate[authors][fields][2]=name_en` +
        `&populate[authors][fields][3]=position_ru` +
        `&populate[authors][fields][4]=position_kk` +
        `&populate[authors][fields][5]=position_en` +
        `&populate[authors][fields][6]=slug` +
        `&populate[authors][populate][profile_img][fields][0]=url` +
        `&populate[authors][populate][profile_img][fields][1]=formats` +
        `&populate[header_cats][fields][0]=name_ru` +
        `&populate[header_cats][fields][1]=name_kk` +
        `&populate[header_cats][fields][2]=name_en` +
        `&populate[tags][fields][0]=name_ru` +
        `&populate[tags][fields][1]=name_kk` +
        `&populate[tags][fields][2]=name_en` +
        `&populate[cities][fields][0]=city_ru` +
        `&populate[cities][fields][1]=city_kk` +
        `&populate[cities][fields][2]=city_en` +
        `&populate[scripts][fields][0]=name` +
        `&populate[scripts][fields][1]=script`,
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
      { threshold: 0.1, rootMargin: "800px" },
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadNext, hasMore]);

  const registerRef = useCallback((id, el) => {
    if (el) {
      itemRefs.current.set(id, el);
    } else {
      itemRefs.current.delete(id);
    }
  }, []);

  useEffect(() => {
    if (newsList.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.newsId;
            setActiveId((prev) =>
              String(prev) === id ? prev : Number(id) || id,
            );
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -70% 0px" },
    );

    newsList.forEach((item) => {
      const el = itemRefs.current.get(item.id);
      if (el) {
        el.dataset.newsId = item.id;
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [newsList]);

  const activeItem =
    newsList.find((item) => item.id === activeId) || newsList[0];

  useEffect(() => {
    if (!activeItem) return;

    const newUrl = `/${locale}/news/${activeItem.slug}`;
    if (window.location.pathname !== newUrl) {
      window.history.replaceState(null, "", newUrl);

      if (window.ym) {
        window.ym(110367191, "hit", newUrl);
      }
      if (window.gtag) {
        window.gtag("event", "page_view", {
          page_path: newUrl,
          page_title: getLangField(activeItem, "title", locale),
        });
      }
    }
  }, [activeItem, locale]);

  if (newsList.length === 0)
    return <h2 className="loading wrapper">Загрузка...</h2>;

  const activeItemBreadcrumbs = activeItem
    ? [
        { name: "Главная", url: `/${locale}` },
        { name: "Новости", url: `/${locale}/news` },
        { name: getLangField(activeItem, "title", locale) },
      ]
    : [];

  return (
    <div className="newscontent__layout">
      <SEO
        seo={activeItem.SEO}
        og={activeItem.OG}
        title={getLangField(activeItem, "title", locale)}
        description={getLangField(activeItem, "desc", locale)}
        image={getImageUrl(
          activeItem.OG?.og_image?.formats?.large?.url ||
            activeItem.OG?.og_image?.url ||
            activeItem.desc_img?.formats?.large?.url ||
            activeItem.desc_img?.formats?.medium?.url ||
            activeItem.desc_img?.url,
        )}
        type="news"
        datePublished={activeItem.publishDate}
        dateModified={activeItem.updatedAt}
        authorName={
          activeItem.authors?.[0]
            ? getLangField(activeItem.authors[0], "name", locale)
            : undefined
        }
        authorSlug={activeItem.authors?.[0]?.slug}
        translationSourceItem={activeItem}
        translationField="title"
        breadcrumbs={activeItemBreadcrumbs}
      />
      <div className="newscontent__layout-main">
        {newsList
          .filter(
            (item, index, arr) =>
              arr.findIndex((i) => i.id === item.id) === index,
          )
          .map((item, index) => (
            <NewsItem
              key={item.id}
              item={item}
              isFirst={index === 0}
              registerRef={registerRef}
            />
          ))}

        {hasMore && <div ref={loaderRef} style={{ height: "60px" }} />}

        {!hasMore && (
          <p style={{ textAlign: "center", padding: "2rem" }}>
            Больше новостей нет
          </p>
        )}
      </div>
      <div className="newscontent__layout-sidemenu">
        <SideMenu currentId={activeItem.slug} />
      </div>
    </div>
  );
}
