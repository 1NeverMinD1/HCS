export default function APContent({ item }) {
  return (
    <div className="page__content">
      {item.content?.map((block, index) => {
        switch (block.type) {
          case "paragraph": {
            const text = block.children.map((c) => c.text).join("");
            if (!text.trim()) return null;
            return (
              <p key={index}>
                {block.children.map((child, i) => {
                  if (child.bold) return <strong key={i}>{child.text}</strong>;
                  if (child.italic) return <em key={i}>{child.text}</em>;
                  return child.text;
                })}
              </p>
            );
          }

          case "heading": {
            const Tag = `h${block.level}`;
            return (
              <Tag key={index} className="page__heading">
                {block.children.map((c) => c.text).join("")}
              </Tag>
            );
          }

          case "list":
            return block.format === "ordered" ? (
              <ol key={index} className="page__list">
                {block.children.map((li, i) => (
                  <li key={i}>{li.children.map((c) => c.text).join("")}</li>
                ))}
              </ol>
            ) : (
              <ul key={index} className="page__list">
                {block.children.map((li, i) => (
                  <li key={i}>{li.children.map((c) => c.text).join("")}</li>
                ))}
              </ul>
            );

          case "image":
            return (
              <img
                key={index}
                src={block.image.url}
                alt={block.image.alternativeText || ""}
                className="page__content-img"
              />
            );

          case "quote":
            return (
              <blockquote key={index} className="page__quote">
                <span className="page__quote-mark">"</span>
                {block.children.map((c) => c.text).join("")}
              </blockquote>
            );

          default:
            return null;
        }
      })}

      {item.tags?.length > 0 && (
        <div className="page__tags">
          {item.tags.map((tag) => (
            <span key={tag.id} className="page__tag">
              # {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
