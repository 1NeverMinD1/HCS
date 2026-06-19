import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLocale } from "../../../../context/LocaleContext.jsx";
import SEO from "../../../SEO/SEO.jsx";
import { getLangField } from "../../../../utils/getLangField.js";
import { useTranslation } from "../../../../utils/useTranslation.js";
import { Link } from "react-router-dom";

const BLOCK_CONFIG = {
  "Краткий ответ": {
    key: "short",
    blockClass: "qnascontent__main-short-block",
    quoteClass: "short_answer",
    label: "Краткий ответ",
    icon: null,
  },
  Закон: {
    key: "zakon",
    blockClass: "qnascontent__main-zakon-block",
    quoteClass: "zakon",
    label: "НОРМА",
    icon: (
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
    ),
  },
};

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

// Достаёт кодовое слово и текст из параграфа вида ("Краткий ответ") текст...
function parseCodeWord(rawText) {
  const match = rawText.match(/^\(\s*["«](.+?)["»]\s*\)\s*(.*)/s);
  if (!match) return null;

  const [, codeWord, rest] = match;
  const config = BLOCK_CONFIG[codeWord.trim()];
  return config ? { config, text: rest } : null;
}

function getPlainText(children) {
  return children.map((c) => c.text || "").join("");
}

function renderBlock(block, index) {
  if (block.type === "paragraph") {
    const parsed = parseCodeWord(getPlainText(block.children));
    if (!parsed) return null; // параграф без кодового слова — пропускаем

    const { config, text } = parsed;
    return (
      <div key={index} className={config.blockClass}>
        {config.icon ? (
          <div className={`${config.blockClass}-intro`}>
            {config.icon}
            <p className={`${config.key}_p`}>{config.label}</p>
          </div>
        ) : (
          <p>{config.label}</p>
        )}
        <blockquote className={config.quoteClass}>{text}</blockquote>
      </div>
    );
  }

  if (block.type === "list") {
    const items = block.children.map((item, i) => (
      <li key={i}>{getPlainText(item.children)}</li>
    ));

    return (
      <div key={index} className="qnascontent__main-practice-wrap">
        <div className="qnascontent__main-practice-block">
          {PRACTICE_ICON}
          <p className="practice_p">Как на практике</p>
        </div>
        <ul className="qnascontent__main-practice">{items}</ul>
      </div>
    );
  }

  return null;
}

export default function QnasContent() {
  const { documentId } = useParams();
  const [qnas, setQnas] = useState(null);
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  useEffect(() => {
    setQnas(null);

    fetch(
      `https://hcs-production-423d.up.railway.app/api/q-and-as/${documentId}?populate=*`,
    )
      .then((res) => res.json())
      .then((data) => setQnas(data.data));
  }, [documentId]);

  if (!qnas) return <h2 className="loading wrapper">Загрузка...</h2>;

  const title = getLangField(qnas, "title", locale);
  const content = qnas[`content_${locale}`] || [];

  return (
    <div className="qnascontent wrapper">
      <SEO title={title} description={title} type="article" />
      <Link to="/${locale}/q-and-as" className="back">
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
          {content.map((block, index) => renderBlock(block, index))}
        </div>
      </div>
    </div>
  );
}
