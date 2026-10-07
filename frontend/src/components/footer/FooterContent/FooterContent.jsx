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
            loading="lazy"
            decoding="async"
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
          <h2>{t.footerSectionsTitle}</h2>
          <ul className="footer__contacts-list">
            <li className="footer__contacts-item">
              <Link to={`/${locale}/news`} className="footer__contacts-item">
                {t.news}
              </Link>
            </li>
            <li className="footer__contacts-item">
              <Link
                to={`/${locale}/articles`}
                className="footer__contacts-item"
              >
                {t.articles}
              </Link>
            </li>
            <li className="footer__contacts-item">
              <Link to={`/${locale}/blogs`} className="footer__contacts-item">
                {t.blogs}
              </Link>
            </li>
            <li className="footer__contacts-item">
              <Link to={`/${locale}/events`} className="footer__contacts-item">
                {t.events}
              </Link>
            </li>
            <li className="footer__contacts-item">
              <Link
                to={`/${locale}/q-and-as`}
                className="footer__contacts-item"
              >
                {t.footerQandA}
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer__contacts-block">
          <h2>{t.footerPublicationTitle}</h2>
          <ul className="footer__contacts-list">
            <li className="footer__contacts-item">
              <Link to={`/${locale}/about`} className="footer__contacts-item">
                {t.footerAbout}
              </Link>
            </li>
            <li className="footer__contacts-item">
              <Link
                to={`/${locale}/editorial-policy`}
                className="footer__contacts-item"
              >
                {t.footerEditorialPolicy}
              </Link>
            </li>
            <li className="footer__contacts-item">
              <Link
                to={`/${locale}/contacts`}
                className="footer__contacts-item"
              >
                {t.footerContacts}
              </Link>
            </li>
            <li className="footer__contacts-item">
              <Link
                to={`/${locale}/advertising`}
                className="footer__contacts-item"
              >
                {t.footerAdvertising}
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer__contacts-block">
          <h2>{t.footerLegalTitle}</h2>
          <ul className="footer__contacts-list">
            <li className="footer__contacts-item">
              <Link to={`/${locale}/imprint`} className="footer__contacts-item">
                {t.footerImprint}
              </Link>
            </li>
            <li className="footer__contacts-item">
              <Link to={`/${locale}/privacy`} className="footer__contacts-item">
                {t.footerPrivacy}
              </Link>
            </li>
            <li className="footer__contacts-item">
              <Link to={`/${locale}/terms`} className="footer__contacts-item">
                {t.footerTerms}
              </Link>
            </li>
            <li className="footer__contacts-item">
              <Link to={`/${locale}/sitemap`} className="footer__contacts-item">
                {t.sitemap}
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer__contacts-block">
          <h2>{t.footerContacts}</h2>
          <ul className="footer__contacts-list">
            <li className="footer__contacts-item adress">
              <a
                href="https://2gis.kz/astana/geo/9570784863371165/71.43852,51.120018"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{t.footerAddressCity}</span>
                <span>{t.footerAddressStreet}</span>
              </a>
            </li>
            <li className="footer__contacts-item">
              <a href="mailto:info@zhkh24.kz">info@zhkh24.kz</a>
            </li>
          </ul>
        </div>{" "}
      </div>
    </div>
  );
}
