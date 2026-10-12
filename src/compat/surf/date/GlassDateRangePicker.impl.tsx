/* GlassDateRangePicker implementation — loaded on first render by
   ./GlassDateRangePicker (../lazyAdapter: keeps the optional date peers out of the
   compat import graph). value/defaultValue {from, to} (legacy
   startDate/endDate accepted) → {start, end} CalendarDates; onChange({from,
   to}) with local Dates; presets [{label, getValue()}] → [{label, value}];
   minDate/maxDate, disabled, size, locale via ./shared.
   placeholder/rangeLabel become the field label (the 5.0 field needs an
   accessible name). */
'use client';
import * as React from 'react';
import { DateRangePicker, type DateRangeValue } from '../../../date/DateRangePicker';
import { fieldProps, toCalendarDate, toJsDate } from './shared';
import type { DateRange, GlassDateRangePickerProps } from './GlassDateRangePicker';

function to5(r: DateRange | undefined, tz?: string): DateRangeValue | undefined {
  const start = toCalendarDate(r?.from, tz);
  const end = toCalendarDate(r?.to, tz);
  return start && end ? { start, end } : undefined;
}

export function GlassDateRangePickerImpl(props: GlassDateRangePickerProps) {
  const { value, defaultValue, startDate, endDate, onChange, presets, minDate, maxDate, placeholder, rangeLabel, timeZone, className } = props;
  const legacy = value ?? (startDate && endDate ? { from: startDate, to: endDate } : undefined);
  const v = to5(legacy, timeZone);
  const dv = to5(defaultValue, timeZone);
  const minV = toCalendarDate(minDate, timeZone);
  const maxV = toCalendarDate(maxDate, timeZone);
  const presetList = React.useMemo(
    () => (presets ?? []).flatMap((p) => {
      const pv = to5(p.getValue(), timeZone);
      return pv ? [{ label: p.label, value: pv }] : [];
    }),
    [presets, timeZone],
  );
  const label = props.label ?? rangeLabel ?? placeholder ?? 'Date range';
  return (
    <DateRangePicker
      {...fieldProps({ ...props, label })}
      {...(legacy !== undefined ? { value: v ?? null } : {})}
      {...(dv ? { defaultValue: dv } : {})}
      {...(minV ? { minValue: minV } : {})}
      {...(maxV ? { maxValue: maxV } : {})}
      {...(presetList.length ? { presets: presetList } : {})}
      {...(onChange
        ? {
            onValueChange: (r: DateRangeValue | null) =>
              onChange({ from: toJsDate(r?.start ?? null, timeZone), to: toJsDate(r?.end ?? null, timeZone) }),
          }
        : {})}
      {...(className ? { className } : {})}
    />
  );
}
