import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SideMenu from "../sidemenu/SideMenu";
import SEO from "../../../SEO/SEO.jsx";
import { useLocale } from "../../../../context/LocaleContext.jsx";
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
export default function BlogsContent() {
  const { locale } = useLocale();
  const { slug } = useParams();
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState(null);
  const title = getLangField(blogs, "title", locale);
  const desc = getLangField(blogs, "desc", locale);
  const content = blogs?.[`content_${locale}`] || blogs?.content_ru || [];
  const author = getLangField(blogs?.authors?.[0], "name", locale);
  const position = getLangField(blogs?.authors?.[0], "position", locale);
  const category = getLangField(blogs?.categories?.[0], "name", locale);

  useEffect(() => {
    fetch(
      `https://api.zhkh24.kz/api/blogs?filters[slug][$eq]=${slug}&populate[authors][populate]=profile_img&populate[back_img][populate]=*&populate[OG][populate]=og_image&populate[SEO][populate]=*&populate[tags][populate]=*&populate[categories][populate]=*`,
    )
      .then((res) => res.json())
      .then((data) => setBlogs(data.data?.[0]));
  }, [slug]);

  if (!blogs) return <h2 className="loading wrapper">Загрузка...</h2>;

  const date = new Date(blogs.publishDate);

  const imgUrl = getImageUrl(blogs?.back_img?.url);

  const profileImg = getImageUrl(
    blogs?.authors?.[0]?.profile_img?.formats?.medium?.url ||
      blogs?.authors?.[0]?.profile_img?.formats?.small?.url ||
      blogs?.authors?.[0]?.profile_img?.url,
  );

  return (
    <div className="blogscontent__layout">
      <SEO
        seo={blogs.SEO}
        og={blogs.OG}
        title={getLangField(blogs, "title", locale)}
        description={getLangField(blogs, "desc", locale)}
        image={getImageUrl(
          blogs.OG?.og_image?.formats?.large?.url ||
            blogs.OG?.og_image?.url ||
            blogs.back_img?.formats?.large?.url ||
            blogs.back_img?.formats?.medium?.url ||
            blogs.back_img?.url,
        )}
        type="blog"
        datePublished={blogs.publishDate}
        dateModified={blogs.updatedAt}
        authorName={
          blogs.authors?.[0]
            ? getLangField(blogs.authors[0], "name", locale)
            : undefined
        }
      />
      <div className="blogscontent">
        <Link to={`/${locale}/blogs`} className="back">
          <svg className="arrow_reverse" viewBox="0 0 5 9">
            <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>
          </svg>
          Все блоги
        </Link>
        <AuthorsHeader
          profileImg={profileImg}
          author={author}
          position={position}
          authorSlug={blogs?.authors?.[0]?.slug}
        />
        <div className="blogscontent__header">
          <p className="cat">{category}</p>
          <p className="blogscontent__header-date">
            {date.toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <h2 className="blogscontent__title">{title}</h2>
        <figure className="blogscontent__cover">
          <img
            src={imgUrl}
            alt={
              parseMultilangField(
                blogs.back_img?.alternativeText?.trim(),
                locale,
              ) || title
            }
            className="blogscontent__img"
          />
          {parseMultilangField(blogs.back_img?.caption?.trim(), locale) && (
            <figcaption className="img_source">
              {t("source")}:{" "}
              {(() => {
                const c = parseMultilangField(
                  blogs.back_img?.caption?.trim(),
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
        <div className="blogscontent__main">
          {content?.map((block, i) => renderBlock(block, i))}
        </div>
        <Tags item={blogs} locale={locale} />
      </div>
      <div className="blogscontent__layout-sidemenu">
        <SideMenu currentId={slug} />
      </div>
    </div>
  );
}
