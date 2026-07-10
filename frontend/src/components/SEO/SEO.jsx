import { Helmet } from "react-helmet-async";
import { useLocale } from "../../context/LocaleContext.jsx";
import { useLocation } from "react-router-dom";

export default function SEO({
  title,
  description,
  image,
  url,
  type = "website",
  noIndex = false,
}) {
  const { locale } = useLocale();
  const { pathname } = useLocation();
  const lang = locale.split("-")[0];

  const siteName = "ЖКХ24";
  const baseUrl = "https://hcs-eight.vercel.app";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription =
    "Современный новостной портал с актуальными новостями, аналитикой и авторскими материалами.";
  const defaultImage = `${baseUrl}/og-default.jpg`;
  const canonicalUrl = url || `${baseUrl}${pathname}`;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta
        name="robots"
        content={noIndex ? "noindex,nofollow" : "index,follow"}
      />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta
        name="twitter:description"
        content={description || defaultDescription}
      />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
}
