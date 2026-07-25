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
  datePublished,
  dateModified,
  authorName,
  imageWidth,
  imageHeight,
  startDate,
  endDate,
  location,
  answerText,
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

  const ogImageData =
    og?.og_image?.formats?.large ||
    og?.og_image?.formats?.medium ||
    og?.og_image;

  const ogImage = getImageUrl(ogImageData?.url);
  const ogImageWidth = ogImageData?.width;
  const ogImageHeight = ogImageData?.height;

  const finalTitle = seoTitle || title || siteName;
  const fullTitle =
    finalTitle === siteName ? siteName : `${finalTitle} | ${siteName}`;

  const finalDescription = seoDescription || description || defaultDescription;

  const finalImage = ogImage || image || defaultImage;

  const finalOgTitle = ogTitle || finalTitle;
  const finalOgDescription = ogDescription || finalDescription;

  const ogType = type === "event" ? "website" : type;

  let structuredData = null;

  if (type === "event") {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: finalOgTitle,
      description: finalDescription,
      image: [finalImage],
      startDate: startDate,
      endDate: endDate || startDate,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: location
        ? {
            "@type": "Place",
            name: location,
          }
        : undefined,
      organizer: {
        "@type": "Organization",
        name: siteName,
        url: baseUrl,
      },
    };
  } else if (type === "article" || type === "news" || type === "blog") {
    structuredData = {
      "@context": "https://schema.org",
      "@type":
        type === "news"
          ? "NewsArticle"
          : type === "blog"
            ? "BlogPosting"
            : "Article",
      headline: finalOgTitle,
      description: finalDescription,
      image: [finalImage],
      datePublished: datePublished,
      dateModified: dateModified || datePublished,
      author: authorName
        ? [
            {
              "@type": "Person",
              name: authorName,
            },
          ]
        : [
            {
              "@type": "Organization",
              name: siteName,
            },
          ],
      publisher: {
        "@type": "Organization",
        name: siteName,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
    };
  } else if (type === "qna") {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "QAPage",
      mainEntity: {
        "@type": "Question",
        name: finalOgTitle,
        text: finalDescription,
        answerCount: 1,
        acceptedAnswer: {
          "@type": "Answer",
          text: answerText || finalDescription,
        },
      },
    };
  } else if (type === "website") {
    structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          name: siteName,
          url: baseUrl,
        },
        {
          "@type": "Organization",
          name: siteName,
          url: baseUrl,
        },
      ],
    };
  }

  return (
    <Helmet>
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
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
      {ogImageWidth && (
        <meta property="og:image:width" content={ogImageWidth} />
      )}
      {ogImageHeight && (
        <meta property="og:image:height" content={ogImageHeight} />
      )}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={finalImage} />
    </Helmet>
  );
}
