import { useState } from "react";
import NewsList from "../components/NewsList";
import HeaderNav from "../HeaderNav/HeaderNav";
import Search from "../Search/Search";

export default function App() {
  const [query, setQuery] = useState("");

  return (
    <>
      <HeaderNav />
      <div className="main">
        <Search query={query} setQuery={setQuery} />
        <NewsList query={query} />
      </div>
    </>
  );
}
