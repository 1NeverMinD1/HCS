export default function FooterContent() {
  return (
    <div className="footer__content">
      <div className="footer__intro">
        <h2>ВЕСТНИК</h2>
        <p>
          Современный новостной портал с актуальными новостями, глубокой
          аналитикой и авторскими материалами.
        </p>
      </div>
      <div className="footer__contacts">
        <div className="footer__contacts-block">
          <h3>РАЗДЕЛЫ</h3>
          <ul className="footer__contacts-list">
            <li className="footer__contacts-item">Новости</li>
            <li className="footer__contacts-item">Статьи</li>
            <li className="footer__contacts-item">Блоги</li>
            <li className="footer__contacts-item">События</li>
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
