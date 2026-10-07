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
// Styles
import "./_CategoryPage.scss";

export default function CategoryPage() {
  const { id } = useParams();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const articles = useCategoryContent("articles", id, "categories", {
    imageField: "desc_img",
    sortField: "publishDate",
  });
  const blogs = useCategoryContent("blogs", id, "categories", {
    imageField: "back_img",
    sortField: "publishDate",
  });
  const events = useCategoryContent("events", id, "categories", {
    imageField: "desc_img",
    sortField: "start",
  });
  const qnas = useCategoryContent("q-and-as", id, "categories", {
    imageField: null,
    sortField: "publishDate",
    hasDesc: false,
  });

  const { item: category, notFound } = useTaxonomyItem("categories", id);

  if (notFound) return <NotFoundContent />;
  if (!category) return <h2 className="loading wrapper">{t("loading")}</h2>;

  const pageCategoryName =
    getLangField(category, "name", locale) || t("category") || "Категория";

  const breadcrumbItems = [
    { name: t("home") || "Главная", url: `/${locale}` },
    { name: pageCategoryName },
  ];

  const hasAnyContent =
    articles.items.length > 0 ||
    blogs.items.length > 0 ||
    events.items.length > 0 ||
    qnas.items.length > 0;

  const totalCount =
    (articles.total ?? articles.items.length) +
    (blogs.total ?? blogs.items.length) +
    (events.total ?? events.items.length) +
    (qnas.total ?? qnas.items.length);

  const descriptionTemplates = {
    ru: (name) =>
      `Новости, статьи и материалы по теме «${name}» на портале ЖКХ24 — актуальная информация о жилищно-коммунальном хозяйстве Казахстана.`,
    kk: (name) =>
      `«${name}» тақырыбы бойынша жаңалықтар мен материалдар ЖКХ24 порталында.`,
    en: (name) =>
      `News and articles about "${name}" on the ZhKH24 housing and utilities portal.`,
  };

  const lang = locale.split("-")[0];
  const pageDescription = (
    descriptionTemplates[lang] || descriptionTemplates.ru
  )(pageCategoryName);

  return (
    <div className="categorypage wrapper">
      <SEO
        title={pageCategoryName}
        description={pageDescription}
        breadcrumbs={breadcrumbItems}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="categorypage__header">
        <h1 className="categorypage__title">{pageCategoryName}</h1>
        {hasAnyContent && (
          <p className="categorypage__count">
            {t("materialsCount") || "Материалов"}: {totalCount}
          </p>
        )}
      </div>

      {!hasAnyContent && (
        <p className="categorypage__empty">
          {t("noContent") || "Материалов нет"}
        </p>
      )}

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
