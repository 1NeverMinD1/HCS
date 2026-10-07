import { useParams } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { useTranslation } from "../../../../utils/useTranslation.js";
import SEO from "../../../SEO/SEO.jsx";
import Breadcrumbs from "../../../breadcrumbs/Breadcrumbs.jsx";
import ScrollBlock from "../../../categoryScroll/ScrollBlock.jsx";
import useCategoryContent from "../../../../hooks/useCategoryContent.js";
import { getLangField } from "../../../../utils/getLangField.js";
import useTaxonomyItem from "../../../../hooks/useTaxonomyItem.js";
import NotFoundContent from "../../../notFound/NotFoundContent.jsx";
import "./_TagPage.scss";

export default function TagPage() {
  const { id } = useParams();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const news = useCategoryContent("news", id, "tags", {
    imageField: "desc_img",
    sortField: "publishDate",
  });
  const articles = useCategoryContent("articles", id, "tags", {
    imageField: "desc_img",
    sortField: "publishDate",
  });
  const blogs = useCategoryContent("blogs", id, "tags", {
    imageField: "back_img",
    sortField: "publishDate",
  });
  const events = useCategoryContent("events", id, "tags", {
    imageField: "desc_img",
    sortField: "start",
  });
  const qnas = useCategoryContent("q-and-as", id, "tags", {
    imageField: null,
    sortField: "publishDate",
    hasDesc: false,
  });

  const { item: tag, notFound } = useTaxonomyItem("tags", id);

  if (notFound) return <NotFoundContent />;
  if (!tag) return <h2 className="loading wrapper">{t("loading")}</h2>;

  const pageTagName = getLangField(tag, "name", locale) || t("tag") || "Тег";

  const breadcrumbItems = [
    { name: t("home") || "Главная", url: `/${locale}` },
    { name: pageTagName },
  ];

  const hasAnyContent =
    news.items.length > 0 ||
    articles.items.length > 0 ||
    blogs.items.length > 0 ||
    events.items.length > 0 ||
    qnas.items.length > 0;

  const totalCount =
    (news.total ?? news.items.length) +
    (articles.total ?? articles.items.length) +
    (blogs.total ?? blogs.items.length) +
    (events.total ?? events.items.length) +
    (qnas.total ?? qnas.items.length);

  const descriptionTemplates = {
    ru: (name) =>
      `Новости, статьи и материалы с тегом «${name}» на портале ЖКХ24 — актуальная информация о жилищно-коммунальном хозяйстве Казахстана.`,
    kk: (name) =>
      `«${name}» тегі бойынша жаңалықтар мен материалдар ЖКХ24 порталында.`,
    en: (name) =>
      `News and articles tagged "${name}" on the ZhKH24 housing and utilities portal.`,
  };

  const lang = locale.split("-")[0];
  const pageDescription = (
    descriptionTemplates[lang] || descriptionTemplates.ru
  )(pageTagName);

  return (
    <div className="tagpage wrapper">
      <SEO
        title={pageTagName}
        description={pageDescription}
        breadcrumbs={breadcrumbItems}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="tagpage__header">
        <h1 className="tagpage__title">#{pageTagName}</h1>
        {hasAnyContent && (
          <p className="tagpage__count">
            {t("materialsCount") || "Материалов"}: {totalCount}
          </p>
        )}
      </div>

      {!hasAnyContent && (
        <p className="tagpage__empty">{t("noContent") || "Материалов нет"}</p>
      )}

      <ScrollBlock
        title={t("news") || "Новости"}
        items={news.items}
        total={news.total}
        hasMore={news.hasMore}
        loading={news.loading}
        onLoadMore={news.loadMore}
        basePath="news"
        imageField="desc_img"
        locale={locale}
      />

      <ScrollBlock
        title={t("articles") || "Статьи"}
        items={articles.items}
        total={articles.total}
        hasMore={articles.hasMore}
        loading={articles.loading}
        onLoadMore={articles.loadMore}
        basePath="articles"
        imageField="desc_img"
        locale={locale}
      />

      <ScrollBlock
        title={t("blogs") || "Блоги"}
        items={blogs.items}
        total={blogs.total}
        hasMore={blogs.hasMore}
        loading={blogs.loading}
        onLoadMore={blogs.loadMore}
        basePath="blogs"
        imageField="back_img"
        locale={locale}
      />

      <ScrollBlock
        title={t("events") || "События"}
        items={events.items}
        total={events.total}
        hasMore={events.hasMore}
        loading={events.loading}
        onLoadMore={events.loadMore}
        basePath="events"
        imageField="desc_img"
        locale={locale}
      />

      <ScrollBlock
        title={t("qandasIntro") || "Вопросы и ответы"}
        items={qnas.items}
        total={qnas.total}
        hasMore={qnas.hasMore}
        loading={qnas.loading}
        onLoadMore={qnas.loadMore}
        basePath="q-and-as"
        imageField={null}
        locale={locale}
      />
    </div>
  );
}
