import { Link } from "react-router-dom";
import { useLocale } from "../../../context/LocaleContext.jsx";
import { translations } from "../../../utils/translations.js";
import logo from "../../../assets/logo.svg";

export default function FooterContent() {
  const { locale } = useLocale();
  const t = translations[locale];

  return (
    <div className="footer__content">
      <div className="footer__intro">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="logo"
        >
          <img
            src={logo}
            alt="ЖКХ24"
            className="logo_img"
            width="452"
            height="103"
          />
        </button>

        <p>{t.footerDescription}</p>
      </div>
      <div className="footer__contacts">
        <div className="footer__contacts-block">
          <h3>{t.footerSectionsTitle}</h3>
          <ul className="footer__contacts-list">
            <Link to={`/${locale}/news`} className="footer__contacts-item">
              <li className="footer__contacts-item">{t.news}</li>
            </Link>
            <Link to={`/${locale}/articles`} className="footer__contacts-item">
              <li className="footer__contacts-item">{t.articles}</li>
            </Link>
            <Link to={`/${locale}/blogs`} className="footer__contacts-item">
              <li className="footer__contacts-item">{t.blogs}</li>
            </Link>
            <Link to={`/${locale}/events`} className="footer__contacts-item">
              <li className="footer__contacts-item">{t.events}</li>
            </Link>
            <Link to={`/${locale}/q-and-as`} className="footer__contacts-item">
              <li className="footer__contacts-item">{t.footerQandA}</li>
            </Link>
          </ul>
        </div>
        <div className="footer__contacts-block">
          <h3>{t.footerPublicationTitle}</h3>
          <ul className="footer__contacts-list">
            <Link to={`/${locale}/about`} className="footer__contacts-item">
              <li className="footer__contacts-item">{t.footerAbout}</li>
            </Link>
            <Link
              to={`/${locale}/editorial-policy`}
              className="footer__contacts-item"
            >
              <li className="footer__contacts-item">
                {t.footerEditorialPolicy}
              </li>
            </Link>
            <Link to={`/${locale}/contacts`} className="footer__contacts-item">
              <li className="footer__contacts-item">{t.footerContacts}</li>
            </Link>
            <Link
              to={`/${locale}/advertising`}
              className="footer__contacts-item"
            >
              <li className="footer__contacts-item">{t.footerAdvertising}</li>
            </Link>
          </ul>
        </div>
        <div className="footer__contacts-block">
          <h3>{t.footerLegalTitle}</h3>
          <ul className="footer__contacts-list">
            <Link to={`/${locale}/imprint`} className="footer__contacts-item">
              <li className="footer__contacts-item">{t.footerImprint}</li>
            </Link>
            <Link to={`/${locale}/privacy`} className="footer__contacts-item">
              {t.footerPrivacy}
            </Link>
            <Link to={`/${locale}/terms`} className="footer__contacts-item">
              {t.footerTerms}
            </Link>
          </ul>
        </div>
        <div className="footer__contacts-block">
          <h3>{t.footerOfficeTitle}</h3>
          <ul className="footer__contacts-list">
            <li className="footer__contacts-item adress">
              <a
                href="https://2gis.kz/astana/geo/9570784863371165/71.43852,51.120018"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{t.footerAddressCity}</span>{" "}
                <span>{t.footerAddressStreet}</span>
              </a>
            </li>
          </ul>
          <h3>{t.footerEditorialTitle}</h3>
          <ul className="footer__contacts-list">
            <li className="footer__contacts-item">
              <a href="mailto:info@zhkh24.kz">info@zhkh24.kz</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
