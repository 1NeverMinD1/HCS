import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext.jsx";

import FooterContent from "./FooterContent/FooterContent.jsx";

// FooterLinks

import Imprint from "../footer-links/Imprint.jsx";

export default function Footer() {
  const { locale } = useLocale();

  return (
    <footer className="footer">
      <FooterContent />
      <hr />
      <div className="imprint">
        <p>Сетевое издание «ЖКХ 24» · 16+</p>
        <p>
          Свидетельство о постановке на учёт № KZ90VPY00156907 от 17.08.2026,
          выдано Комитетом информации Министерства культуры и информации РК.
        </p>
      </div>
      <div className="footer__end">
        <div className="rights">
          <p>© 2026 ЖКХ24. </p>
          <p>Все права защищены</p>
        </div>
      </div>
    </footer>
  );
}
