import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../utils/getLangField.js";
import { getImageUrl } from "../../../../utils/getImageUrl.js";
import { formatLocalizedDate } from "../../../../utils/dateLocale";
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
  { key: "blogs", label: "Блоги", route: "blogs" },
  { key: "articles", label: "Статьи", route: "articles" },
  { key: "news", label: "Новости", route: "news" },
  { key: "events", label: "Мероприятия", route: "events" },
  { key: "qnas", label: "Вопросы и ответы", route: "q-and-as" },
];

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
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  if (loading) return <h2 className="loading wrapper">Загрузка...</h2>;
  if (error || !author)
    return <h2 className="loading wrapper">Автор не найден</h2>;

  const name = getLangField(author, "name", locale);
  const position = getLangField(author, "position", locale);
  const bio = getLangField(author, "bio", locale);

  const profileImg = getImageUrl(
    author.profile_img?.formats?.medium?.url ||
      author.profile_img?.formats?.small?.url ||
      author.profile_img?.url,
  );

  const hasAnyWorks = SECTIONS.some(
    (section) => (author[section.key] ?? []).length > 0,
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
          <img src={profileImg} alt="profile_photo" />
          <div className="authors__intro-info">
            <p className="authors__intro-info-role">Автор</p>
            <h2 className="authors__intro-info-name">{name}</h2>
            <p className="authors__intro-info-position">{position}</p>
          </div>
        </div>
        <div className="authors__main">
          <div className="authors__main-bio">
            <h3>Биография:</h3>
            <p>{bio}</p>
            <h3>Социальные сети:</h3>
            {author.links?.length > 0 && (
              <div className="authors__main-socials">
                {author.links.map((link) => {
                  const Icon = SOCIAL_ICONS[link.platform];
                  if (!Icon) return null;

                  const href =
                    link.platform === "email" ? `mailto:${link.url}` : link.url;

                  return (
                    <a
                      key={link.id}
                      href={href}
                      target={link.platform === "email" ? undefined : "_blank"}
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
            )}
          </div>
        </div>

        <div className="authors__works">
          {!hasAnyWorks && <p>Пока нет опубликованных материалов.</p>}

          {SECTIONS.map((section) => {
            const items = sortByDateDesc(author[section.key] ?? []);
            if (items.length === 0) return null;

            return (
              <div key={section.key} className="authors__works-section">
                <h3>{section.label}</h3>
                <div className="authors__works-list">
                  {items.map((item) => {
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
                        to={`/${locale}/${section.route}/${item.slug}`}
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
