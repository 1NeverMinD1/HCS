import { useEffect, useState, useRef, useCallback, Fragment } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SideMenu from "../sidemenu/SideMenu";
import SEO from "../../../SEO/SEO.jsx";
import RenderHtml from "../../../renderHtml/RenderHtml.jsx";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import {
  getLangField,
  parseMultilangField,
} from "../../../../utils/getLangField.js";
import { getImageUrl } from "../../../../utils/getImageUrl.js";
import { useTranslation } from "../../../../utils/useTranslation.js";
import AuthorsHeader from "../../../authorsHeader/AuthorsHeader.jsx";
import Tags from "../tags/Tags.jsx";
import ReadMore from "../readMore/ReadMore.jsx";

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

function ArticleItem({ item, isFirst, registerRef }) {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const date = new Date(item.publishDate);
  const imgUrl = getImageUrl(item.desc_img?.url);
  const title = getLangField(item, "title", locale);
  const desc = getLangField(item, "desc", locale);
  const content = item?.[`content_${locale}`] || item?.content_ru || [];
  const category = getLangField(item?.categories?.[0], "name", locale);

  const midpointIndex = findMidpointIndex(content);

  const coverCaption = parseMultilangField(
    item.desc_img?.caption?.trim(),
    locale,
  );
  const coverCaptionIsUrl =
    coverCaption && /^(https?:\/\/|www\.)/i.test(coverCaption);
  const coverAlt = parseMultilangField(
    item.desc_img?.alternativeText?.trim(),
    locale,
  );

  return (
    <div className="artscontent" ref={(el) => registerRef(item.id, el)}>
      {isFirst && (
        <Link to={`/${locale}/articles`} className="back">
          <svg className="arrow_reverse" viewBox="0 0 5 9">
            <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>
          </svg>
          Все статьи
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
      <h1 className="artscontent__title">{title}</h1>
      <figure className="artscontent__cover">
        <img
          src={imgUrl}
          alt={coverAlt || title}
          className="artscontent__img"
        />
        {coverCaption && (
          <figcaption className="img_source">
            {t("source")}:{" "}
            {coverCaptionIsUrl ? (
              <a
                href={
                  coverCaption.startsWith("http")
                    ? coverCaption
                    : `https://${coverCaption}`
                }
                target="_blank"
                rel="nofollow noopener"
              >
                {coverCaption.replace(/^https?:\/\//, "")}
              </a>
            ) : (
              coverCaption
            )}
          </figcaption>
        )}
      </figure>
      <p className="artscontent__desc">{desc}</p>
      <hr />
      <div className="artscontent__main">
        {content?.map((block, i) => {
          const rendered = renderBlock(block, i, locale, t);

          if (i === midpointIndex) {
            return (
              <Fragment key={`block-wrap-${i}`}>
                {rendered}
                <ReadMore item={item} locale={locale} contentType="article" />
              </Fragment>
            );
          }

          return rendered;
        })}
        {midpointIndex === -1 && (
          <ReadMore item={item} locale={locale} contentType="article" />
        )}
      </div>
      <Tags item={item} locale={locale} />
    </div>
  );
}

export default function ArticlesContent() {
  const { locale } = useLocale();
  const { slug } = useParams();
  const [articlesList, setArticlesList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const loaderRef = useRef(null);
  const itemRefs = useRef(new Map());

  const ARTICLES_POPULATE_QUERY =
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
    `&populate[categories][fields][0]=name_ru` +
    `&populate[categories][fields][1]=name_kk` +
    `&populate[categories][fields][2]=name_en` +
    `&populate[tags][fields][0]=name_ru` +
    `&populate[tags][fields][1]=name_kk` +
    `&populate[tags][fields][2]=name_en`;

  useEffect(() => {
    setArticlesList([]);
    setHasMore(true);
    setActiveId(null);
    itemRefs.current.clear();

    fetch(
      `https://api.zhkh24.kz/api/articles?filters[slug][$eq]=${slug}&${ARTICLES_POPULATE_QUERY}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const first = data.data?.[0];
        setArticlesList([first]);
        if (first) setActiveId(first.id);
      });
  }, [slug]);

  const loadNext = useCallback(async () => {
    if (articlesList.length === 0) return;

    const last = articlesList[articlesList.length - 1];

    const res = await fetch(
      `https://api.zhkh24.kz/api/articles?sort=publishDate:desc&pagination[pageSize]=1&filters[publishDate][$lt]=${last.publishDate}&${ARTICLES_POPULATE_QUERY}`,
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
    if (articlesList.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.articleId;
            setActiveId((prev) =>
              String(prev) === id ? prev : Number(id) || id,
            );
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -70% 0px" },
    );

    articlesList.forEach((item) => {
      const el = itemRefs.current.get(item.id);
      if (el) {
        el.dataset.articleId = item.id;
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [articlesList]);

  const activeItem =
    articlesList.find((item) => item.id === activeId) || articlesList[0];

  useEffect(() => {
    if (!activeItem) return;

    const newUrl = `/${locale}/articles/${activeItem.slug}`;
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

  if (articlesList.length === 0)
    return <h2 className="loading wrapper">Загрузка...</h2>;

  return (
    <div className="artscontent__layout">
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
        type="article"
        datePublished={activeItem.publishDate}
        dateModified={activeItem.updatedAt}
        authorName={
          activeItem.authors?.[0]
            ? getLangField(activeItem.authors[0], "name", locale)
            : undefined
        }
        translationSourceItem={activeItem}
        translationField="title"
      />
      <div className="artscontent__layout-main">
        {articlesList
          .filter(
            (item, index, arr) =>
              arr.findIndex((i) => i.id === item.id) === index,
          )
          .map((item, index) => (
            <ArticleItem
              key={item.id}
              item={item}
              isFirst={index === 0}
              registerRef={registerRef}
            />
          ))}

        {hasMore && <div ref={loaderRef} style={{ height: "60px" }} />}

        {!hasMore && (
          <p style={{ textAlign: "center", padding: "2rem" }}>
            Больше статей нет
          </p>
        )}
      </div>
      <div className="artscontent__layout-sidemenu">
        <SideMenu currentId={activeItem.slug} />
      </div>
    </div>
  );
}
