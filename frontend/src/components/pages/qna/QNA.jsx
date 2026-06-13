import { useEffect, useState } from "react";

import QnasPageBlocks from "./QnasPageBlocks/QnasPageBlocks";

export default function QNA() {
  const [qnas, setQnas] = useState([]);

  useEffect(() => {
    fetch(
      "https://hcs-production-423d.up.railway.app/api/q-and-as?populate=*&&sort=publishDate:desc",
    )
      .then((res) => res.json())
      .then((data) => {
        setQnas(data.data || []);
      });
  }, []);

  return (
    <div className="qnaspage wrapper">
      <h2 className="qnaspage__title">Авторские блоги</h2>
      <p className="qnaspage__intro">
        Личные мнения, истории и размышления от нашего сообщества
      </p>

      <QnasPageBlocks qnas={qnas} />
    </div>
  );
}
