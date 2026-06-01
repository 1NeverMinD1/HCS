import { useEffect, useState, useRef } from "react";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch("https://hcs-production-423d.up.railway.app/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`header wrapper ${isScrolled ? "header--scrolled" : ""}`}
    >
      <span className="logo">ВЕСТНИК</span>

      <div className="menu">
        <ul className="menu__list">
          <li
            className="menu__list-item menu__list-item--dropdown"
            ref={dropdownRef}
            onClick={() => setIsOpen(!isOpen)}
          >
            Новости
            <svg
              className={`dropdown__arrow ${
                isOpen ? "dropdown__arrow--open" : ""
              }`}
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isOpen && (
              <ul className="dropdown">
                {categories.map((cat) => (
                  <li key={cat.id} className="dropdown__item">
                    {cat.name}
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="menu__list-item">Статьи</li>
          <li className="menu__list-item">Блоги</li>
          <li className="menu__list-item">События</li>
        </ul>
      </div>

      <div className="interaction">
        <div className="interaction__block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            className="search_icon"
          >
            <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z" />
          </svg>

          <button className="subscribe">Подписаться</button>
        </div>
      </div>
    </header>
  );
}
