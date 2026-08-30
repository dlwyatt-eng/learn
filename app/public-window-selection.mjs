/**
 * @template {{ effectiveFrom: string, effectiveTo: string }} T
 * @param {readonly T[]} windows
 * @param {string} today
 * @returns {T | null}
 */
export function selectPublicWindow(windows, today = vancouverDateKey()) {
  const ordered = [...windows].sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom));
  return ordered.find(window => window.effectiveFrom <= today && today <= window.effectiveTo)
    ?? ordered.find(window => today < window.effectiveFrom)
    ?? null;
}

/**
 * @param {{ effectiveFrom: string, effectiveTo: string }} window
 * @param {string} today
 * @returns {"up-next" | "current" | "finished"}
 */
export function publicWindowState(window, today = vancouverDateKey()) {
  if (today < window.effectiveFrom) return "up-next";
  if (today > window.effectiveTo) return "finished";
  return "current";
}

/** @param {Date} date */
export function vancouverDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = type => parts.find(part => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}
