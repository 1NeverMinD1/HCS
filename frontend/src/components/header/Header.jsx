import { useEffect, useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext.jsx";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { locale, setLocale } = useLocale();
  const dropdownRef = useRef(null);

  const locales = [
    { code: "ru-RU", label: "RU" },
    { code: "kk", label: "KK" },
    { code: "en", label: "EN" },
  ];

  useEffect(() => {
    fetch("https://hcs-production-423d.up.railway.app/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <header
      className={`header wrapper ${isScrolled ? "header--scrolled" : ""}`}
      id="header"
    >
      <Link to="/" className="logo">
        ВЕСТНИК
      </Link>

      <div className="menu">
        <ul className="menu__list">
          <li
            className="menu__list-item menu__list-item--dropdown"
            ref={dropdownRef}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <NavLink
              to={`/${locale}/news`}
              className={({ isActive }) =>
                isActive ? "menu__link active" : "menu__link"
              }
            >
              Новости
            </NavLink>

            <svg
              className={`dropdown__arrow ${isOpen ? "dropdown__arrow--open" : ""}`}
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
              <div className="dropdown">
                <ul className="dropdown__content">
                  {categories.map((cat) => (
                    <li key={cat.id} className="dropdown__item">
                      <NavLink
                        to={`/${locale}/news/category/${cat.id}`}
                        className="dropdown__link"
                      >
                        {cat.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>

          <li className="menu__list-item">
            <NavLink
              to={`/${locale}/articles`}
              className={({ isActive }) =>
                isActive ? "menu__link active" : "menu__link"
              }
            >
              Статьи
            </NavLink>
          </li>

          <li className="menu__list-item">
            <NavLink
              to={`/${locale}/blogs`}
              className={({ isActive }) =>
                isActive ? "menu__link active" : "menu__link"
              }
            >
              Блоги
            </NavLink>
          </li>

          <li className="menu__list-item">
            <NavLink
              to={`/${locale}/events`}
              className={({ isActive }) =>
                isActive ? "menu__link active" : "menu__link"
              }
            >
              События
            </NavLink>
          </li>

          <li className="menu__list-item">
            <NavLink
              to={`/${locale}/q-and-as`}
              className={({ isActive }) =>
                isActive ? "menu__link active" : "menu__link"
              }
            >
              Советы
            </NavLink>
          </li>
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

          <div className="locale-switcher">
            {locales.map((l) => (
              <button
                key={l.code}
                className={`locale-btn ${locale === l.code ? "locale-btn--active" : ""}`}
                onClick={() => setLocale(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>

          <button
            className="subscribe"
            onClick={() =>
              document
                .getElementById("subscribe")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Подписаться
          </button>
        </div>
      </div>
    </header>
  );
}
