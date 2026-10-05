import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SideMenu from "../contentpages/sidemenu/SideMenu";
import NotFoundContent from "../../notFound/NotFoundContent.jsx";
import { useLocale } from "../../../context/LocaleContext.jsx";
import { useTranslation } from "../../../utils/useTranslation.js";
import {
  ArticleItem,
  ARTICLES_POPULATE_QUERY,
} from "../contentpages/articles/ArticlesContent.jsx";
import {
  NewsItem,
  NEWS_POPULATE_QUERY,
} from "../contentpages/news/NewsContent.jsx";
import {
  BlogItem,
  BLOGS_POPULATE_QUERY,
} from "../contentpages/blogs/BlogsContent.jsx";
import {
  EventView,
  EVENTS_POPULATE_QUERY,
} from "../contentpages/events/EventsContent.jsx";
import {
  QnaView,
  QNA_POPULATE_QUERY,
} from "../contentpages/qnas/QnasContent.jsx";

const PREVIEW_CONFIG = {
  article: {
    populate: ARTICLES_POPULATE_QUERY,
    Item: ArticleItem,
    layout: "artscontent__layout",
    main: "artscontent__layout-main",
    side: "artscontent__layout-sidemenu",
  },
  news: {
    populate: NEWS_POPULATE_QUERY,
    Item: NewsItem,
    layout: "newscontent__layout",
    main: "newscontent__layout-main",
    side: "newscontent__layout-sidemenu",
  },
  blog: {
    populate: BLOGS_POPULATE_QUERY,
    Item: BlogItem,
    layout: "blogscontent__layout",
    main: "blogscontent__layout-main",
    side: "blogscontent__layout-sidemenu",
  },
  event: {
    populate: EVENTS_POPULATE_QUERY,
    View: EventView,
  },
  qna: {
    populate: QNA_POPULATE_QUERY,
    View: QnaView,
  },
};

const noop = () => {};

const bannerStyle = {
  position: "sticky",
  top: 0,
  zIndex: 1000,
  background: "#c46a2b",
  color: "#fff",
  textAlign: "center",
  padding: "8px 12px",
  fontSize: "14px",
  fontWeight: 600,
};

export default function PreviewPage() {
  const { type, documentId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const config = PREVIEW_CONFIG[type];

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    if (!config || !token) {
      setError(404);
      return;
    }

    setItem(null);
    setError(null);

    fetch(
      `https://api.zhkh24.kz/api/preview/${type}/${documentId}?token=${encodeURIComponent(token)}&${config.populate}`,
      { cache: "no-store" },
    )
      .then((res) => {
        if (!res.ok) throw res.status;
        return res.json();
      })
      .then((data) => setItem(data.data))
      .catch((status) => setError(typeof status === "number" ? status : 500));
  }, [type, documentId, token]);

  if (!config || error === 404) return <NotFoundContent />;

  if (error) {
    return (
      <h2 className="loading wrapper">
        Ссылка предпросмотра недействительна или устарела. Откройте предпросмотр
        заново из админки.
      </h2>
    );
  }

  if (!item) return <h2 className="loading wrapper">{t("loading")}</h2>;

  const banner = <div style={bannerStyle}>Черновик — предпросмотр</div>;

  if (config.View) {
    const { View } = config;
    return (
      <>
        {banner}
        <View item={item} />
      </>
    );
  }

  const { Item } = config;

  return (
    <>
      {banner}
      <div className={config.layout}>
        <div className={config.main}>
          <Item item={item} locale={locale} t={t} isFirst registerRef={noop} />
        </div>
        <div className={config.side}>
          <SideMenu currentId={item.slug} />
        </div>
      </div>
    </>
  );
}
