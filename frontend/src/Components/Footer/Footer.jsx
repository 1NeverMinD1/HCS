import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            НА<em>ЗВА</em>НИЕ
          </Link>
          <p className="footer__copy">© 2025 Newsletter, All rights reserved</p>
        </div>

        <nav className="footer__nav">
          <ul className="footer__nav-list">
            <li>
              <Link to="/news" className="footer__nav-item">
                Новости
              </Link>
            </li>
            <li>
              <Link to="/articles" className="footer__nav-item">
                Статьи
              </Link>
            </li>
            <li>
              <Link to="/blogs" className="footer__nav-item">
                Блоги
              </Link>
            </li>
            <li>
              <Link to="/events" className="footer__nav-item">
                События
              </Link>
            </li>
          </ul>
        </nav>

        <ul className="footer__legal">
          <li className="footer__legal-item">Политика конфиденциальности</li>
          <li className="footer__legal-item">
            Правила использования материала
          </li>
        </ul>
      </div>

      <div className="footer__line" />
    </footer>
  );
}
