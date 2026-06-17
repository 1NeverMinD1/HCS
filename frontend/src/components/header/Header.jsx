import { useEffect, useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext.jsx";
import { getLangField } from "../../utils/getLangField";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { locale, setLocale } = useLocale();
  const dropdownRef = useRef(null);

  const locales = [
    { code: "ru", label: "RU" },
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
                        {getLangField(cat, "name", locale)}
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
