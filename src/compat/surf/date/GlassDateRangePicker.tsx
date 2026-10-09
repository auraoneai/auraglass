'use client';
import { warnDeprecated } from '../../../internal';
import { DateRangePicker } from '../../../date/DateRangePicker';
import type { DateRangePickerProps } from '../../../date/DateRangePicker';
import { toDateValue } from './shared';
import type { DateValue } from '@internationalized/date';
import type { DateRangeValue } from '../../../date/DateRangePicker';

/** @deprecated GlassDateRangePickerProps DEP-S0668 since 4.2.0, removed in 6.0.0. */
export type GlassDateRangePickerProps = {
  startDate?: Date;
  endDate?: Date;
  value?: { start: Date; end: Date };
  defaultValue?: { start: Date; end: Date };
  onChange?: (r: { start: Date; end: Date } | null) => void;
  timeZone?: string;
} & Omit<DateRangePickerProps, 'value' | 'defaultValue' | 'onChange'>;

export function GlassDateRangePicker(props: GlassDateRangePickerProps) {
  warnDeprecated('DEP-S0668');
  const { startDate, endDate, value, defaultValue, onChange, timeZone, ...rest } = props;
  const v = value ?? (startDate && endDate ? { start: startDate, end: endDate } : undefined);
  const to5 = (r: { start: Date; end: Date } | undefined): DateRangeValue | undefined =>
    r ? { start: toDateValue(r.start, timeZone) as never, end: toDateValue(r.end, timeZone) as never } : undefined;
  return (
    <DateRangePicker
      {...rest}
      value={to5(v)}
      defaultValue={to5(defaultValue)}
      onValueChange={onChange ? (r) => onChange(r ? { start: new Date(r.start.toString()), end: new Date(r.end.toString()) } : null) : undefined}
    />
  );
}
