import { useEffect, useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext.jsx";
import { getLangField } from "../../utils/getLangField";
import { useTranslation } from "../../utils/useTranslation.js";
import logo from "../../assets/logo.svg";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // десктопный дропдаун новостей
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCatsOpen, setIsMobileCatsOpen] = useState(false);
  const { t } = useTranslation();

  const { locale, setLocale } = useLocale();
  const dropdownRef = useRef(null);

  const locales = [
    { code: "kk", label: "KK" },
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
  ];

  useEffect(() => {
    fetch("https://api.zhkh24.kz/api/header-cats")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleKey = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Блокируем скролл body, когда открыто мобильное меню
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileCatsOpen(false);
  };

  return (
    <header
      className={`header wrapper ${isScrolled ? "header--scrolled" : ""} ${isMobileMenuOpen ? "header--menu-open" : ""}`}
      id="header"
    >
      <Link to={`/${locale}`} className="logo" onClick={closeMobileMenu}>
        <img src={logo} alt="ЖКХ24" className="logo_img" />
      </Link>

      {/* Десктопное меню */}
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
              {t("news")}
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
              {t("articles")}
            </NavLink>
          </li>

          <li className="menu__list-item">
            <NavLink
              to={`/${locale}/blogs`}
              className={({ isActive }) =>
                isActive ? "menu__link active" : "menu__link"
              }
            >
              {t("blogs")}
            </NavLink>
          </li>

          <li className="menu__list-item">
            <NavLink
              to={`/${locale}/events`}
              className={({ isActive }) =>
                isActive ? "menu__link active" : "menu__link"
              }
            >
              {t("events")}
            </NavLink>
          </li>

          <li className="menu__list-item">
            <NavLink
              to={`/${locale}/q-and-as`}
              className={({ isActive }) =>
                isActive ? "menu__link active" : "menu__link"
              }
            >
              {t("qandas")}
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
            {t("subscribe")}
          </button>
        </div>

        {/* Кнопка-бургер (видна только на мобилке) */}
        <button
          className={`burger ${isMobileMenuOpen ? "burger--active" : ""}`}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isMobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div
        className={`mobile-menu ${isMobileMenuOpen ? "mobile-menu--open" : ""}`}
      >
        <ul className="mobile-menu__list">
          <li className="mobile-menu__item mobile-menu__item--dropdown">
            <div className="mobile-menu__row">
              <NavLink
                to={`/${locale}/news`}
                className={({ isActive }) =>
                  isActive ? "mobile-menu__link active" : "mobile-menu__link"
                }
                onClick={closeMobileMenu}
              >
                {t("news")}
              </NavLink>
              <button
                className={`mobile-menu__caret ${isMobileCatsOpen ? "mobile-menu__caret--open" : ""}`}
                onClick={() => setIsMobileCatsOpen((prev) => !prev)}
                aria-label="Показать категории"
              >
                <svg
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
              </button>
            </div>

            {isMobileCatsOpen && (
              <ul className="mobile-menu__submenu">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <NavLink
                      to={`/${locale}/news/category/${cat.id}`}
                      className="mobile-menu__sublink"
                      onClick={closeMobileMenu}
                    >
                      {getLangField(cat, "name", locale)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="mobile-menu__item">
            <NavLink
              to={`/${locale}/articles`}
              className={({ isActive }) =>
                isActive ? "mobile-menu__link active" : "mobile-menu__link"
              }
              onClick={closeMobileMenu}
            >
              {t("articles")}
            </NavLink>
          </li>

          <li className="mobile-menu__item">
            <NavLink
              to={`/${locale}/blogs`}
              className={({ isActive }) =>
                isActive ? "mobile-menu__link active" : "mobile-menu__link"
              }
              onClick={closeMobileMenu}
            >
              {t("blogs")}
            </NavLink>
          </li>

          <li className="mobile-menu__item">
            <NavLink
              to={`/${locale}/events`}
              className={({ isActive }) =>
                isActive ? "mobile-menu__link active" : "mobile-menu__link"
              }
              onClick={closeMobileMenu}
            >
              {t("events")}
            </NavLink>
          </li>

          <li className="mobile-menu__item">
            <NavLink
              to={`/${locale}/q-and-as`}
              className={({ isActive }) =>
                isActive ? "mobile-menu__link active" : "mobile-menu__link"
              }
              onClick={closeMobileMenu}
            >
              {t("qandas")}
            </NavLink>
          </li>
        </ul>

        <div className="mobile-menu__footer">
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
            onClick={() => {
              closeMobileMenu();
              document
                .getElementById("subscribe")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {t("subscribe")}
          </button>
        </div>
      </div>
    </header>
  );
}
