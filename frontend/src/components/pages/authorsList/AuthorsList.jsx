import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../../context/LocaleContext.jsx";
import { getLangField } from "../../../utils/getLangField.js";
import { getImageUrl } from "../../../utils/getImageUrl.js";
import { useTranslation } from "../../../utils/useTranslation.js";
import SEO from "../../SEO/SEO.jsx";
import Breadcrumbs from "../../breadcrumbs/Breadcrumbs.jsx";
import "./_AuthorsList.scss";

const TEXTS = {
  ru: {
    title: "Авторы",
    intro: "Авторы, которые пишут для ЖКХ 24.",
  },
  kk: {
    title: "Авторлар",
    intro: "ЖКХ 24 үшін жазатын авторлар.",
  },
  en: {
    title: "Authors",
    intro: "Authors who write for ZhKH 24.",
  },
};

const AUTHORS_URL =
  `https://api.zhkh24.kz/api/authors?pagination[pageSize]=100&sort=name_ru:asc` +
  `&fields[0]=name_ru&fields[1]=name_kk&fields[2]=name_en` +
  `&fields[3]=position_ru&fields[4]=position_kk&fields[5]=position_en` +
  `&fields[6]=slug&fields[7]=isJournalist` +
  `&populate[profile_img][fields][0]=url` +
  `&populate[profile_img][fields][1]=formats`;

function AuthorCard({ author, locale }) {
  const name = getLangField(author, "name", locale);
  const position = getLangField(author, "position", locale);
  const img = author.profile_img;
  const photo = getImageUrl(
    img?.formats?.small?.url || img?.formats?.thumbnail?.url || img?.url,
  );

  return (
    <Link to={`/${locale}/author/${author.slug}`} className="authorslist__card">
      {photo ? (
        <img
          src={photo}
          alt=""
          className="authorslist__photo"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="authorslist__photo authorslist__photo--empty">
          {(name || "?").charAt(0)}
        </span>
      )}
      <p className="authorslist__name">{name}</p>
      {position && <p className="authorslist__position">{position}</p>}
    </Link>
  );
}

export default function AuthorsList() {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const texts = TEXTS[locale] || TEXTS.ru;

  useEffect(() => {
    let cancelled = false;

    fetch(AUTHORS_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setAuthors((data.data || []).filter((author) => author.slug));
        }
      })
      .catch((err) => console.error("Failed to fetch authors:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <h2 className="loading wrapper">{t("loading")}</h2>;

  const breadcrumbItems = [
    { name: t("home"), url: `/${locale}` },
    { name: texts.title },
  ];

  const renderGrid = (list) => (
    <div className="authorslist__grid">
      {list.map((author) => (
        <AuthorCard key={author.id} author={author} locale={locale} />
      ))}
    </div>
  );

  return (
    <div className="authorslist wrapper">
      <SEO
        title={texts.title}
        description={texts.intro}
        breadcrumbs={breadcrumbItems}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="authorslist__title">{texts.title}</h1>
      <p className="authorslist__intro">{texts.intro}</p>

      {authors.length === 0 && (
        <p className="authorslist__empty">{t("noContent")}</p>
      )}

      {authors.length > 0 && renderGrid(authors)}
    </div>
  );
}
