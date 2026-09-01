import { Link } from "react-router-dom";

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="breadcrumb">
      <ol className="breadcrumbs__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="breadcrumbs__item">
              {isLast || !item.url ? (
                <span className="breadcrumbs__current">{item.name}</span>
              ) : (
                <Link to={item.url} className="breadcrumbs__link">
                  {item.name}
                </Link>
              )}
              {!isLast && <span className="breadcrumbs__separator">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
