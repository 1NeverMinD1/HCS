import { useState } from "react";
import { useParams } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { useTranslation } from "../../../../utils/useTranslation.js";
import SEO from "../../../SEO/SEO.jsx";
import Breadcrumbs from "../../../breadcrumbs/Breadcrumbs.jsx";
import ScrollBlock from "../../../categoryScroll/ScrollBlock.jsx";
import useCategoryContent from "../../../../hooks/useCategoryContent.js";
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

  const pageCategoryName =
    articles.categoryName ||
    blogs.categoryName ||
    events.categoryName ||
    qnas.categoryName ||
    t("category") ||
    "Категория";

  const breadcrumbItems = [
    { name: t("home") || "Главная", url: `/${locale}` },
    { name: pageCategoryName },
  ];

  const hasAnyContent =
    articles.items.length > 0 ||
    blogs.items.length > 0 ||
    events.items.length > 0 ||
    qnas.items.length > 0;

  return (
    <div className="categorypage wrapper">
      <SEO
        title={pageCategoryName}
        description={pageCategoryName}
        breadcrumbs={breadcrumbItems}
      />

      <h1 className="categorypage__title">{pageCategoryName}</h1>

      <Breadcrumbs items={breadcrumbItems} />

      {!hasAnyContent && (
        <p className="categorypage__empty">
          {t("noContent") || "Материалов нет"}
        </p>
      )}

      <ScrollBlock
        title={t("articles") || "Статьи"}
        items={articles.items}
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
        hasMore={events.hasMore}
        loading={events.loading}
        onLoadMore={events.loadMore}
        basePath="events"
        imageField="desc_img"
        locale={locale}
      />

      <ScrollBlock
        title={t("qanda") || "Вопросы и ответы"}
        items={qnas.items}
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
