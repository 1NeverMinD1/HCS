import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Filter from "../Filter/Filter";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="header-outer">
      <div
        className={`header-inner ${scrolled ? "header-inner--scrolled" : ""}`}
      >
        <Link to="/" className="logo">
          <div className="logo-mark" aria-hidden="true">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="1"
                width="14"
                height="14"
                rx="3"
                fill="#7f77dd"
                opacity="0.9"
              />
              <rect
                x="17"
                y="1"
                width="14"
                height="14"
                rx="3"
                fill="#5dcaa5"
                opacity="0.6"
              />
              <rect
                x="1"
                y="17"
                width="14"
                height="14"
                rx="3"
                fill="#5dcaa5"
                opacity="0.4"
              />
              <rect
                x="17"
                y="17"
                width="14"
                height="14"
                rx="3"
                fill="#7f77dd"
                opacity="0.5"
              />
            </svg>
          </div>
          <span className="logo-text">
            НА<em>ЗВА</em>НИЕ
          </span>
        </Link>

        <Filter />
      </div>
    </header>
  );
}
