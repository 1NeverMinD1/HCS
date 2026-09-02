import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getLangField } from "../../utils/getLangField.js";
import { getImageUrl } from "../../utils/getImageUrl.js";
// Styles
import "./_ScrollBlock.scss";

const PAGE_SIZE = 3;

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
          aria-label="Прокрутить влево"
        >
          ‹
        </button>

        <div className="scroll_block__list" ref={scrollRef}>
          {items.map((item) => {
            const itemTitle = getLangField(item, "title", locale);
            const itemDesc = getLangField(item, "desc", locale);
            const imgUrl = imageField
              ? getImageUrl(item[imageField]?.url)
              : null;
            const date = item.publishDate
              ? new Date(item.publishDate).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : null;

            return (
              <Link
                to={`/${locale}/${basePath}/${item.slug}`}
                className="scroll_block__card"
                key={item.id}
              >
                <div className="scroll_block__card-img">
                  {imgUrl ? (
                    <img src={imgUrl} alt={itemTitle} />
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
          aria-label="Прокрутить вправо"
        >
          ›
        </button>
      </div>
    </div>
  );
}
