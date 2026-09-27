import { useRef } from "react";
import { Link } from "react-router-dom";
import { getLangField } from "../../utils/getLangField.js";
import { getResponsiveImage } from "../../utils/getResponsiveImage.js";
import { formatLocalizedDate } from "../../utils/dateLocale.js";
import { useTranslation } from "../../utils/useTranslation.js";
import "./_ScrollBlock.scss";

export default function ScrollBlock({
  title,
  items,
  hasMore,
  loading,
  onLoadMore,
  basePath,
  locale,
  imageField,
}) {
  const scrollRef = useRef(null);
  const { t } = useTranslation();

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 50;

    if (direction === "right" && atEnd && hasMore && !loading) {
      onLoadMore();
    }

    scrollRef.current.scrollBy({
      left: direction === "right" ? 320 : -320,
      behavior: "smooth",
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="scroll_block">
      <h2 className="scroll_block__title">{title}</h2>
      <div className="scroll_block__wrapper">
        <button
          className="scroll_block__arrow scroll_block__arrow-left"
          onClick={() => scroll("left")}
          aria-label={t("scrollLeft")}
        >
          ‹
        </button>

        <div className="scroll_block__list" ref={scrollRef}>
          {items.map((item) => {
            const itemTitle = getLangField(item, "title", locale);
            const itemDesc = getLangField(item, "desc", locale);
            const image = imageField
              ? getResponsiveImage(item[imageField])
              : { src: "", srcSet: undefined };
            const date = item.publishDate
              ? formatLocalizedDate(item.publishDate, locale)
              : null;

            return (
              <Link
                to={`/${locale}/${basePath}/${item.slug}`}
                className="scroll_block__card"
                key={item.id}
              >
                <div className="scroll_block__card-img">
                  {image.src ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={image.src}
                      srcSet={image.srcSet}
                      sizes="(max-width: 768px) 240px, 320px"
                      alt=""
                    />
                  ) : (
                    <div className="scroll_block__card-img-placeholder" />
                  )}
                  <h3 className="scroll_block__card-overlay">{itemTitle}</h3>
                </div>
                {itemDesc && (
                  <p className="scroll_block__card-desc">{itemDesc}</p>
                )}
                {date && <p className="scroll_block__card-date">{date}</p>}
              </Link>
            );
          })}
        </div>

        <button
          className="scroll_block__arrow scroll_block__arrow-right"
          onClick={() => scroll("right")}
          aria-label={t("scrollRight")}
        >
          ›
        </button>
      </div>
    </div>
  );
}
