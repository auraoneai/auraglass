'use client';
import { warnDeprecated } from '../../../internal';
import { Calendar } from '../../../date/Calendar';
import type { CalendarProps } from '../../../date/Calendar';
import { toDateValue } from './shared';
import type { DateValue } from '@internationalized/date';

export type GlassCalendarProps = {
  value?: Date;
  defaultValue?: Date;
  onChange?: (d: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  weekNumbers?: boolean;
  timeZone?: string;
} & Omit<CalendarProps, 'value' | 'defaultValue' | 'onChange' | 'minValue' | 'maxValue' | 'showWeekNumbers'>;

export function GlassCalendar(props: GlassCalendarProps) {
  warnDeprecated('DEP-S0667');
  const { value, defaultValue, onChange, minDate, maxDate, weekNumbers, timeZone, ...rest } = props;
  return (
    <Calendar
      {...rest}
      value={value ? (toDateValue(value, timeZone) as never) : undefined}
      defaultValue={defaultValue ? (toDateValue(defaultValue, timeZone) as never) : undefined}
      onValueChange={onChange ? (v: DateValue | null) => onChange(v ? new Date(v.toString()) : null) : undefined}
      minValue={minDate ? (toDateValue(minDate, timeZone) as never) : undefined}
      maxValue={maxDate ? (toDateValue(maxDate, timeZone) as never) : undefined}
      showWeekNumbers={weekNumbers}
    />
  );
}
