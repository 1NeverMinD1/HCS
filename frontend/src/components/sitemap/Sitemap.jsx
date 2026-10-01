import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext.jsx";
import { getLangField } from "../../utils/getLangField.js";
import { useTranslation } from "../../utils/useTranslation.js";
import SEO from "../SEO/SEO.jsx";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs.jsx";
import "./_Sitemap.scss";

const API_URL = "https://api.zhkh24.kz/api";
const NAME_FIELDS = "fields[0]=name_ru&fields[1]=name_kk&fields[2]=name_en";

const NEWS_CATS_URL = `${API_URL}/header-cats?${NAME_FIELDS}&pagination[pageSize]=100`;
const RUBRICS_URL = `${API_URL}/categories?${NAME_FIELDS}&pagination[pageSize]=100`;
const AUTHORS_URL = `${API_URL}/authors?${NAME_FIELDS}&fields[3]=slug&pagination[pageSize]=100`;

async function fetchList(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

function sortByName(items, locale) {
  return items
    .map((item) => ({ item, name: getLangField(item, "name", locale) }))
    .filter((entry) => entry.name)
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}

function SitemapTree({ nodes, level = 0 }) {
  return (
    <ul className={`sitemap__list sitemap__list--level-${level}`}>
      {nodes.map((node) => (
        <li key={node.key} className="sitemap__item">
          {node.to ? (
            <Link to={node.to} className="sitemap__link">
              {node.label}
            </Link>
          ) : (
            <span className="sitemap__group">{node.label}</span>
          )}
          {node.children?.length > 0 && (
            <SitemapTree nodes={node.children} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Sitemap() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [newsCats, setNewsCats] = useState([]);
  const [rubrics, setRubrics] = useState([]);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const load = (url, setter) =>
      fetchList(url, controller.signal)
        .then(setter)
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Failed to fetch sitemap data:", err);
          }
        });

    load(NEWS_CATS_URL, setNewsCats);
    load(RUBRICS_URL, setRubrics);
    load(AUTHORS_URL, setAuthors);

    return () => controller.abort();
  }, []);

  const base = `/${locale}`;

  const tree = [
    {
      key: "home",
      label: t("home"),
      to: base,
      children: [
        {
          key: "news",
          label: t("news"),
          to: `${base}/news`,
          children: sortByName(newsCats, locale).map(({ item, name }) => ({
            key: `news-cat-${item.id}`,
            label: name,
            to: `${base}/news/category/${item.id}`,
          })),
        },
        { key: "articles", label: t("articles"), to: `${base}/articles` },
        { key: "blogs", label: t("blogs"), to: `${base}/blogs` },
        { key: "events", label: t("events"), to: `${base}/events` },
        { key: "qnas", label: t("qandasIntro"), to: `${base}/q-and-as` },
        {
          key: "rubrics",
          label: t("rubrics"),
          children: sortByName(rubrics, locale).map(({ item, name }) => ({
            key: `rubric-${item.id}`,
            label: name,
            to: `${base}/category/${item.id}`,
          })),
        },
        {
          key: "authors",
          label: t("authorsList"),
          children: sortByName(authors, locale)
            .filter(({ item }) => item.slug)
            .map(({ item, name }) => ({
              key: `author-${item.id}`,
              label: name,
              to: `${base}/author/${item.slug}`,
            })),
        },
        {
          key: "portal",
          label: t("aboutPortal"),
          children: [
            { key: "about", label: t("footerAbout"), to: `${base}/about` },
            {
              key: "advertising",
              label: t("footerAdvertising"),
              to: `${base}/advertising`,
            },
            {
              key: "contacts",
              label: t("footerContacts"),
              to: `${base}/contacts`,
            },
            {
              key: "editorial",
              label: t("footerEditorialPolicy"),
              to: `${base}/editorial-policy`,
            },
            {
              key: "privacy",
              label: t("footerPrivacy"),
              to: `${base}/privacy`,
            },
            { key: "terms", label: t("footerTerms"), to: `${base}/terms` },
            {
              key: "imprint",
              label: t("footerImprint"),
              to: `${base}/imprint`,
            },
          ],
        },
      ],
    },
  ];

  const breadcrumbItems = [
    { name: t("home"), url: base },
    { name: t("sitemap") },
  ];

  return (
    <div className="sitemap wrapper">
      <SEO
        title={t("sitemap")}
        description={t("sitemapDesc")}
        breadcrumbs={breadcrumbItems}
      />

      <h1 className="sitemap__title">{t("sitemap")}</h1>
      <Breadcrumbs items={breadcrumbItems} />

      <nav className="sitemap__tree" aria-label={t("sitemap")}>
        <SitemapTree nodes={tree} />
      </nav>
    </div>
  );
}
