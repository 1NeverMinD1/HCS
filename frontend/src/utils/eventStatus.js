export function getTodayISO() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function getEventStatus(event, today = getTodayISO()) {
  const start = event?.start?.slice(0, 10);
  if (!start) return null;
  const end = event.end?.slice(0, 10) || start;

  if (start > today) return "upcoming";
  if (end >= today) return "running";
  return "finished";
}

export function buildEventFilters({ status, from, to, today }) {
  const and = [];

  if (status === "upcoming") {
    and.push({ start: { $gt: today } });
  }

  if (status === "running") {
    and.push(
      { start: { $lte: today } },
      {
        $or: [
          { end: { $gte: today } },
          { end: { $null: true }, start: { $eq: today } },
        ],
      },
    );
  }

  if (status === "finished") {
    and.push({
      $or: [
        { end: { $lt: today } },
        { end: { $null: true }, start: { $lt: today } },
      ],
    });
  }

  if (to) {
    and.push({ start: { $lte: to } });
  }

  if (from) {
    and.push({
      $or: [
        { end: { $gte: from } },
        { end: { $null: true }, start: { $gte: from } },
      ],
    });
  }

  return and.length ? { $and: and } : null;
}

export function toQuery(value, prefix) {
  if (value === null || value === undefined) return [];
  if (typeof value === "object") {
    return Object.entries(value).flatMap(([key, val]) =>
      toQuery(val, prefix ? `${prefix}[${key}]` : key),
    );
  }
  return [`${prefix}=${encodeURIComponent(value)}`];
}
