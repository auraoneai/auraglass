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
   component-owned in 5.0 and are dropped. The mapping lives in
   ./GlassDatePicker.impl, loaded on first render (../lazyAdapter) so importing
   aura-glass/compat never evaluates the optional date peers. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { lazyAdapter } from '../lazyAdapter';
import type { LegacyFieldProps } from './shared';

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

const Impl = lazyAdapter<GlassDatePickerProps>(() => import('./GlassDatePicker.impl').then((m) => m.GlassDatePickerImpl));

/**
 * 4.x `GlassDatePicker` compat adapter (DEP-S0222).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link DatePicker from aura-glass/date}.
 */
export function GlassDatePicker(props: GlassDatePickerProps) {
  warnDeprecated('DEP-S0222');
  return <Impl.Render {...props} />;
}
