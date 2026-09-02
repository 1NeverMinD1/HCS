import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLangField } from "../../../../utils/getLangField";
import { formatLocalizedDate } from "../../../../utils/dateLocale.js";
// Styles
import "./_ReadMore.scss";

const RELATED_FIELDS =
  `fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en` +
  `&fields[3]=slug&fields[4]=publishDate`;

export default function ReadMore({ item, locale, contentType = "news" }) {
  const [related, setRelated] = useState([]);
  const tagId = item.tags?.[0]?.id;

  useEffect(() => {
    if (!tagId) {
      setRelated([]);
      return;
    }

    let cancelled = false;

    async function fetchRelated() {
      const excludeNews =
        contentType === "news" ? `&filters[id][$ne]=${item.id}` : "";
      const excludeBlog =
        contentType === "blog" ? `&filters[id][$ne]=${item.id}` : "";
      const excludeArticle =
        contentType === "article" ? `&filters[id][$ne]=${item.id}` : "";

      const [newsRes, blogsRes, articlesRes] = await Promise.all([
        fetch(
          `https://api.zhkh24.kz/api/news?filters[tags][id][$eq]=${tagId}${excludeNews}` +
            `&sort=publishDate:desc&pagination[pageSize]=3&${RELATED_FIELDS}`,
        ).then((res) => res.json()),
        fetch(
          `https://api.zhkh24.kz/api/blogs?filters[tags][id][$eq]=${tagId}${excludeBlog}` +
            `&sort=publishDate:desc&pagination[pageSize]=3&${RELATED_FIELDS}`,
        ).then((res) => res.json()),
        fetch(
          `https://api.zhkh24.kz/api/articles?filters[tags][id][$eq]=${tagId}${excludeArticle}` +
            `&sort=publishDate:desc&pagination[pageSize]=3&${RELATED_FIELDS}`,
        ).then((res) => res.json()),
      ]);

      if (cancelled) return;

      const merged = [
        ...(newsRes.data || []).map((n) => ({ ...n, __type: "news" })),
        ...(blogsRes.data || []).map((b) => ({ ...b, __type: "blog" })),
        ...(articlesRes.data || []).map((a) => ({ ...a, __type: "article" })),
      ]
        .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
        .slice(0, 3);

      setRelated(merged);
    }

    fetchRelated().catch(() => {
      if (!cancelled) setRelated([]);
    });

    return () => {
      cancelled = true;
    };
  }, [tagId, item.id, contentType]);

  if (!tagId || related.length === 0) return null;

  return (
    <div className="read__more">
      <h2>Читайте также:</h2>
      <div className="read__more-blocks">
        {related.map((news) => {
          const title = getLangField(news, "title", locale);
          const link =
            news.__type === "blog"
              ? `/${locale}/blogs/${news.slug}`
              : news.__type === "article"
                ? `/${locale}/articles/${news.slug}`
                : `/${locale}/news/${news.slug}`;

          return (
            <Link
              to={link}
              key={`${news.__type}-${news.id}`}
              className="read__more-block"
            >
              <p className="read__more-block-title">{title}</p>
              <p className="read__more-block-date">
                {formatLocalizedDate(news.publishDate, locale)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
