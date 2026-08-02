import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";

export default function AuthorsHeader({
  profileImg,
  author,
  position,
  authorSlug,
}) {
  const { locale } = useLocale();

  return (
    <Link to={`/${locale}/author/${authorSlug}`} className="authors__header">
      <img
        src={profileImg}
        alt={author || "profile_photo"}
        className="profile"
      />
      <div className="authors__author">
        <p className="author">{author}</p>
        <p className="spec">{position}</p>
      </div>
    </Link>
  );
}
