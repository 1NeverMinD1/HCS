import React from "react";
import NewsPageListBlock from "./NewsPageListBlock/NewsPageListBlock";

export default function NewsPageList({ news, loaderRef }) {
  return (
    <div className="newspage__main">
      {news.map((item, index) => {
        const observeIndex =
          news.length >= 3 ? news.length - 3 : news.length - 1;

        if (index === observeIndex && loaderRef) {
          return (
            <div key={item.id} ref={loaderRef}>
              <NewsPageListBlock item={item} />
            </div>
          );
        }

        return <NewsPageListBlock key={item.id} item={item} />;
      })}
    </div>
  );
}
