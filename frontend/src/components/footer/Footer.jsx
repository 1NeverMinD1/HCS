import FooterContent from "./FooterContent/FooterContent.jsx";

export default function Footer() {
  return (
    <footer className="footer">
      <FooterContent />
      <hr />
      <div className="footer__end">
        <div className="rights">
          <p>© 2026 ВЕСТНИК. </p>
          <p>Все права защищены</p>
        </div>
        <div className="rules">
          <p>Политика конфиденциальности</p>
          <p>Условия использования</p>
          <p>Реклама</p>
        </div>
      </div>
    </footer>
  );
}
