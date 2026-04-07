export default function Search({ query, setQuery }) {
  return (
    <div className="search">
      <label htmlFor="search_task">Найти ответ на вопрос</label>
      <input
        type="text"
        id="search_task"
        placeholder="Введите вопрос"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
