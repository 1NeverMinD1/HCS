import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLangField } from "../../../../utils/getLangField";

export default function ReadMore({ item, locale }) {
  const [related, setRelated] = useState([]);
  const tagId = item.tags?.[0]?.id;

  useEffect(() => {
    if (!tagId) {
      setRelated([]);
      return;
    }

    let cancelled = false;

    fetch(
      `https://api.zhkh24.kz/api/news?` +
        `filters[tags][id][$eq]=${tagId}` +
        `&filters[id][$ne]=${item.id}` +
        `&sort=publishDate:desc` +
        `&pagination[pageSize]=3` +
        `&fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en` +
        `&fields[3]=slug&fields[4]=publishDate`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setRelated(data.data || []);
      })
      .catch(() => {
        if (!cancelled) setRelated([]);
      });

    return () => {
      cancelled = true;
    };
  }, [tagId, item.id]);

  if (!tagId || related.length === 0) return null;

  return (
    <div className="read__more">
      <h2>Читайте также:</h2>
      <div className="read__more-blocks">
        {related.map((news) => {
          const title = getLangField(news, "title", locale);
          const date = new Date(news.publishDate);
          return (
            <Link
              to={`/${locale}/news/${news.slug}`}
              key={news.id}
              className="read__more-block"
            >
              <h3 className="read__more-block-title">{title}</h3>
              <p className="read__more-block-date">
                {date.toLocaleDateString("ru-RU")}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
