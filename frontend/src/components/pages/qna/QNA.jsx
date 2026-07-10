import { useEffect, useState } from "react";
import { useTranslation } from "../../../utils/useTranslation.js";

import { useLocale } from "../../../context/LocaleContext";

import QnasPageBlocks from "./QnasPageBlocks/QnasPageBlocks";
import SEO from "../../SEO/SEO.jsx";

export default function QNA() {
  const { locale } = useLocale();
  const [qnas, setQnas] = useState([]);
  const { t } = useTranslation(locale);

  useEffect(() => {
    fetch(`https://api.zhkh24.kz/api/q-and-as?populate=*&sort=publishDate:desc`)
      .then((res) => res.json())
      .then((data) => {
        setQnas(data.data || []);
      });
  }, []);

  return (
    <div className="qnaspage wrapper">
      <SEO
        title={t("seo_static_title_qandas")}
        description={t("seo_static_desc_qandas")}
      />
      <h2 className="qnaspage__title">{t("qandasIntro")}</h2>
      <p className="qnaspage__intro">{t("qandasIntroText")}</p>
      <QnasPageBlocks qnas={qnas} />
    </div>
  );
}
