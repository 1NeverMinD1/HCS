import NPIntro from "../NPIntro/NPIntro";
import NPContent from "../NPContent/NPContent";

export default function NewsPageArticle({ item, imageUrl }) {
  return (
    <article className="page__art">
      <NPIntro item={item} imageUrl={imageUrl} />
      <div className="page__divider">
        <span />
        <span />
        <span />
      </div>
      <NPContent item={item} />
    </article>
  );
}
