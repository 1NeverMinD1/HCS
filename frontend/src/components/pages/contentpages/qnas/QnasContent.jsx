import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import SEO from "../../../SEO/SEO.jsx";
import { getLangField } from "../../../../utils/getLangField.js";
import { useTranslation } from "../../../../utils/useTranslation.js";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../../../utils/getImageUrl.js";
// Styles
import "./_QnasContent.scss";

const ZAKON_ICON = (
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
);

const PRACTICE_ICON = (
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
);

function getPlainText(children) {
  return children.map((c) => c.text || "").join("");
}

function extractShortAnswer(contentBlocks, locale) {
  const shortAnswerComponent = contentBlocks?.find(
    (c) => c.__component === "qand-a.short-answer",
  );
  const blocks =
    shortAnswerComponent?.[`shortanswer_content_${locale}`] ||
    shortAnswerComponent?.shortanswer_content_ru ||
    [];

  return (
    blocks
      .map((b) => getPlainText(b.children))
      .join(" ")
      .trim() || null
  );
}

function renderComponent(component, index, locale) {
  if (component.__component === "qand-a.short-answer") {
    const blocks =
      component[`shortanswer_content_${locale}`] ||
      component.shortanswer_content_ru ||
      [];

    return (
      <div key={index} className="qnascontent__main-short-block">
        <p>Краткий ответ</p>
        {blocks.map((b, i) => (
          <blockquote key={i} className="short_answer">
            {getPlainText(b.children)}
          </blockquote>
        ))}
      </div>
    );
  }

  if (component.__component === "qand-a.law") {
    const blocks =
      component[`law_content_${locale}`] || component.law_content_ru || [];

    return (
      <div key={index} className="qnascontent__main-zakon-block">
        <div className="qnascontent__main-zakon-block-intro">
          {ZAKON_ICON}
          <p className="zakon_p">НОРМА</p>
        </div>
        {blocks.map((b, i) => (
          <blockquote key={i} className="zakon">
            {getPlainText(b.children)}
          </blockquote>
        ))}
      </div>
    );
  }

  if (component.__component === "qand-a.practice") {
    const blocks =
      component[`practice_content_${locale}`] ||
      component.practice_content_ru ||
      [];

    return (
      <div key={index} className="qnascontent__main-practice-wrap">
        <div className="qnascontent__main-practice-block">
          {PRACTICE_ICON}
          <p className="practice_p">Как на практике</p>
        </div>
        <ul className="qnascontent__main-practice">
          {blocks.map((b, i) => (
            <li key={i}>{getPlainText(b.children)}</li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}

export default function QnasContent() {
  const { slug } = useParams();
  const [qnas, setQnas] = useState(null);
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  useEffect(() => {
    setQnas(null);

    fetch(
      `https://api.zhkh24.kz/api/q-and-as?filters[slug][$eq]=${slug}&populate=*`,
    )
      .then((res) => res.json())
      .then((data) => setQnas(data.data?.[0]));
  }, [slug]);

  if (!qnas) return <h2 className="loading wrapper">Загрузка...</h2>;

  const title = getLangField(qnas, "title", locale);
  const content = qnas.Content || [];
  const shortAnswer = extractShortAnswer(content, locale);

  return (
    <div className="qnascontent wrapper">
      <SEO
        seo={qnas.SEO}
        og={qnas.OG}
        title={getLangField(qnas, "title", locale)}
        description={getLangField(qnas, "desc", locale)}
        image={getImageUrl(
          qnas.OG?.og_image?.formats?.large?.url ||
            qnas.OG?.og_image?.url ||
            qnas.desc_img?.formats?.large?.url ||
            qnas.desc_img?.formats?.medium?.url ||
            qnas.desc_img?.url,
        )}
        type="qna"
        answerText={shortAnswer}
        datePublished={qnas.publishDate}
        dateModified={qnas.updatedAt}
        authorName={
          qnas.authors?.[0]
            ? getLangField(qnas.authors[0], "name", locale)
            : undefined
        }
        translationSourceItem={qnas}
        translationField="title"
      />
      <Link to={`/${locale}/q-and-as`} className="back">
        <svg className="arrow_reverse" viewBox="0 0 5 9">
          <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>
        </svg>
        {t("allQandAs")}
      </Link>
      <div className="qnascontent__main">
        <div className="qnascontent__main-header">
          <span className="question_ico">?</span>
          <h1>{title}</h1>
        </div>

        <div className="qnascontent__main-text">
          {content.map((component, index) =>
            renderComponent(component, index, locale),
          )}
        </div>
        <div className="qnascontent__tags">
          {qnas.tags?.map((tag) => (
            <p key={tag.id}>{getLangField(tag, "name", locale)}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
