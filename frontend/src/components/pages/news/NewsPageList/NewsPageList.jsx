import React from "react";
import NewsPageListBlock from "./NewsPageListBlock/NewsPageListBlock";

export default function NewsPageList({ news }) {
  return (
    <div className="newspage__main">
      {news.map((item) => (
        <NewsPageListBlock key={item.id} item={item} />
      ))}
    </div>
  );
}
