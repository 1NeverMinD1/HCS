import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";
import { parseMultilangField } from "../../utils/getLangField.js";
import { getImageUrl } from "../../utils/getImageUrl.js";
import { useTranslation } from "../../utils/useTranslation.js";

const INTERNAL_LINKS = {
  Контакты: "/contacts",
  "Все контакты": "/contacts",
  "О редакции": "/about",
  Реклама: "/advertising",
  "Редакционная политика": "/editorial-policy",
  "Политика конфиденциальности": "/privacy",
  "Пользовательское соглашение": "/terms",
  "Условия использования": "/terms",
  "Выходные данные": "/imprint",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function renderText(text, locale) {
  if (!text) return null;

  const result = [];
  let lastIndex = 0;

  const regex = /(\[[^\]]+\]\([^)]+\)|\[[^\]]+\]|[^\s@]+@[^\s@]+\.[^\s@]+)/g;

  const matches = [...text.matchAll(regex)];

  matches.forEach((match, index) => {
    const value = match[0];
    const start = match.index;

    if (start > lastIndex) {
      result.push(text.slice(lastIndex, start));
    }

    if (value.startsWith("[") && value.includes("](")) {
      const linkMatch = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

      if (linkMatch) {
        const label = linkMatch[1];
        const url = linkMatch[2];

        if (EMAIL_REGEX.test(label) && url.startsWith("mailto:")) {
          result.push(
            <a key={`email-${index}`} href={`mailto:${label}`}>
              {label}
            </a>,
          );
        } else {
          result.push(
            <a
              key={`link-${index}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
            </a>,
          );
        }
      }
    } else if (value.startsWith("[") && value.endsWith("]")) {
      const label = value.slice(1, -1).trim();
      const path = INTERNAL_LINKS[label];

      if (path) {
        result.push(
          <span key={`internal-${index}`}>
            [<Link to={`/${locale}${path}`}>{label}</Link>]
          </span>,
        );
      } else {
        result.push(value);
      }
    } else if (EMAIL_REGEX.test(value)) {
      result.push(
        <a key={`email-${index}`} href={`mailto:${value}`}>
          {value}
        </a>,
      );
    } else {
      result.push(value);
    }

    lastIndex = start + value.length;
  });

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result.length ? result : text;
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
                  rel="nofollow noopener noreferrer"
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

const POPULATE_QUERY = `populate[EditorialPolicyContent][populate]=*`;

export default function EditorialPolicy() {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [page, setPage] = useState(null);

  useEffect(() => {
    fetch(`https://api.zhkh24.kz/api/footer-editorial-policy?${POPULATE_QUERY}`)
      .then((res) => res.json())
      .then((data) => setPage(data.data ?? null));
  }, []);

  if (!page) {
    return <h2 className="loading wrapper">Загрузка...</h2>;
  }

  const content =
    page.EditorialPolicyContent?.[`content_${locale}`] ||
    page.EditorialPolicyContent?.content_ru ||
    [];

  return (
    <div className="footer-links wrapper">
      <h1>Редакционная политика</h1>

      <div className="footer-links__content">
        {content.map((block, i) => renderBlock(block, i, locale, t))}
      </div>
    </div>
  );
}
