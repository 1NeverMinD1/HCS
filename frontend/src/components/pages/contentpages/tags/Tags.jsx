import { getLangField } from "../../../../utils/getLangField";

export default function Tags({ item, locale }) {
  return (
    <div className="tags_block">
      {item.cities?.[0] && (
        <p className="city">
          {getLangField(item?.cities?.[0], "city", locale)}
        </p>
      )}
      {item.tags?.map((tag) => (
        <p className="tag" key={tag.id}>
          {getLangField(tag, "name", locale)}
        </p>
      ))}
    </div>
  );
}
