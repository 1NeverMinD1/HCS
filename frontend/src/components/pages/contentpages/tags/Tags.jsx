import { Link } from "react-router-dom";
import { getLangField } from "../../../../utils/getLangField";
// Styles
import "./_Tags.scss";

export default function Tags({ item, locale }) {
  return (
    <div className="tags_block">
      {item.cities?.[0] && (
        <p className="city">
          {getLangField(item?.cities?.[0], "city", locale)}
        </p>
      )}
      {item.tags?.map((tag) => (
        <Link to={`/${locale}/tag/${tag.id}`} className="tag" key={tag.id}>
          {getLangField(tag, "name", locale)}
        </Link>
      ))}
    </div>
  );
}
