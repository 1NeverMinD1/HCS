import { useState } from "react";
import NewsList from "./components/NewsList";
import HeaderNav from "./HeaderNav/HeaderNav";
import Search from "./Search/Search";
import Articles from "./Articles/Articles";

export default function App() {
  const [query, setQuery] = useState("");

  return (
    <>
      <HeaderNav />
      <div className="main wrapper">
        <div className="info">
          <Search query={query} setQuery={setQuery} />
          <NewsList query={query} />
        </div>
      </div>
    </>
  );
}
