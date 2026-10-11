/* GlassDateRangePicker — 4.x compat adapter (REQ-SURF-13, DEP-S0223) →
   DateRangePicker. value/defaultValue {from, to} (legacy startDate/endDate
   accepted) → {start, end} CalendarDates; onChange({from, to}) with local
   Dates; presets [{label, getValue()}] → [{label, value}]; minDate/maxDate,
   disabled, size, locale via ./shared. placeholder/rangeLabel become the
   field label (the 5.0 field needs an accessible name); showClear and
   dateFormat are component/locale-owned in 5.0. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { DateRangePicker, type DateRangeValue } from '../../../date/DateRangePicker';
import { fieldProps, toCalendarDate, toJsDate, type LegacyFieldProps } from './shared';

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

function to5(r: DateRange | undefined, tz?: string): DateRangeValue | undefined {
  const start = toCalendarDate(r?.from, tz);
  const end = toCalendarDate(r?.to, tz);
  return start && end ? { start, end } : undefined;
}

/**
 * 4.x `GlassDateRangePicker` compat adapter (DEP-S0223).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link DateRangePicker from aura-glass/date}.
 */
export function GlassDateRangePicker(props: GlassDateRangePickerProps) {
  warnDeprecated('DEP-S0223');
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
