import { Helmet } from "react-helmet-async";
import { useLocale } from "../../context/LocaleContext.jsx";
import { useLocation } from "react-router-dom";
import { getLangField } from "../../utils/getLangField.js";
import { getImageUrl } from "../../utils/getImageUrl.js";

export default function SEO({
  title,
  description,
  image,
  seo,
  og,
  url,
  type = "website",
  noIndex = false,
}) {
  const { locale } = useLocale();
  const { pathname } = useLocation();

  const lang = locale.split("-")[0];

  const siteName = "ЖКХ24";
  const baseUrl = "https://zhkh24.kz";

  const defaultDescription =
    "Современный новостной портал с актуальными новостями, аналитикой и авторскими материалами.";

  const defaultImage = `${baseUrl}/og-default.jpg`;

  const canonicalUrl = url || `${baseUrl}${pathname}`;

  const seoTitle = getLangField(seo, "seo_title", locale);
  const seoDescription = getLangField(seo, "seo_desc", locale);
  const seoKeywords = getLangField(seo, "seo_keywords", locale);

  const ogTitle = getLangField(og, "og_title", locale);
  const ogDescription = getLangField(og, "og_desc", locale);

  const ogImage = getImageUrl(
    og?.og_image?.formats?.large?.url ||
      og?.og_image?.formats?.medium?.url ||
      og?.og_image?.url,
  );

  const finalTitle = seoTitle || title || siteName;
  const fullTitle =
    finalTitle === siteName ? siteName : `${finalTitle} | ${siteName}`;

  const finalDescription = seoDescription || description || defaultDescription;

  const finalImage = ogImage || image || defaultImage;

  const finalOgTitle = ogTitle || finalTitle;
  const finalOgDescription = ogDescription || finalDescription;

  return (
    <Helmet>
      <html lang={lang} />

      <title>{fullTitle}</title>

      <meta name="description" content={finalDescription} />

      {seoKeywords && <meta name="keywords" content={seoKeywords} />}

      <meta
        name="robots"
        content={noIndex ? "noindex,nofollow" : "index,follow"}
      />

      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={finalImage} />
    </Helmet>
  );
}
