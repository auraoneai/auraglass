/* GlassDateRangePicker — 4.x compat adapter (REQ-SURF-13, DEP-S0223) →
   DateRangePicker. value/defaultValue {from, to} (legacy startDate/endDate
   accepted) → {start, end} CalendarDates; onChange({from, to}) with local
   Dates; presets [{label, getValue()}] → [{label, value}]; minDate/maxDate,
   disabled, size, locale via ./shared. placeholder/rangeLabel become the
   field label (the 5.0 field needs an accessible name); showClear and
   dateFormat are component/locale-owned in 5.0. The mapping lives in
   ./GlassDateRangePicker.impl, loaded on first render (../lazyAdapter) so importing
   aura-glass/compat never evaluates the optional date peers. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { lazyAdapter } from '../lazyAdapter';
import type { LegacyFieldProps } from './shared';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface GlassDateRangePickerProps extends LegacyFieldProps {
  value?: DateRange;
  defaultValue?: DateRange;
  startDate?: Date;
  endDate?: Date;
  onChange?: (range: DateRange) => void;
  presets?: { label: string; getValue: () => DateRange }[];
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  rangeLabel?: string;
  timeZone?: string;
  className?: string;
  [legacy: string]: unknown;
}

const Impl = lazyAdapter<GlassDateRangePickerProps>(
  () => import('./GlassDateRangePicker.impl').then((m) => m.GlassDateRangePickerImpl),
);

/**
 * 4.x `GlassDateRangePicker` compat adapter (DEP-S0223).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link DateRangePicker from aura-glass/date}.
 */
export function GlassDateRangePicker(props: GlassDateRangePickerProps) {
  warnDeprecated('DEP-S0223');
  return <Impl.Render {...props} />;
}
