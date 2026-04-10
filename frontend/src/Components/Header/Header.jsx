export default function Header() {
  return (
    <header>
      <span className="logo">
        <a href="#">НАЗВАНИЕ</a>
      </span>
      <div className="search">
        <input type="text" placeholder="Найти новость" />
        <button className="search__button">SEARCH</button>
      </div>
    </header>
  );
}
