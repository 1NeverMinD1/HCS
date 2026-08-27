import { useEffect, useState } from "react";
import SEO from "../SEO/SEO.jsx";
import { useLocale } from "../../context/LocaleContext";
import { parseMultilangField } from "../../utils/getLangField.js";
import { getImageUrl } from "../../utils/getImageUrl.js";
import { useTranslation } from "../../utils/useTranslation.js";

const INTERNAL_LINKS = {
  ЖКХ24: "/ru",
  Новости: "/ru/news",
  Статьи: "/ru/articles",
  Блоги: "/ru/blogs",
  События: "/ru/events",
  Советы: "/ru/q-and-as",
  "Q&A": "/ru/q-and-as",
  "О редакции": "/ru/about",
  "Редакционная политика": "/ru/editorial-policy",
  Контакты: "/ru/contacts",
  Реклама: "/ru/advertising",
  "Выходные данные": "/ru/imprint",
  "Политика конфиденциальности": "/ru/privacy",
  "Пользовательское соглашение": "/ru/terms",
};

function renderText(text, locale) {
  if (!text) return text;

  const parts = text.split(/(\[[^\]]+\])/g);

  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]$/);

    if (!match) {
      return <span key={index}>{part}</span>;
    }

    const label = match[1].trim();
    const path = INTERNAL_LINKS[label];

    if (!path) {
      return <span key={index}>{part}</span>;
    }

    const localizedPath = path.replace(/^\/ru/, `/${locale}`);

    return (
      <span key={index}>
        [<a href={localizedPath}>{label}</a>]
      </span>
    );
  });
}

function renderBlock(block, i, locale, t) {
  const renderChildren = (children = []) =>
    children.map((child, j) => {
      if (child.type === "link") {
        return (
          <a key={j} href={child.url} target="_blank" rel="noopener noreferrer">
            {renderChildren(child.children)}
          </a>
        );
      }

      let content = renderText(child.text || "", locale);

      if (child.bold) content = <strong>{content}</strong>;
      if (child.italic) content = <em>{content}</em>;
      if (child.underline) content = <u>{content}</u>;
      if (child.strikethrough) content = <s>{content}</s>;
      if (child.code) content = <code>{content}</code>;

      return <span key={j}>{content}</span>;
    });

  switch (block.type) {
    case "paragraph": {
      const text = block.children?.map((child) => child.text || "").join("");

      const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/g;

      if (emailRegex.test(text)) {
        const parts = text.split(emailRegex);
        const emails = text.match(emailRegex);

        return (
          <p key={i}>
            {parts.map((part, index) => (
              <span key={index}>
                {renderText(part, locale)}
                {emails?.[index] && (
                  <a href={`mailto:${emails[index]}`}>{emails[index]}</a>
                )}
              </span>
            ))}
          </p>
        );
      }

      return <p key={i}>{renderChildren(block.children)}</p>;
    }

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

const POPULATE_QUERY = `populate[ImprintContent][populate]=*`;

export default function Imprint() {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [page, setPage] = useState(null);

  useEffect(() => {
    fetch(`https://api.zhkh24.kz/api/footer-imprint?${POPULATE_QUERY}`)
      .then((res) => res.json())
      .then((data) => setPage(data.data ?? null));
  }, []);

  if (!page) {
    return <h2 className="loading wrapper">Загрузка...</h2>;
  }

  const content =
    page.ImprintContent?.[`content_${locale}`] ||
    page.ImprintContent?.content_ru ||
    [];

  return (
    <div className="footer-links wrapper">
      <h1>Выходные данные</h1>

      <div className="footer-links__content">
        {content.map((block, i) => renderBlock(block, i, locale, t))}
      </div>
    </div>
  );
}
