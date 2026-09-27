import { useEffect, useState } from "react";
import { useTranslation } from "../../../utils/useTranslation.js";

import { useLocale } from "../../../context/LocaleContext";

import QnasPageBlocks from "./QnasPageBlocks/QnasPageBlocks";
import SEO from "../../SEO/SEO.jsx";
// Styles
import "./_QNA.scss";

export default function QNA() {
  const { locale } = useLocale();
  const [qnas, setQnas] = useState([]);
  const { t } = useTranslation(locale);

  useEffect(() => {
    fetch(
      `https://api.zhkh24.kz/api/q-and-as?fields[0]=title_ru&fields[1]=title_kk&fields[2]=title_en&fields[3]=slug&fields[4]=publishDate&sort=publishDate:desc`,
    )
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
      <h1 className="qnaspage__title">{t("qandasIntro")}</h1>
      <p className="qnaspage__intro">{t("qandasIntroText")}</p>
      <QnasPageBlocks qnas={qnas} />
    </div>
  );
}
