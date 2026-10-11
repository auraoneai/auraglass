/* GlassDatePicker — 4.x compat adapter (REQ-SURF-13, DEP-S0222) →
   DatePicker. value/defaultValue (Date | null) → CalendarDate via
   fromDate(date, getLocalTimeZone()) client-side (`timeZone` required on the
   server); onChange(Date | null) at local midnight; minDate/maxDate →
   minValue/maxValue; disabledDates (Date[] or predicate) →
   isDateUnavailable; firstDayOfWeek 0..6 → 'sun'..'sat'; helperText,
   error/errorMessage, required, disabled, size via ./shared fieldProps.
   mode="range" consumers move to DateRangePicker (GlassDateRangePicker);
   placeholder becomes the label when no label is given (the 5.0 field needs
   an accessible name); format/today/clear buttons are locale- and
   component-owned in 5.0 and are dropped. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { DatePicker } from '../../../date/DatePicker';
import type { DateValue } from '../../../date/shared';
import { fieldProps, toCalendarDate, toJsDate, type LegacyFieldProps } from './shared';

export interface GlassDatePickerProps extends LegacyFieldProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[] | ((date: Date) => boolean);
  timeZone?: string;
  className?: string;
  [legacy: string]: unknown;
}

export function unavailable(disabledDates: GlassDatePickerProps['disabledDates'], timeZone?: string) {
  if (!disabledDates) return undefined;
  return (d: DateValue) => {
    const js = toJsDate(d, timeZone)!;
    if (typeof disabledDates === 'function') return disabledDates(js);
    const day = d.toString().slice(0, 10);
    return disabledDates.some((x) => toCalendarDate(x, timeZone)!.toString() === day);
  };
}

/**
 * 4.x `GlassDatePicker` compat adapter (DEP-S0222).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link DatePicker from aura-glass/date}.
 */
export function GlassDatePicker(props: GlassDatePickerProps) {
  warnDeprecated('DEP-S0222');
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
