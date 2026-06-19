import { useEffect, useState } from "react";
import { useTranslation } from "../../../utils/useTranslation.js";

import { useLocale } from "../../../context/LocaleContext";

import QnasPageBlocks from "./QnasPageBlocks/QnasPageBlocks";
import SEO from "../../seo/SEO.jsx";

export default function QNA() {
  const { locale } = useLocale();
  const [qnas, setQnas] = useState([]);
  const { t } = useTranslation(locale);

  useEffect(() => {
    fetch(
      `https://hcs-production-423d.up.railway.app/api/q-and-as?populate=*&sort=publishDate:desc`,
    )
      .then((res) => res.json())
      .then((data) => {
        setQnas(data.data || []);
      });
  }, []);

  return (
    <div className="qnaspage wrapper">
      <SEO
        title="Вопросы и ответы"
        description="Быстрые ответы на интересующие вопросы"
      />
      <h2 className="qnaspage__title">{t("qandasIntro")}</h2>
      <p className="qnaspage__intro">{t("qandasIntroText")}</p>
      <QnasPageBlocks qnas={qnas} />
    </div>
  );
}
