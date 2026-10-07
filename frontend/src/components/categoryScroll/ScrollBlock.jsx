import { Link } from "react-router-dom";
import { getLangField } from "../../utils/getLangField.js";
import { getResponsiveImage } from "../../utils/getResponsiveImage.js";
import { formatLocalizedDate } from "../../utils/dateLocale.js";
import { useTranslation } from "../../utils/useTranslation.js";
import "./_ScrollBlock.scss";

export default function ScrollBlock({
  title,
  items,
  total,
  hasMore,
  loading,
  onLoadMore,
  basePath,
  locale,
  imageField,
}) {
  const { t } = useTranslation();

  if (!items || items.length === 0) return null;

  const count = total ?? items.length;

  return (
    <section className="scroll_block">
      <div className="scroll_block__header">
        <h2 className="scroll_block__title">{title}</h2>
        <span className="scroll_block__count">{count}</span>
      </div>

      <div className="scroll_block__grid">
        {items.map((item) => {
          const itemTitle = getLangField(item, "title", locale);
          const itemDesc = getLangField(item, "desc", locale);
          const image = imageField
            ? getResponsiveImage(item[imageField])
            : { src: "", srcSet: undefined };
          const rawDate = item.publishDate || item.start;
          const date = rawDate ? formatLocalizedDate(rawDate, locale) : null;

          return (
            <Link
              to={`/${locale}/${basePath}/${item.slug}`}
              className={`scroll_block__card${imageField ? "" : " scroll_block__card--text"}`}
              key={item.id}
            >
              {imageField && (
                <div className="scroll_block__card-img">
                  {image.src ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={image.src}
                      srcSet={image.srcSet}
                      sizes="(max-width: 600px) 112px, (max-width: 768px) 50vw, 300px"
                      alt=""
                    />
                  ) : (
                    <div className="scroll_block__card-img-placeholder" />
                  )}
                </div>
              )}

              <div className="scroll_block__card-body">
                <h3 className="scroll_block__card-title">{itemTitle}</h3>
                {itemDesc && (
                  <p className="scroll_block__card-desc">{itemDesc}</p>
                )}
                {date && <p className="scroll_block__card-date">{date}</p>}
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <button
          className="scroll_block__more"
          onClick={onLoadMore}
          disabled={loading}
        >
          {loading
            ? t("loading") || "Загрузка..."
            : t("showMore") || "Показать ещё"}
        </button>
      )}
    </section>
  );
}
