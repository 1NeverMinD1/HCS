import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext.jsx";
import { translations } from "../../utils/translations.js";

import FooterContent from "./FooterContent/FooterContent.jsx";

export default function Footer() {
  const { locale } = useLocale();
  const t = translations[locale];

  return (
    <footer className="footer">
      <FooterContent />
      <hr />
      <div className="imprint">
        <p>{t.footerNetworkPublication}</p>
        <p>{t.footerCertificate}</p>
      </div>
      <div className="footer__end">
        <div className="rights">
          <p>{t.footerRightsYear} </p>
          <p>{t.footerRightsReserved}</p>
        </div>
      </div>
    </footer>
  );
}
