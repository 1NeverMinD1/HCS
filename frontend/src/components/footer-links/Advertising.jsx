import { useEffect, useState } from "react";
import SEO from "../SEO/SEO.jsx";
import { useLocale } from "../../context/LocaleContext";
import { parseMultilangField } from "../../utils/getLangField.js";
import { getImageUrl } from "../../utils/getImageUrl.js";
import { useTranslation } from "../../utils/useTranslation.js";
// Styles
import "./_FooterLinksStyles.scss";

const INTERNAL_LINKS = {
  ru: {
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
  },
  kk: {
    ЖКХ24: "/kk",
    Жаңалықтар: "/kk/news",
    Мақалалар: "/kk/articles",
    Блогтар: "/kk/blogs",
    Оқиғалар: "/kk/events",
    Кеңестер: "/kk/q-and-as",
    "Q&A": "/kk/q-and-as",
    "Редакция туралы": "/kk/about",
    "Редакциялық саясат": "/kk/editorial-policy",
    Байланыстар: "/kk/contacts",
    Жарнама: "/kk/advertising",
    "Шығыс деректері": "/kk/imprint",
    "Құпиялылық саясаты": "/kk/privacy",
    "Пайдаланушы келісімі": "/kk/terms",
  },
  en: {
    ЖКХ24: "/en",
    News: "/en/news",
    Articles: "/en/articles",
    Blogs: "/en/blogs",
    Events: "/en/events",
    Tips: "/en/q-and-as",
    "Q&A": "/en/q-and-as",
    About: "/en/about",
    "Editorial Policy": "/en/editorial-policy",
    Contacts: "/en/contacts",
    Advertising: "/en/advertising",
    Imprint: "/en/imprint",
    "Privacy Policy": "/en/privacy",
    "Terms of Use": "/en/terms",
  },
};

function renderText(text, locale, keyPrefix) {
  if (!text) return null;

  const links = INTERNAL_LINKS[locale] || INTERNAL_LINKS.ru;

  const regex =
    /\[([^\]]+)\]\(([^)]+)\)|\[([^\]]+)\]|([^\s@]+@[^\s@]+\.[^\s@]+)/g;

  const result = [];
  let lastIndex = 0;
  let match;
  let index = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(
        <span key={`${keyPrefix}-text-${index}`}>
          {text.slice(lastIndex, match.index)}
        </span>,
      );
    }

    const textValue = match[1];
    const url = match[2];
    const bracket = match[3];
    const email = match[4];

    // [Текст](URL)
    if (textValue && url) {
      const internalUrl = links[textValue.trim()];

      if (internalUrl) {
        result.push(
          <span key={`${keyPrefix}-internal-link-${index}`}>
            [<a href={internalUrl}>{textValue}</a>]
          </span>,
        );
      } else if (url.startsWith("mailto:")) {
        result.push(
          <span key={`${keyPrefix}-mail-link-${index}`}>
            [<a href={url}>{textValue}</a>]
          </span>,
        );
      } else if (url.startsWith("data:")) {
        result.push(
          <span key={`${keyPrefix}-data-${index}`}>{textValue}</span>,
        );
      } else {
        result.push(
          <span key={`${keyPrefix}-external-link-${index}`}>
            [
            <a href={url} target="_blank" rel="noopener noreferrer">
              {textValue}
            </a>
            ]
          </span>,
        );
      }

      // [Текст]
    } else if (bracket) {
      const internalUrl = links[bracket.trim()];

      if (internalUrl) {
        result.push(
          <span key={`${keyPrefix}-bracket-link-${index}`}>
            [<a href={internalUrl}>{bracket}</a>]
          </span>,
        );
      } else {
        result.push(
          <span key={`${keyPrefix}-bracket-${index}`}>{match[0]}</span>,
        );
      }

      // email
    } else if (email) {
      result.push(
        <a key={`${keyPrefix}-email-${index}`} href={`mailto:${email}`}>
          {email}
        </a>,
      );
    }

    lastIndex = regex.lastIndex;
    index++;
  }

  if (lastIndex < text.length) {
    result.push(<span key={`${keyPrefix}-tail`}>{text.slice(lastIndex)}</span>);
  }

  return result;
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

      let content = renderText(child.text || "", locale, `${i}-${j}`);

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
      const rawCaption = block.image?.caption?.trim();
      const caption = parseMultilangField(rawCaption, locale);
      const isUrl = caption && /^(https?:\/\/|www\.)/i.test(caption);

      const rawAlt = block.image?.alternativeText?.trim();
      const alt = parseMultilangField(rawAlt, locale);

      return (
        <figure key={i} className="richtext-image">
          <img src={getImageUrl(block.image?.url)} alt={alt || ""} />

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

const POPULATE_QUERY = `populate[AdvertisingContent][populate]=*`;

export default function Advertising() {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [page, setPage] = useState(null);

  useEffect(() => {
    fetch(`https://api.zhkh24.kz/api/advertising?${POPULATE_QUERY}`)
      .then((res) => res.json())
      .then((data) => setPage(data.data ?? null));
  }, []);

  if (!page) {
    return <h2 className="loading wrapper">Загрузка...</h2>;
  }

  const content =
    page.AdvertisingContent?.[`content_${locale}`] ||
    page.AdvertisingContent?.content_ru ||
    [];

  return (
    <div className="footer-links wrapper">
      <SEO
        seo={page.AdvertisingContent?.SEO}
        og={page.AdvertisingContent?.OG}
        title="Реклама"
        image={getImageUrl(
          page.AdvertisingContent?.OG?.og_image?.url ||
            page.AdvertisingContent?.SEO?.seo_image?.url,
        )}
      />
      <h1>Реклама</h1>

      <div className="footer-links__content">
        {content.map((block, i) => renderBlock(block, i, locale, t))}
      </div>
    </div>
  );
}
