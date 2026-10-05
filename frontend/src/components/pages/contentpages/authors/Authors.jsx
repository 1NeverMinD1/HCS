import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../utils/getLangField.js";
import { getImageUrl } from "../../../../utils/getImageUrl.js";
import { formatLocalizedDate } from "../../../../utils/dateLocale";
import { useTranslation } from "../../../../utils/useTranslation.js";
import NotFoundContent from "../../../notFound/NotFoundContent.jsx";
import SEO from "../../../SEO/SEO.jsx";
import {
  FaInstagram,
  FaTelegram,
  FaFacebook,
  FaWhatsapp,
  FaYoutube,
  FaGlobe,
  FaEnvelope,
} from "react-icons/fa";
import "./_Authors.scss";

const SOCIAL_ICONS = {
  instagram: FaInstagram,
  telegram: FaTelegram,
  facebook: FaFacebook,
  whatsapp: FaWhatsapp,
  youtube: FaYoutube,
  website: FaGlobe,
  email: FaEnvelope,
};

const SECTIONS = [
  { key: "blogs", labelKey: "blogs", route: "blogs" },
  { key: "articles", labelKey: "articles", route: "articles" },
  { key: "news", labelKey: "news", route: "news" },
  { key: "events", labelKey: "events", route: "events" },
  { key: "qnas", labelKey: "qandasIntro", route: "q-and-as" },
];

const PAGE_SIZE = 10;

function sortByDateDesc(items) {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.publishDate || a.start || a.createdAt);
    const dateB = new Date(b.publishDate || b.start || b.createdAt);
    return dateB - dateA;
  });
}

