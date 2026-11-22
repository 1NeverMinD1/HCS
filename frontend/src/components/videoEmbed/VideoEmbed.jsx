import { useState } from "react";
import { getLangField } from "../../utils/getLangField.js";
import "./_VideoEmbed.scss";

const CHANNEL_URL = "https://www.youtube.com/channel/UCtyrOA4vo9rYj08Ffz8pj6g";

const TEXTS = {
  ru: {
    play: "Смотреть видео",
    watch: "Смотреть на YouTube",
    subscribe: "Подписаться на канал",
    ai: "Видео подготовлено с помощью ИИ по материалам статьи",
  },
  kk: {
    play: "Бейнені көру",
    watch: "YouTube-те көру",
    subscribe: "Арнаға жазылу",
    ai: "Бейне мақала материалдары бойынша ЖИ көмегімен дайындалған",
  },
  en: {
    play: "Play video",
    watch: "Watch on YouTube",
    subscribe: "Subscribe to the channel",
    ai: "Video prepared with AI based on this article",
  },
};

export default function VideoEmbed({ video, locale }) {
  const [playing, setPlaying] = useState(false);
  const id = video?.youtube_id?.trim();

  if (!id) return null;

  const texts = TEXTS[locale] || TEXTS.ru;
  const title = getLangField(video, "title", locale);
  const desc = getLangField(video, "desc", locale);
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const watchUrl = video.is_short
    ? `https://www.youtube.com/shorts/${id}`
    : `https://www.youtube.com/watch?v=${id}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description: desc || title,
    thumbnailUrl: [thumb],
    uploadDate: video.upload_date,
    embedUrl: `https://www.youtube.com/embed/${id}`,
    url: watchUrl,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      "@id": "https://zhkh24.kz/#organization",
      name: "ЖКХ 24",
      logo: {
        "@type": "ImageObject",
        url: "https://zhkh24.kz/logo.png",
      },
    },
  };

  return (
    <figure
      className={`video-embed${video.is_short ? " video-embed--short" : ""}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="video-embed__player">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="video-embed__button"
            onClick={() => setPlaying(true)}
            aria-label={`${texts.play}: ${title}`}
          >
            <img
              className="video-embed__thumb"
              src={thumb}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="video-embed__play">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="video-embed__caption">
        {title && <span className="video-embed__title">{title}</span>}
        {video.ai_generated && (
          <span className="video-embed__note">{texts.ai}</span>
        )}
        <span className="video-embed__links">
          <a href={watchUrl} target="_blank" rel="noopener noreferrer">
            {texts.watch}
          </a>
          <a
            href={`${CHANNEL_URL}?sub_confirmation=1`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {texts.subscribe}
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
