import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLangField } from "../../../../utils/getLangField";
import { formatLocalizedDate } from "../../../../utils/dateLocale.js";
import { useTranslation } from "../../../../utils/useTranslation.js";
import "./_ReadMore.scss";

const RELATED_FIELDS =
  `fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en` +
  `&fields[3]=slug&fields[4]=publishDate` +
  `&populate[tags][fields][0]=name_ru`;

const SOURCES = [
  { type: "news", endpoint: "news", path: "news" },
  { type: "blog", endpoint: "blogs", path: "blogs" },
  { type: "article", endpoint: "articles", path: "articles" },
];

const PATH_BY_TYPE = Object.fromEntries(
  SOURCES.map(({ type, path }) => [type, path]),
);

export default function ReadMore({ item, locale, contentType = "news" }) {
  const [related, setRelated] = useState([]);
  const { t } = useTranslation();
  const tagKey = (item.tags || [])
    .map((tag) => tag.id)
    .filter(Boolean)
    .join(",");

  useEffect(() => {
    if (!tagKey) {
      setRelated([]);
      return;
    }

    let cancelled = false;
    const ids = tagKey.split(",").map(Number);
    const tagFilter = ids
      .map((id, i) => `&filters[tags][id][$in][${i}]=${id}`)
      .join("");

    async function fetchRelated() {
      const lists = await Promise.all(
        SOURCES.map(({ type, endpoint }) => {
          const exclude =
            type === contentType ? `&filters[id][$ne]=${item.id}` : "";

          return fetch(
            `https://api.zhkh24.kz/api/${endpoint}?sort=publishDate:desc&pagination[pageSize]=10` +
              `${tagFilter}${exclude}&${RELATED_FIELDS}`,
          )
            .then((res) => (res.ok ? res.json() : { data: [] }))
            .then((res) =>
              (res.data || []).map((entry) => ({ ...entry, __type: type })),
            );
        }),
      );

      if (cancelled) return;

      const idSet = new Set(ids);
      const ranked = lists
        .flat()
        .map((entry) => ({
          ...entry,
          __score: (entry.tags || []).filter((tag) => idSet.has(tag.id)).length,
        }))
        .sort(
          (a, b) =>
            b.__score - a.__score ||
            new Date(b.publishDate) - new Date(a.publishDate),
        )
        .slice(0, 3);

      setRelated(ranked);
    }

    fetchRelated().catch(() => {
      if (!cancelled) setRelated([]);
    });

    return () => {
      cancelled = true;
    };
  }, [tagKey, item.id, contentType]);

  if (!tagKey || related.length === 0) return null;

  return (
    <div className="read__more">
      <h2>{t("readAlso")}</h2>
      <div className="read__more-blocks">
        {related.map((entry) => (
          <Link
            to={`/${locale}/${PATH_BY_TYPE[entry.__type]}/${entry.slug}`}
            key={`${entry.__type}-${entry.id}`}
            className="read__more-block"
          >
            <p className="read__more-block-title">
              {getLangField(entry, "title", locale)}
            </p>
            <p className="read__more-block-date">
              {formatLocalizedDate(entry.publishDate, locale)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
