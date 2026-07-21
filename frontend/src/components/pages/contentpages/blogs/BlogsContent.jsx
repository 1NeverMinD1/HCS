import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SideMenu from "../sidemenu/SideMenu";
import SEO from "../../../SEO/SEO.jsx";
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
export default function BlogsContent() {
  const { locale } = useLocale();
  const { slug } = useParams();
  const [blogs, setBlogs] = useState(null);
  const title = getLangField(blogs, "title", locale);
  const desc = getLangField(blogs, "desc", locale);
  const content = blogs?.[`content_${locale}`] || blogs?.content_ru || [];
  const author = getLangField(blogs, "author", locale);
  const position = getLangField(blogs, "position", locale);
  const category = getLangField(blogs?.categories?.[0], "name", locale);

  useEffect(() => {
    fetch(
      `https://api.zhkh24.kz/api/blogs?filters[slug][$eq]=${slug}&populate=*`,
    )
      .then((res) => res.json())
      .then((data) => setBlogs(data.data?.[0]));
  }, [slug]);

  if (!blogs) return <h2 className="loading wrapper">Загрузка...</h2>;

  const date = new Date(blogs.publishDate);

  const imgUrl = getImageUrl(
    blogs.back_img?.formats?.large?.url ||
      blogs.back_img?.formats?.medium?.url ||
      blogs.back_img?.url,
  );

  const profImg = getImageUrl(blogs?.desc_img?.url || "");

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
        type="article"
      />
      <div className="blogscontent">
        <Link to={`/${locale}/blogs`} className="back">
          <svg className="arrow_reverse" viewBox="0 0 5 9">
            <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>
          </svg>
          Все блоги
        </Link>

        <div className="blogscontent__header">
          <img src={profImg} alt="profile_photo" className="profile" />
          <div className="blogscontent__author">
            <p className="author">{author}</p>
            <p className="spec">{position}</p>
          </div>
        </div>
        <div className="blogscontent__header-date">
          <p>
            {date.toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <p className="cat">{category}</p>
        <h2 className="blogscontent__title">{title}</h2>
        <img src={imgUrl} alt="desc_img" className="blogscontent__img" />
        <hr />
        <div className="blogscontent__main">
          {content?.map((block, i) => renderBlock(block, i))}
        </div>
        <div className="blogscontent__tags">
          {blogs.tags?.map((tag) => (
            <p key={tag.id}>{getLangField(tag, "name", locale)}</p>
          ))}
        </div>
      </div>
      <div className="blogscontent__layout-sidemenu">
        <SideMenu currentId={slug} />
      </div>
    </div>
  );
}
