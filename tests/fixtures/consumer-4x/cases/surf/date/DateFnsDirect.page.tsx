// @ts-nocheck — frozen 4.x consumer usage (codemod input).
// REQ-SURF-15: a file importing date-fns directly — the deps codemod row
// migrates it to @internationalized/date.
import { format, addDays, isBefore } from 'date-fns';

export function formatShipDate(d: Date) {
  const end = addDays(d, 5);
  return `${format(d, 'yyyy-MM-dd')} → ${format(end, 'yyyy-MM-dd')}${isBefore(end, new Date()) ? ' (past)' : ''}`;
}
