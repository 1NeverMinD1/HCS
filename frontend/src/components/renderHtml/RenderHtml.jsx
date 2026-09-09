import { useEffect, useRef, memo } from "react";

function RenderHtml({ html, locale }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    window.zhkhLang = locale;

    const scripts = ref.current.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      [...oldScript.attributes].forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value),
      );
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }, [html, locale]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default memo(RenderHtml);
