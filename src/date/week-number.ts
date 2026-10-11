// week-number.ts (SURF-209, REQ-SURF-103): ISO-8601 week number, pure.
// Input is a calendar date ({year, month, day}, i.e. a CalendarDate): the
// computation runs entirely on Date.UTC, so the host time zone never shifts
// the day (a local `new Date(y, m-1, d)` read back through getUTC* would land
// on the previous day in UTC+ zones such as Asia/Tokyo).
// W53 boundary: 2020-12-31 -> 53; 2021-01-03 -> 53; 2021-01-04 -> 1.

export interface CalendarDayLike {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

const DAY_MS = 86_400_000;

export function isoWeekNumber(date: CalendarDayLike): number {
  const d = new Date(Date.UTC(date.year, date.month - 1, date.day));
  // ISO weekday 1 (Mon) .. 7 (Sun); the Thursday of this week decides the ISO year.
  const weekday = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - weekday);
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart) / DAY_MS + 1) / 7);
}

/** ISO weekday (1 = Monday … 7 = Sunday) of a calendar date, zone-independent. */
export function isoWeekday(date: CalendarDayLike): number {
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay() || 7;
}
