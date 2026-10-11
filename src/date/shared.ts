// Shared prop surface for ./date components (REQ-SURF-99).
/* REQ-CMP-01 / CMP-014: the public d.ts must not name the date foundation
   packages. These value types are AuraGlass-owned structural shapes: the
   date foundation's instances
   (CalendarDate, CalendarDateTime, ZonedDateTime, Time) satisfy them, and the
   components hand them to React Aria internally. Values the components emit
   are those same instances, so the methods below are always available. */

import type { toChangeDetails } from '../foundation';
/** S-30 ChangeDetails, via the CMP foundation seam (no contracts/ specifier in src). */
type ChangeDetails = ReturnType<typeof toChangeDetails>;

export interface DateCalendar {
  /** CLDR calendar identifier, e.g. 'gregory'. */
  readonly identifier: string;
}

export interface DateDuration {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
}

export interface TimeDuration {
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export interface DateTimeDuration extends DateDuration, TimeDuration {}

export interface DateFields {
  era?: string;
  year?: number;
  month?: number;
  day?: number;
}

export interface TimeFields {
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
}

/** Calendar date without a time (structurally the date foundation's CalendarDate). */
export interface CalendarDate {
  readonly calendar: DateCalendar;
  readonly era: string;
  readonly year: number;
  readonly month: number;
  readonly day: number;
  copy(): CalendarDate;
  add(duration: DateDuration): CalendarDate;
  subtract(duration: DateDuration): CalendarDate;
  set(fields: DateFields): CalendarDate;
  toDate(timeZone: string): Date;
  toString(): string;
}

/** Wall-clock time without a date (structurally the date foundation's Time). */
export interface Time {
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly millisecond: number;
  copy(): Time;
  add(duration: TimeDuration): Time;
  subtract(duration: TimeDuration): Time;
  set(fields: TimeFields): Time;
  toString(): string;
}

/** Date + time without a zone (structurally the date foundation's CalendarDateTime). */
export interface CalendarDateTime {
  readonly calendar: DateCalendar;
  readonly era: string;
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly millisecond: number;
  copy(): CalendarDateTime;
  add(duration: DateTimeDuration): CalendarDateTime;
  subtract(duration: DateTimeDuration): CalendarDateTime;
  set(fields: DateFields & TimeFields): CalendarDateTime;
  toDate(timeZone: string): Date;
  toString(): string;
}

/** Date + time in a zone (structurally the date foundation's ZonedDateTime). */
export interface ZonedDateTime {
  readonly calendar: DateCalendar;
  readonly era: string;
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly millisecond: number;
  readonly timeZone: string;
  readonly offset: number;
  copy(): ZonedDateTime;
  add(duration: DateTimeDuration): ZonedDateTime;
  subtract(duration: DateTimeDuration): ZonedDateTime;
  set(fields: DateFields & TimeFields): ZonedDateTime;
  toDate(): Date;
  toString(): string;
  toAbsoluteString(): string;
}

export type DateValue = CalendarDate | CalendarDateTime | ZonedDateTime;
export type TimeValue = Time | CalendarDateTime | ZonedDateTime;

/**
 * S-30 ChangeDetails for a React Aria `onChange`: RA passes the value only (no
 * event), so `event` is undefined and the reason is 'change'. A fresh object
 * per call (never a shared mutable instance).
 */
export function raChangeDetails(): ChangeDetails {
  return { event: undefined, reason: 'change' };
}

export interface DateFieldLikeProps<V extends DateValue | TimeValue = DateValue> {
  value?: V | null | undefined;
  defaultValue?: V | null | undefined;
  onValueChange?: ((v: V | null, details: ChangeDetails) => void) | undefined;
  minValue?: V | undefined;
  maxValue?: V | undefined;
  isDateUnavailable?: ((date: DateValue) => boolean) | undefined;
  granularity?: 'day' | 'hour' | 'minute' | 'second' | undefined;
  hourCycle?: 12 | 24 | undefined;
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | undefined;
  locale?: string | undefined;
  label?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  isInvalid?: boolean | undefined;
  isRequired?: boolean | undefined;
  isDisabled?: boolean | undefined;
  isReadOnly?: boolean | undefined;
  name?: string | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
}
