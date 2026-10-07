'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { DateField } from '../../../date/DateField';
import type { DateFieldProps } from '../../../date/DateField';
import { toDateValue } from './shared';

export type GlassDateFieldProps = {
  value?: Date;
  defaultValue?: Date;
  onChange?: (d: Date | null) => void;
  timeZone?: string;
} & Omit<DateFieldProps, 'value' | 'defaultValue' | 'onChange'>;

export function GlassDateField(props: GlassDateFieldProps) {
  warnDeprecated('GlassDateField');
  const { value, defaultValue, onChange, timeZone, ...rest } = props;
  return (
    <DateField
      {...rest}
      value={value ? (toDateValue(value, timeZone) as never) : undefined}
      defaultValue={defaultValue ? (toDateValue(defaultValue, timeZone) as never) : undefined}
      onValueChange={onChange ? (v) => onChange(v ? new Date(v.toString()) : null) : undefined}
    />
  );
}
