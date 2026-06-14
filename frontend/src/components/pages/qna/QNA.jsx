import { useEffect, useState } from "react";

import { useLocale } from "../../../context/LocaleContext";

import QnasPageBlocks from "./QnasPageBlocks/QnasPageBlocks";

export default function QNA() {
  const { locale } = useLocale();
  const [qnas, setQnas] = useState([]);

  useEffect(() => {
    fetch(
      `https://hcs-production-423d.up.railway.app/api/q-and-as?populate=*&&sort=publishDate:desc&locale=${locale}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setQnas(data.data || []);
      });
  }, [locale]);

  return (
    <div className="qnaspage wrapper">
      <h2 className="qnaspage__title">Вопросы и ответы</h2>
      <p className="qnaspage__intro">Быстрые ответы на интересующие вопросы</p>
      <QnasPageBlocks qnas={qnas} />
    </div>
  );
}
