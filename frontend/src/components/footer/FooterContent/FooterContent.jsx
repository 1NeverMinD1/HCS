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
          ЖКХ24
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
          <ul className="footer__contacts-list footer__contacts-list--social">
            <li className="footer__contacts-item">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.14-3.05-2 1.92c-.23.23-.42.42-.82.42z" />
                </svg>
                <span>Telegram</span>
              </a>
            </li>
            <li className="footer__contacts-item">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202C4.734 10.678 4.14 8.078 4.14 7.554c0-.288.102-.55.593-.55h1.744c.44 0 .61.203.78.677.847 2.44 2.27 4.573 2.862 4.573.22 0 .322-.102.322-.66V9.24c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.74c.373 0 .508.203.508.643v3.473c0 .373.17.508.276.508.22 0 .407-.135.813-.542 1.254-1.406 2.15-3.574 2.15-3.574.119-.254.305-.49.746-.49h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.03-2.354 4.03-.186.305-.254.44 0 .78.186.254.796.78 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z" />
                </svg>
                <span>VK</span>
              </a>
            </li>
            <li className="footer__contacts-item">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>YouTube</span>
              </a>
            </li>
            <li className="footer__contacts-item">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
                <span>TikTok</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
