'use client';
import { warnDeprecated } from '../../../internal';
import { DatePicker } from '../../../date/DatePicker';
import type { DatePickerProps } from '../../../date/DatePicker';
import { toDateValue } from './shared';
import type { DateValue } from '@internationalized/date';

export type GlassDatePickerProps = {
  value?: Date;
  defaultValue?: Date;
  onChange?: (d: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (d: Date) => boolean;
  disabled?: boolean;
  required?: boolean;
  error?: boolean | string;
  helperText?: string;
  /** 4.x `format` prop is removed — locale drives display. It is accepted
      only to surface the deprecation warning, then ignored. */
  format?: string;
  timeZone?: string;
} & Omit<DatePickerProps, 'value' | 'defaultValue' | 'onChange' | 'minValue' | 'maxValue' | 'isDateUnavailable' | 'isDisabled' | 'isRequired' | 'isInvalid' | 'description'>;

export function GlassDatePicker(props: GlassDatePickerProps) {
  warnDeprecated('GlassDatePicker');
  const { value, defaultValue, onChange, minDate, maxDate, disabledDates, disabled, required, error, helperText, format, timeZone, ...rest } = props;
  void format;
  return (
    <DatePicker
      {...rest}
      value={value ? (toDateValue(value, timeZone) as never) : undefined}
      defaultValue={defaultValue ? (toDateValue(defaultValue, timeZone) as never) : undefined}
      onValueChange={onChange ? (v) => onChange(v ? new Date(v.toString()) : null) : undefined}
      minValue={minDate ? (toDateValue(minDate, timeZone) as never) : undefined}
      maxValue={maxDate ? (toDateValue(maxDate, timeZone) as never) : undefined}
      isDateUnavailable={disabledDates ? (v: DateValue) => disabledDates(new Date(v.toString())) : undefined}
      isDisabled={disabled}
      isRequired={required}
      isInvalid={typeof error === 'boolean' ? error : error !== undefined}
      description={helperText}
    />
  );
}
