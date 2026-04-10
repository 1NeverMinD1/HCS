import { useState } from "react";

const types = ["Новости", "Статьи", "Продукты", "События"];

const categories = [
  "Политика",
  "Мир",
  "Экономика",
  "Наука и Технологии",
  "Путешествие",
  "Климат",
  "Образ жизни",
  "Еда",
  "Спорт",
  "ЖКХ",
];

export default function Filter() {
  const [activeType, setActiveType] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="filter">
      <ul className="filter__list">
        {types.map((item) => (
          <li
            key={item}
            className={`filter__item ${activeType === item ? "active" : ""}`}
            onClick={() => setActiveType(item)}
          >
            {item}
          </li>
        ))}
      </ul>
      <hr />
      {activeType === "Новости" && (
        <ul className="filter__list">
          {categories.map((item) => (
            <li
              key={item}
              className={`filter__item ${activeCategory === item ? "active" : ""}`}
              onClick={() => setActiveCategory(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
