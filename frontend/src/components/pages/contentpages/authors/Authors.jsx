import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../utils/getLangField.js";
import { getImageUrl } from "../../../../utils/getImageUrl.js";

export default function Authors() {
  const [author, setAuthor] = useState(null);
  const { locale } = useLocale();
  const name = getLangField(author, "name", locale);

  useEffect(() => {
    fetch(`https://api.zhkh24.kz/api/authors?populate=*`)
      .then((res) => res.json())
      .then((data) => setBlogs(data.data?.[0]));
  });

  return (
    <div className="authors__layout">
      {/* <SEO
        seo={blogs.SEO}
        og={blogs.OG}
        title={getLangField(blogs, "title", locale)}
        description={getLangField(blogs, "desc", locale)}
        image={getImageUrl(
          blogs.OG?.og_image?.formats?.large?.url ||
            blogs.OG?.og_image?.url ||
            blogs.back_img?.formats?.large?.url ||
            blogs.back_img?.formats?.medium?.url ||
            blogs.back_img?.url,
        )}
        type="blog"
        datePublished={blogs.publishDate}
        dateModified={blogs.updatedAt}
        authorName={
          blogs.authors?.[0]
            ? getLangField(blogs.authors[0], "name", locale)
            : undefined
        }
      /> */}
      <div className="authors">
        <h1>AuthorName</h1>
        <div className="authors__intro">
          <img src="" alt="profile_photo" />
          <div className="authors__intro-info">
            <p className="authors__intro-info-role">Автор</p>
            <h2 className="authors__intro-info-name">Имя Фамилия</h2>
            <p className="authors__intro-info-position">
              Оперативная новостная повестка. Шеф-редактор.
            </p>
          </div>
        </div>
        <div className="authors__main">
          <div className="authors__main-edu">
            <h3>Образование:</h3>
          </div>
          <div className="authors__main-bio">
            <h3>Биография:</h3>
          </div>
          <div className="authors__main-rewards">
            <h3>Сертификаты и награды:</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
