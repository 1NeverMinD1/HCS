import { useEffect, useRef } from "react";

export default function renderHTML({ html }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const scripts = ref.current.querySelectorAll("script");

    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");

      [...oldScript.attributes].forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value),
      );

      newScript.textContent = oldScript.textContent;

      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }, [html]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}
