'use client';
/* 4.x Date/string ↔ 5.0 date-value conversions (REQ-SURF-13), owned by
   src/date so the optional `@internationalized/date` peer is value-imported
   only from src/date/** (REQ-SURF-04 import allowlist,
   docs/dependency-allowlist.json). Internal: not exported from
   'aura-glass/date'. The compat date adapters reach it only from their
   lazily loaded `*.impl.tsx` modules (src/compat/surf/lazyAdapter.tsx), so
   importing 'aura-glass/compat' never evaluates the peer.

   4.x `Date` values convert client-side with fromDate(date,
   getLocalTimeZone()); on the server the local zone is unknowable, so
   `timeZone` is required there. 4.x GlassDateField/GlassTimeField were
   native inputs whose values were ISO strings ('2026-09-18', '09:30'); those
   parse with parseDate/parseTime. Date-only values use CalendarDate (day
   granularity). Signatures use the AuraGlass-owned value types (REQ-CMP-01). */
import {
  fromDate as intlFromDate,
  getLocalTimeZone as intlGetLocalTimeZone,
  parseDate,
  parseTime,
  toCalendarDate as intlToCalendarDate,
  toTime,
} from '@internationalized/date';
import type { CalendarDate, DateValue, TimeValue, ZonedDateTime } from './shared';

/** Client-side `Date` -> zoned date value in `timeZone`. */
export function fromDate(date: Date, timeZone: string): ZonedDateTime {
  return intlFromDate(date, timeZone);
}

/** The runtime's local IANA time zone. */
export function getLocalTimeZone(): string {
  return intlGetLocalTimeZone();
}

function zone(timeZone: string | undefined): string {
  if (timeZone === undefined && typeof window === 'undefined') {
    throw new Error('4.x Date -> CalendarDate conversion is client-only; pass `timeZone` on the server');
  }
  return timeZone ?? getLocalTimeZone();
}

export function toDateValue(d: Date, timeZone?: string): DateValue {
  return fromDate(d, zone(timeZone));
}

/** 4.x Date | 'YYYY-MM-DD' -> CalendarDate (day granularity). */
export function toCalendarDate(d: Date | string | null | undefined, timeZone?: string): CalendarDate | undefined {
  if (d == null || d === '') return undefined;
  if (typeof d === 'string') return parseDate(d.slice(0, 10)) as unknown as CalendarDate;
  return intlToCalendarDate(intlFromDate(d, zone(timeZone))) as unknown as CalendarDate;
}

/** 4.x Date | 'HH:mm[:ss]' -> Time. */
export function toTimeValue(d: Date | string | null | undefined, timeZone?: string): TimeValue | undefined {
  if (d == null || d === '') return undefined;
  if (typeof d === 'string') return parseTime(d) as unknown as TimeValue;
  return toTime(intlFromDate(d, zone(timeZone))) as unknown as TimeValue;
}

/** 5.0 date value -> 4.x Date at local midnight (or the zoned instant). */
export function toJsDate(v: DateValue | null | undefined, timeZone?: string): Date | null {
  if (!v) return null;
  return (v as unknown as { toDate: (tz: string) => Date }).toDate(zone(timeZone));
}
