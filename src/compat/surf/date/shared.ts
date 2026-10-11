'use client';
/* 4.x Date/string ↔ 5.0 date-value bridge for the date compat adapters
   (REQ-SURF-13). 4.x `Date` values convert client-side with
   fromDate(date, getLocalTimeZone()) (PRD-4 REQ-SURF-13); on the server the
   local zone is unknowable, so `timeZone` is required there. 4.x
   GlassDateField/GlassTimeField were native inputs whose values were ISO
   strings ('2026-09-18', '09:30'); those parse with parseDate/parseTime.
   Date-only adapters use CalendarDate so the 5.0 field shows day
   granularity. Public signatures use the AuraGlass-owned date value types
   (REQ-CMP-01: no date-foundation types in the emitted d.ts). */
import {
  fromDate as intlFromDate,
  getLocalTimeZone as intlGetLocalTimeZone,
  parseDate,
  parseTime,
  toCalendarDate as intlToCalendarDate,
  toTime,
} from '@internationalized/date';
import type * as React from 'react';
import type { CalendarDate, DateValue, TimeValue, ZonedDateTime } from '../../../date/shared';

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

export type FirstDay = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
const DAYS: FirstDay[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export interface LegacyFieldProps {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorMessage?: React.ReactNode;
  error?: boolean | string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  locale?: string;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

/** Shared 4.x field props -> DateFieldLikeProps (label, description, error, flags). */
export function fieldProps(p: LegacyFieldProps): Record<string, unknown> {
  const err = typeof p.error === 'string' ? p.error : p.errorMessage;
  return {
    ...(p.label !== undefined ? { label: p.label } : {}),
    ...(p.helperText !== undefined ? { description: p.helperText } : {}),
    ...(err !== undefined ? { errorMessage: err } : {}),
    ...(p.error ? { isInvalid: true } : {}),
    ...(p.required ? { isRequired: true } : {}),
    ...(p.disabled ? { isDisabled: true } : {}),
    ...(p.readOnly ? { isReadOnly: true } : {}),
    ...(p.name !== undefined ? { name: p.name } : {}),
    ...(p.size !== undefined ? { size: p.size } : {}),
    ...(p.locale !== undefined ? { locale: p.locale } : {}),
    ...(p.firstDayOfWeek !== undefined ? { firstDayOfWeek: DAYS[p.firstDayOfWeek] } : {}),
  };
}
