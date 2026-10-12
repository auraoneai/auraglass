// Shared prop surface for ./date components (REQ-SURF-99).
/* REQ-CMP-01 / CMP-014: the public d.ts must not name the date foundation
   packages. These value types are AuraGlass-owned structural shapes: the
   date foundation's instances
   (CalendarDate, CalendarDateTime, ZonedDateTime, Time) satisfy them, and the
   components hand them to React Aria internally. Values the components emit
   are those same instances, so the methods below are always available. */

/* S-30 ChangeDetails from the public contract module, so the emitted d.ts never
   names the private foundation seam (REQ-CMP-01). */
import type { ChangeDetails } from '../contracts/components';

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
  /** Controlled value. Pair with `onValueChange`. */
  value?: V | null | undefined;
  /** Initial value when uncontrolled. */
  defaultValue?: V | null | undefined;
  /** Called with the new value whenever it changes. */
  onValueChange?: ((v: V | null, details: ChangeDetails) => void) | undefined;
  /** Earliest selectable date. */
  minValue?: V | undefined;
  /** Latest selectable date. */
  maxValue?: V | undefined;
  /** Marks a date unavailable (shown, not selectable). */
  isDateUnavailable?: ((date: DateValue) => boolean) | undefined;
  /** Smallest unit the value is edited in. */
  granularity?: 'day' | 'hour' | 'minute' | 'second' | undefined;
  /** 12- or 24-hour clock; the locale default when omitted. */
  hourCycle?: 12 | 24 | undefined;
  /** First day of the week; the locale default when omitted. */
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | undefined;
  /** BCP 47 locale used for formatting and parsing. */
  locale?: string | undefined;
  /** Text direction; defaults to the closest `[dir]` in the DOM (REQ-SURF-98). */
  dir?: 'ltr' | 'rtl' | undefined;
  /** Visible label. */
  label?: React.ReactNode;
  /** Helper text rendered under the label. */
  description?: React.ReactNode;
  /** Error message shown when the field is invalid. */
  errorMessage?: React.ReactNode;
  /** Marks the field invalid. */
  isInvalid?: boolean | undefined;
  /** Marks the field as required for form validation. */
  isRequired?: boolean | undefined;
  /** Disables interaction. */
  isDisabled?: boolean | undefined;
  /** Makes the value read-only while keeping it focusable. */
  isReadOnly?: boolean | undefined;
  /** Form field name submitted with the value. */
  name?: string | undefined;
  /** Control size. */
  size?: 'sm' | 'md' | 'lg' | undefined;
}
