/* GlassDatePicker implementation — loaded on first render by
   ./GlassDatePicker (../lazyAdapter: keeps the optional date peers out of the compat
   import graph). value/defaultValue (Date | null) → CalendarDate via
   fromDate(date, getLocalTimeZone()) client-side (`timeZone` required on the
   server); onChange(Date | null) at local midnight; minDate/maxDate →
   minValue/maxValue; disabledDates (Date[] or predicate) →
   isDateUnavailable; firstDayOfWeek 0..6 → 'sun'..'sat'; helperText,
   error/errorMessage, required, disabled, size via ./shared fieldProps.
   placeholder becomes the label when no label is given (the 5.0 field needs
   an accessible name). */
'use client';
import * as React from 'react';
import { DatePicker } from '../../../date/DatePicker';
import type { DateValue } from '../../../date/shared';
import { fieldProps, toCalendarDate, toJsDate } from './shared';
import type { GlassDatePickerProps } from './GlassDatePicker';

export function unavailable(disabledDates: GlassDatePickerProps['disabledDates'], timeZone?: string) {
  if (!disabledDates) return undefined;
  return (d: DateValue) => {
    const js = toJsDate(d, timeZone)!;
    if (typeof disabledDates === 'function') return disabledDates(js);
    const day = d.toString().slice(0, 10);
    return disabledDates.some((x) => toCalendarDate(x, timeZone)!.toString() === day);
  };
}

export function GlassDatePickerImpl(props: GlassDatePickerProps) {
  const { value, defaultValue, onChange, minDate, maxDate, disabledDates, timeZone, className } = props;
  const v = toCalendarDate(value, timeZone);
  const dv = toCalendarDate(defaultValue, timeZone);
  const minV = toCalendarDate(minDate, timeZone);
  const maxV = toCalendarDate(maxDate, timeZone);
  const isUnavailable = unavailable(disabledDates, timeZone);
  // 4.x had only a placeholder; the 5.0 field needs a label for its
  // accessible name, so the placeholder text becomes the label.
  const label = props.label ?? (typeof props['placeholder'] === 'string' ? props['placeholder'] : 'Date');
  return (
    <DatePicker
      {...fieldProps({ ...props, label })}
      {...(value !== undefined ? { value: v ?? null } : {})}
      {...(dv ? { defaultValue: dv } : {})}
      {...(minV ? { minValue: minV } : {})}
      {...(maxV ? { maxValue: maxV } : {})}
      {...(isUnavailable ? { isDateUnavailable: isUnavailable } : {})}
      {...(onChange ? { onValueChange: (next: DateValue | null) => onChange(toJsDate(next, timeZone)) } : {})}
      {...(className ? { className } : {})}
    />
  );
}
