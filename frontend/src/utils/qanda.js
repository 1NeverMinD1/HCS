export const getQandaField = (locale) =>
  locale === "kk" ? "qanda_kz" : `qanda_${locale}`;

export const getQandaBlocks = (item, locale) =>
  item?.[getQandaField(locale)] || item?.qanda_ru || [];

const blockText = (node) => {
  if (typeof node?.text === "string") return node.text;
  const sep = node?.type === "list" ? " " : "";
  return (node?.children || []).map(blockText).join(sep);
};

export function parseQanda(blocks = []) {
  const items = [];
  let current = null;
  for (const b of blocks || []) {
    if (b.type === "heading") {
      if (current && current.a.length) items.push(current);
      current = { q: blockText(b).trim(), a: [] };
    } else if (current) {
      const text = blockText(b).trim();
      if (text) current.a.push(text);
    }
  }
  if (current && current.a.length) items.push(current);
  return items.filter((i) => i.q);
}
