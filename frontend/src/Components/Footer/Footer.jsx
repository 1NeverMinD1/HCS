export default function Footer() {
  return (
    <footer>
      <span className="logo">
        <a href="#">НАЗВАНИЕ</a>
      </span>
      <ul className="footer__list">
        <li className="footer__item">Privacy Policy</li>
        <li className="footer__item">Terms of Service</li>
        <li className="footer__item">Copyright Policy</li>
        <li className="footer__item">Data Policy</li>
        <li className="footer__item">Accessibility</li>
        <li className="footer__item">Help</li>
      </ul>
      <div className="footer__nav">
        <ul className="footer__nav__list">
          <li className="footer__nav__item">Политика</li>
          <li className="footer__nav__item">Мир</li>
          <li className="footer__nav__item">Экономика</li>
          <li className="footer__nav__item">Науки и Технологии</li>
          <li className="footer__nav__item">Бизнес</li>
        </ul>
        <ul className="footer__nav__list">
          <li className="footer__nav__item">Путишествие</li>
          <li className="footer__nav__item">Климат</li>
          <li className="footer__nav__item">Образ жизни</li>
          <li className="footer__nav__item">Еда</li>
          <li className="footer__nav__item">Спорт</li>
        </ul>
      </div>
      <p>© 2023 Newsletter, All rights reserved</p>
    </footer>
  );
}
