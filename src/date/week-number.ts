// week-number.ts (SURF-209, REQ-SURF-103): ISO-8601 week number, pure.
// W53 boundary: 2020-12-31 -> 53; 2021-01-03 -> 53; 2021-01-04 -> 1.
export function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  // Thursday of the current week decides the ISO year.
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
