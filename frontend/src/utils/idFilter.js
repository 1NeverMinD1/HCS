export function idFilter(param, relationPath = "") {
  const key = /^\d+$/.test(String(param)) ? "id" : "documentId";
  return `filters${relationPath}[${key}][$eq]=${encodeURIComponent(param)}`;
}
