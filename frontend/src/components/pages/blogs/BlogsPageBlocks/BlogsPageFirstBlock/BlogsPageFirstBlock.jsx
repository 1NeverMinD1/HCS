export default function BlogsPageFirstBlock({ item }) {
  return (
    <div
      className="newspage__hero-main"
      style={{
        "--bg": `url(${latestNewsImage})`,
      }}
    ></div>
  );
}
