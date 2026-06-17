import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SideMenu from "../sidemenu/SideMenu";
import SEO from "../../../seo/SEO.jsx";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../utils/getLangField.js";

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
          src={block.image.url}
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

export default function BlogsContent() {
  const { locale } = useLocale();
  const { documentId } = useParams();
  const [blogs, setBlogs] = useState(null);
  const title = getLangField(blogs, "title", locale);
  const desc = getLangField(blogs, "desc", locale);
  const content = getLangField(blogs, "content", locale);
  const author = getLangField(blogs, "author", locale);
  const position = getLangField(blogs, "position", locale);

  useEffect(() => {
    fetch(
      `https://hcs-production-423d.up.railway.app/api/blogs/${documentId}?populate=*`,
    )
      .then((res) => res.json())
      .then((data) => setBlogs(data.data));
  }, [documentId]);

  if (!blogs) return <h2>Загрузка...</h2>;

  const date = new Date(blogs.publishDate);

  const imgUrl = blogs.back_img?.formats?.small?.url || blogs.back_img?.url;

  const profImg = blogs?.desc_img?.url || "";

  return (
    <div className="blogscontent__layout">
      <SEO title={title} description={desc} image={imgUrl} type="article" />
      <div className="blogscontent">
        <Link to="/blogs" className="back">
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
        <p className="cat">{blogs.tags?.[0]?.name}</p>
        <h2 className="blogscontent__title">{title}</h2>
        <img src={imgUrl} alt="desc_img" className="blogscontent__img" />
        <hr />
        <div className="blogscontent__main">
          {content?.map((block, i) => renderBlock(block, i))}
        </div>
      </div>
      <div className="blogscontent__layout-sidemenu">
        <SideMenu currentId={documentId} />
      </div>
    </div>
  );
}
