import { Link } from "react-router-dom";
import { useLocale } from "../../../context/LocaleContext.jsx";

export default function FooterContent() {
  const { locale } = useLocale();

  return (
    <div className="footer__content">
      <div className="footer__intro">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="logo"
        >
          ВЕСТНИК
        </button>

        <p>
          Современный новостной портал с актуальными новостями, глубокой
          аналитикой и авторскими материалами.
        </p>
      </div>
      <div className="footer__contacts">
        <div className="footer__contacts-block">
          <h3>РАЗДЕЛЫ</h3>
          <ul className="footer__contacts-list">
            <Link to={`/${locale}/news`} className="footer__contacts-item">
              <li className="footer__contacts-item">Новости</li>
            </Link>
            <Link to={`/${locale}/articles`} className="footer__contacts-item">
              <li className="footer__contacts-item">Статьи</li>
            </Link>
            <Link to={`/${locale}/blogs`} className="footer__contacts-item">
              <li className="footer__contacts-item">Блоги</li>
            </Link>
            <Link to={`/${locale}/events`} className="footer__contacts-item">
              <li className="footer__contacts-item">События</li>
            </Link>
          </ul>
        </div>
        <div className="footer__contacts-block">
          <h3>КОМПАНИЯ</h3>
          <ul className="footer__contacts-list">
            <li className="footer__contacts-item">О нас</li>
            <li className="footer__contacts-item">Редакция</li>
            <li className="footer__contacts-item">Карьера</li>
            <li className="footer__contacts-item">Контакты</li>
          </ul>
        </div>
        <div className="footer__contacts-block">
          <h3>СОЦСЕТИ</h3>
          <ul className="footer__contacts-list">
            <li className="footer__contacts-item">Telegram</li>
            <li className="footer__contacts-item">VK</li>
            <li className="footer__contacts-item">YouTube</li>
            <li className="footer__contacts-item">TikTok</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
