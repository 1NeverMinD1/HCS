import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const types = ["Новости", "Статьи", "Блоги", "События"];

const routes = {
  Новости: "/news",
  Статьи: "/articles",
  Блоги: "/blogs",
  События: "/events",
};

export default function Filter() {
  const [hoveredType, setHoveredType] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ left: 0, top: 0 });
  const [categories, setCategories] = useState([]);
  const closeTimer = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:1337/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data));
  }, []);

  const handleTypeClick = (item) => {
    if (routes[item]) navigate(routes[item]);
  };

  const handleCategoryClick = (item) => {
    navigate(`/category/${item.documentId}`);
  };

  const isActive = (item) => location.pathname === routes[item];

  const handleMouseEnter = (item, e) => {
    clearTimeout(closeTimer.current);
    setHoveredType(item);
    if (item === "Новости") {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPos({ left: rect.left, top: rect.bottom + 8 });
    }
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setHoveredType(null);
    }, 150);
  };

  const handleDropdownEnter = () => {
    clearTimeout(closeTimer.current);
  };

  const handleDropdownLeave = () => {
    closeTimer.current = setTimeout(() => {
      setHoveredType(null);
    }, 150);
  };

  return (
    <nav className="filter" onMouseLeave={handleMouseLeave}>
      <ul className="filter__list">
        {types.map((item) => (
          <li
            key={item}
            className={`filter__item ${isActive(item) ? "filter__item--active" : ""}`}
            onMouseEnter={(e) => handleMouseEnter(item, e)}
            onClick={() => handleTypeClick(item)}
          >
            {item}
            {isActive(item) && <span className="filter__dot" />}
          </li>
        ))}
      </ul>

      {hoveredType === "Новости" && categories.length > 0 && (
        <ul
          className="filter__dropdown"
          style={{ left: dropdownPos.left, top: dropdownPos.top }}
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleDropdownLeave}
        >
          {categories.map((item) => (
            <li
              key={item.id}
              className="filter__dropdown-item"
              onClick={() => handleCategoryClick(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
