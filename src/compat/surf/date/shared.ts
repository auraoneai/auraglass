/* Client-side Date -> CalendarDate bridge (REQ-SURF-13). On the server the
   local timezone is unknowable, so the adapters require `timeZone` there. */
import { fromDate, getLocalTimeZone } from '@internationalized/date';
import type { CalendarDate, DateValue, ZonedDateTime } from '@internationalized/date';

export function toDateValue(d: Date | undefined, timeZone?: string): DateValue {
  if (!d) throw new Error('date value required');
  if (timeZone === undefined && typeof window === 'undefined') {
    throw new Error('4.x Date -> CalendarDate conversion is client-only; pass `timeZone` on the server');
  }
  return fromDate(d, timeZone ?? getLocalTimeZone()) as DateValue;
}

export function toCalendarDate(d: Date | undefined, timeZone?: string): CalendarDate {
  const v = toDateValue(d, timeZone);
  return 'calendar' in v && 'hour' in v ? (v as ZonedDateTime) as never : v as CalendarDate;
}

export { fromDate, getLocalTimeZone };
