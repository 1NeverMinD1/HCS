import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../utils/getLangField.js";
import { getImageUrl } from "../../../../utils/getImageUrl.js";

export default function Authors() {
  const { locale } = useLocale();
  const { slug } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const name = getLangField(author, "name", locale);
  const position = getLangField(author, "position", locale);
  const bio = getLangField(author, "bio", locale);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetch(
      `https://api.zhkh24.kz/api/authors?filters[slug][$eq]=${slug}&populate=*`,
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

  const profileImg = getImageUrl(
    author.profile_img?.formats?.medium?.url ||
      author.profile_img?.formats?.small?.url ||
      author.profile_img?.url,
  );

  return (
    <div className="authors__layout">
      <div className="authors">
        <h1>{name}</h1>
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
          </div>
        </div>
      </div>
    </div>
  );
}
