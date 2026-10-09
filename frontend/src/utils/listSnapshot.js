const used = new Set();

export function readListSnapshot(key) {
  if (used.has(key)) return null;
  const el = document.getElementById("list-data");
  if (!el) return null;
  try {
    const parsed = JSON.parse(el.textContent);
    if (parsed?.key !== key || !Array.isArray(parsed.data)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function markListSnapshotUsed(key) {
  used.add(key);
}
