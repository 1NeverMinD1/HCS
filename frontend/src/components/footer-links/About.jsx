import { useEffect, useState } from "react";
import SEO from "../SEO/SEO.jsx";
import { useLocale } from "../../context/LocaleContext";
import { parseMultilangField } from "../../utils/getLangField.js";
import { getImageUrl } from "../../utils/getImageUrl.js";
import { useTranslation } from "../../utils/useTranslation.js";

function renderBlock(block, i, locale, t) {
  const renderChildren = (children = []) =>
    children.map((child, j) => {
      let content = child.text || "";

      if (child.bold) content = <strong>{content}</strong>;
      if (child.italic) content = <em>{content}</em>;
      if (child.underline) content = <u>{content}</u>;
      if (child.strikethrough) content = <s>{content}</s>;
      if (child.code) content = <code>{content}</code>;

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

    default:
      return null;
  }
}

const POPULATE_QUERY = `populate[AboutContent][populate]=*`;
// `&populate[SEO][fields][0]=seo_title_ru` +
// `&populate[SEO][fields][1]=seo_desc_ru` +
// `&populate[SEO][fields][2]=seo_keywords_ru` +
// `&populate[SEO][fields][3]=seo_title_kk` +
// `&populate[SEO][fields][4]=seo_desc_kk` +
// `&populate[SEO][fields][5]=seo_keywords_kk` +
// `&populate[SEO][fields][6]=seo_title_en` +
// `&populate[SEO][fields][7]=seo_desc_en` +
// `&populate[SEO][fields][8]=seo_keywords_en` +
// `&populate[SEO][populate][seo_image][fields][0]=url` +
// `&populate[SEO][populate][seo_image][fields][1]=formats` +
// `&populate[OG][fields][0]=og_title_ru` +
// `&populate[OG][fields][1]=og_desc_ru` +
// `&populate[OG][fields][2]=og_title_kk` +
// `&populate[OG][fields][3]=og_desc_kk` +
// `&populate[OG][fields][4]=og_title_en` +
// `&populate[OG][fields][5]=og_desc_en` +
// `&populate[OG][populate][og_image][fields][0]=url` +
// `&populate[OG][populate][og_image][fields][1]=formats`;

export default function About() {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [page, setPage] = useState(null);

  useEffect(() => {
    fetch(`https://api.zhkh24.kz/api/footer-about?${POPULATE_QUERY}`)
      .then((res) => res.json())
      .then((data) => setPage(data.data ?? null));
  }, []);

  if (!page) return <h2 className="loading wrapper">Загрузка...</h2>;

  const content =
    page.AboutContent?.[`content_${locale}`] ||
    page.AboutContent?.content_ru ||
    [];

  return (
    <div className="footer-links wrapper">
      {/* <SEO
        seo={page.SEO}
        og={page.OG}
        title="О редакции"
        image={getImageUrl(page.OG?.og_image?.url || page.SEO?.seo_image?.url)}
      /> */}
      <h1>О редакции</h1>
      <div className="footer-links__content">
        {content.map((block, i) => renderBlock(block, i, locale, t))}
      </div>
    </div>
  );
}
