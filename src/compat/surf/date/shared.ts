/* Client-side Date -> CalendarDate bridge (REQ-SURF-13). On the server the
   local timezone is unknowable, so the adapters require `timeZone` there.
   Public signatures use the AuraGlass-owned date value types (REQ-CMP-01:
   no date-foundation types in the emitted d.ts). */
import { fromDate as intlFromDate, getLocalTimeZone as intlGetLocalTimeZone } from '@internationalized/date';
import type { CalendarDate, DateValue, ZonedDateTime } from '../../../date/shared';

/** Client-side `Date` -> zoned date value in `timeZone`. */
export function fromDate(date: Date, timeZone: string): ZonedDateTime {
  return intlFromDate(date, timeZone);
}

/** The runtime's local IANA time zone. */
export function getLocalTimeZone(): string {
  return intlGetLocalTimeZone();
}

export function toDateValue(d: Date | undefined, timeZone?: string): DateValue {
  if (!d) throw new Error('date value required');
  if (timeZone === undefined && typeof window === 'undefined') {
    throw new Error('4.x Date -> CalendarDate conversion is client-only; pass `timeZone` on the server');
  }
  return fromDate(d, timeZone ?? getLocalTimeZone());
}

export function toCalendarDate(d: Date | undefined, timeZone?: string): CalendarDate {
  const v = toDateValue(d, timeZone);
  return 'calendar' in v && 'hour' in v ? (v as ZonedDateTime) as never : v as CalendarDate;
}
