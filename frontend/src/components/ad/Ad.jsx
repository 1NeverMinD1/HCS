export default function Ad({ hasAd = true }) {
  if (!hasAd) return null;

  return (
    <div className="ad">
      <p>Реклама</p>
    </div>
  );
}
