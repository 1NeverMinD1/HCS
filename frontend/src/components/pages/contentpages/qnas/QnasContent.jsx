import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import SEO from "../../../seo/SEO.jsx";

export default function QnasContent() {
  const { documentId } = useParams();
  const [qnas, setQnas] = useState(null);
  const { locale } = useLocale();

  const title = getLangField(blog, "title", locale);
  const desc = getLangField(blog, "desc", locale);

  useEffect(() => {
    setQnas(null);

    fetch(
      `https://hcs-production-423d.up.railway.app/api/q-and-as/${documentId}?populate=*`,
    )
      .then((res) => res.json())
      .then((data) => setQnas(data.data));
  }, [documentId]);

  if (!qnas) return <h2 className="loading wrapper">Загрузка...</h2>;

  return (
    <div className="qnascontent wrapper">
      <SEO title={title} description={qnas.short_answer} type="article" />

      <div className="qnascontent__main">
        <div className="qnascontent__main-header">
          <span className="question_ico">?</span>
          <h1>{title}</h1>
        </div>
        <div className="qnascontent__main-text">
          <div className="qnascontent__main-short-block">
            <p>Краткий ответ</p>
            <blockquote className="short_answer">
              {qnas.short_answer}
            </blockquote>
          </div>
          <div className="qnascontent__main-practice-block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="galochka"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l5 5l10 -10" />
            </svg>
            <p className="practice_p">Как на практике</p>
          </div>
          <ul className="qnascontent__main-practice">
            {qnas.practice?.split("\n").map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <div className="qnascontent__main-zakon-block">
            <div className="qnascontent__main-zakon-block-intro">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="molotok"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M13 10l7.383 7.418c.823 .82 .823 2.148 0 2.967a2.11 2.11 0 0 1 -2.976 0l-7.407 -7.385" />
                <path d="M6 9l4 4" />
                <path d="M13 10l-4 -4" />
                <path d="M3 21h7" />
                <path d="M6.793 15.793l-3.586 -3.586a1 1 0 0 1 0 -1.414l2.293 -2.293l.5 .5l3 -3l-.5 -.5l2.293 -2.293a1 1 0 0 1 1.414 0l3.586 3.586a1 1 0 0 1 0 1.414l-2.293 2.293l-.5 -.5l-3 3l.5 .5l-2.293 2.293a1 1 0 0 1 -1.414 0" />
              </svg>
              <p className="zakon_p">НОРМА</p>
            </div>

            <blockquote className="zakon">{qnas.zakon}</blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