export default function Authors() {
  const { locale } = useLocale();
  const { slug } = useParams();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetch(
      `https://api.zhkh24.kz/api/authors?filters[slug][$eq]=${slug}` +
        `&fields[0]=name_ru` +
        `&fields[1]=name_kk` +
        `&fields[2]=name_en` +
        `&fields[3]=position_ru` +
        `&fields[4]=position_kk` +
        `&fields[5]=position_en` +
        `&fields[6]=bio_ru` +
        `&fields[7]=bio_kk` +
        `&fields[8]=bio_en` +
        `&fields[9]=slug` +
        `&populate[profile_img][fields][0]=url` +
        `&populate[profile_img][fields][1]=formats` +
        `&populate[blogs][fields][0]=title_ru` +
        `&populate[blogs][fields][1]=title_kk` +
        `&populate[blogs][fields][2]=title_en` +
        `&populate[blogs][fields][3]=desc_ru` +
        `&populate[blogs][fields][4]=desc_kk` +
        `&populate[blogs][fields][5]=desc_en` +
        `&populate[blogs][fields][6]=slug` +
        `&populate[blogs][fields][7]=publishDate` +
        `&populate[blogs][fields][8]=createdAt` +
        `&populate[blogs][populate][back_img][fields][0]=url` +
        `&populate[blogs][populate][back_img][fields][1]=formats` +
        `&populate[articles][fields][0]=title_ru` +
        `&populate[articles][fields][1]=title_kk` +
        `&populate[articles][fields][2]=title_en` +
        `&populate[articles][fields][3]=desc_ru` +
        `&populate[articles][fields][4]=desc_kk` +
        `&populate[articles][fields][5]=desc_en` +
        `&populate[articles][fields][6]=slug` +
        `&populate[articles][fields][7]=publishDate` +
        `&populate[articles][fields][8]=createdAt` +
        `&populate[articles][populate][desc_img][fields][0]=url` +
        `&populate[articles][populate][desc_img][fields][1]=formats` +
        `&populate[news][fields][0]=title_ru` +
        `&populate[news][fields][1]=title_kk` +
        `&populate[news][fields][2]=title_en` +
        `&populate[news][fields][3]=desc_ru` +
        `&populate[news][fields][4]=desc_kk` +
        `&populate[news][fields][5]=desc_en` +
        `&populate[news][fields][6]=slug` +
        `&populate[news][fields][7]=publishDate` +
        `&populate[news][fields][8]=createdAt` +
        `&populate[news][populate][desc_img][fields][0]=url` +
        `&populate[news][populate][desc_img][fields][1]=formats` +
        `&populate[events][fields][0]=title_ru` +
        `&populate[events][fields][1]=title_kk` +
        `&populate[events][fields][2]=title_en` +
        `&populate[events][fields][3]=desc_ru` +
        `&populate[events][fields][4]=desc_kk` +
        `&populate[events][fields][5]=desc_en` +
        `&populate[events][fields][6]=slug` +
        `&populate[events][fields][7]=start` +
        `&populate[events][fields][8]=createdAt` +
        `&populate[events][populate][desc_img][fields][0]=url` +
        `&populate[events][populate][desc_img][fields][1]=formats` +
        `&populate[events][populate][cover_img][fields][0]=url` +
        `&populate[events][populate][cover_img][fields][1]=formats` +
        `&populate[links]=true`,
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setAuthor(data.data?.[0] ?? null);
      })
      .catch((err) => {
        console.error("Failed to fetch author:", err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const availableSections = useMemo(() => {
    if (!author) return [];
    return SECTIONS.map((section) => ({
      ...section,
      items: sortByDateDesc(author[section.key] ?? []),
    })).filter((section) => section.items.length > 0);
  }, [author]);

  const tabParam = searchParams.get("tab");
  const activeSection =
    availableSections.find((section) => section.key === tabParam) ||
    availableSections[0];
  const activeKey = activeSection?.key;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeKey, slug]);

  const handleTabChange = (key) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", key);
        return next;
      },
      { replace: true },
    );
  };

  if (loading) return <h2 className="loading wrapper">{t("loading")}</h2>;
  if (error) return <h2 className="loading wrapper">{t("authorNotFound")}</h2>;
  if (!author) return <NotFoundContent text={t("authorNotFound")} />;

  const name = getLangField(author, "name", locale);
  const position = getLangField(author, "position", locale);
  const bio = getLangField(author, "bio", locale);

  const profileImg = getImageUrl(
    author.profile_img?.formats?.medium?.url ||
      author.profile_img?.formats?.small?.url ||
      author.profile_img?.url,
  );

  return (
    <div className="authors__layout">
      <SEO
        title={name}
        description={bio || position}
        image={profileImg}
        type="website"
        translationSourceItem={author}
        translationField="name"
      />
      <div className="authors">
        <div className="authors__intro">
          <img src={profileImg} alt={name || ""} />
          <div className="authors__intro-info">
            <p className="authors__intro-info-role">{t("author")}</p>
            <h2 className="authors__intro-info-name">{name}</h2>
            <p className="authors__intro-info-position">{position}</p>
          </div>
        </div>
        <div className="authors__main">
          <div className="authors__main-bio">
            <h3>{t("biography")}</h3>
            <p>{bio}</p>
            {author.links?.length > 0 && (
              <>
                <h3>{t("socialNetworks")}</h3>
                <div className="authors__main-socials">
                  {author.links.map((link) => {
                    const Icon = SOCIAL_ICONS[link.platform];
                    if (!Icon) return null;

                    const href =
                      link.platform === "email"
                        ? `mailto:${link.url}`
                        : link.url;

                    return (
                      <a
                        key={link.id}
                        href={href}
                        target={
                          link.platform === "email" ? undefined : "_blank"
                        }
                        rel="noopener noreferrer"
                        className="authors__socials-link"
                        aria-label={link.platform}
                      >
                        <Icon className="authors__socials-ico" />
                        <span className="authors__socials-label">
                          {link.platform.charAt(0).toUpperCase() +
                            link.platform.slice(1)}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="authors__works">
          {availableSections.length === 0 && (
            <p className="authors__works-empty">{t("noPublications")}</p>
          )}

          {activeSection && (
            <>
              <div className="authors__tabs" role="tablist">
                {availableSections.map((section) => {
                  const isActive = section.key === activeKey;
                  return (
                    <button
                      key={section.key}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={
                        "authors__tab" +
                        (isActive ? " authors__tab--active" : "")
                      }
                      onClick={() => handleTabChange(section.key)}
                    >
                      {t(section.labelKey)}
                      <span className="authors__tab-count">
                        {section.items.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="authors__works-list" role="tabpanel">
                {activeSection.items.slice(0, visibleCount).map((item) => {
                  const title = getLangField(item, "title", locale);
                  const desc = getLangField(item, "desc", locale);
                  const cover = getImageUrl(
                    item.desc_img?.formats?.medium?.url ||
                      item.back_img?.formats?.medium?.url ||
                      item.cover_img?.formats?.medium?.url ||
                      item.desc_img?.url ||
                      item.back_img?.url ||
                      item.cover_img?.url,
                  );

                  return (
                    <Link
                      key={item.id}
                      to={`/${locale}/${activeSection.route}/${item.slug}`}
                      className="authors__work-card"
                    >
                      {cover && <img src={cover} alt={title} />}
                      <div className="authors__work-text">
                        <p className="authors__work-title">{title}</p>
                        <p className="authors__work-desc">{desc}</p>
                        <p className="authors__work-date">
                          {formatLocalizedDate(
                            item.publishDate || item.start || item.createdAt,
                            locale,
                          )}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {visibleCount < activeSection.items.length && (
                <button
                  type="button"
                  className="authors__more"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                >
                  {t("showMore")}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
