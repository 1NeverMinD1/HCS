import { useParams } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { useTranslation } from "../../../../utils/useTranslation.js";
import SEO from "../../../SEO/SEO.jsx";
import Breadcrumbs from "../../../breadcrumbs/Breadcrumbs.jsx";
import ScrollBlock from "../../../categoryScroll/ScrollBlock.jsx";
import useCategoryContent from "../../../../hooks/useCategoryContent.js";

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

  const pageTagName =
    news.categoryName ||
    articles.categoryName ||
    blogs.categoryName ||
    events.categoryName ||
    qnas.categoryName ||
    t("tag") ||
    "Тег";

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

  return (
    <div className="tagpage wrapper">
      <SEO
        title={pageTagName}
        description={pageTagName}
        breadcrumbs={breadcrumbItems}
      />

      <h1 className="tagpage__title">#{pageTagName}</h1>

      <Breadcrumbs items={breadcrumbItems} />

      {!hasAnyContent && (
        <p className="tagpage__empty">{t("noContent") || "Материалов нет"}</p>
      )}

      <ScrollBlock
        title={t("news") || "Новости"}
        items={news.items}
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
