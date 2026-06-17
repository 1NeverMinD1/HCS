import { Helmet } from "react-helmet-async";
import { useLocale } from "../../context/LocaleContext.jsx";

export default function SEO({
  title,
  description,
  image,
  url,
  type = "website",
}) {
  const { locale } = useLocale();
  const lang = locale.split("-")[0];

  const siteName = "Вестник";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription =
    "Современный новостной портал с актуальными новостями, аналитикой и авторскими материалами.";
  const defaultImage = "https://hcs-eight.vercel.app/og-default.jpg";

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />

      <meta property="og:title" content={fullTitle} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url || window.location.href} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />
    </Helmet>
  );
}
