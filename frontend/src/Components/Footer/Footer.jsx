import FooterContent from "./FooterContent/FooterContent.jsx";

export default function Footer() {
  return (
    <footer className="footer">
      <FooterContent />
      <hr />
      <div className="footer__end">
        <p>© 2026 ВЕСТНИК. Все права защищены</p>
        <div className="rules">
          <p>Политика конфиденциальности</p>
          <p>Условия использования</p>
          <p>Реклама</p>
        </div>
      </div>
    </footer>
  );
}
