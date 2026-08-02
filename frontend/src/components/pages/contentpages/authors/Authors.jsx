import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../utils/getLangField.js";
import { getImageUrl } from "../../../../utils/getImageUrl.js";
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
        `&populate[profile_img][populate]=*` +
        `&populate[blogs][populate]=*` +
        `&populate[articles][populate]=*` +
        `&populate[events][populate]=*` +
        `&populate[news][populate]=*` +
        `&populate[qnas][populate]=*` +
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
                      item.back_img?.formats?.medium?.url ||
                        item.cover_img?.formats?.medium?.url ||
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
