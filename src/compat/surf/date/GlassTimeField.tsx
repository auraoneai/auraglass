'use client';
import { warnDeprecated } from '../../../internal';
import { TimeField } from '../../../date/TimePicker';
import type { TimeFieldProps } from '../../../date/TimePicker';
import { toDateValue } from './shared';

/** @deprecated GlassTimeFieldProps DEP-S0669 since 4.2.0, removed in 6.0.0. */
export type GlassTimeFieldProps = {
  value?: Date;
  defaultValue?: Date;
  onChange?: (d: Date | null) => void;
  timeZone?: string;
} & Omit<TimeFieldProps, 'value' | 'defaultValue' | 'onChange'>;

export function GlassTimeField(props: GlassTimeFieldProps) {
  warnDeprecated('DEP-S0669');
  const { value, defaultValue, onChange, timeZone, ...rest } = props;
  return (
    <TimeField
      {...rest}
      value={value ? (toDateValue(value, timeZone) as never) : undefined}
      defaultValue={defaultValue ? (toDateValue(defaultValue, timeZone) as never) : undefined}
      onValueChange={onChange ? (v) => onChange(v ? new Date(v.toString()) : null) : undefined}
    />
  );
}
