/* GlassDateField — 4.x compat adapter (REQ-SURF-13, DEP-S0220) → DateField.
   4.x GlassDateField was a native <input type="date">: value/defaultValue
   were 'YYYY-MM-DD' strings (Date also accepted) and onChange received the
   input change event. Values parse to CalendarDate; onChange receives an
   event-shaped object whose target.value is the ISO date string ('' when
   cleared). label (4.x default "Date"), helperText, error, required,
   disabled map through ./shared fieldProps. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { DateField } from '../../../date/DateField';
import type { DateValue } from '../../../date/shared';
import { fieldProps, toCalendarDate, type LegacyFieldProps } from './shared';

export interface GlassDateFieldProps extends LegacyFieldProps {
  value?: string | Date | null;
  defaultValue?: string | Date | null;
  onChange?: (event: { target: { value: string }; currentTarget: { value: string } }) => void;
  min?: string;
  max?: string;
  timeZone?: string;
  className?: string;
  [legacy: string]: unknown;
}

export function legacyChange(value: string) {
  return { target: { value }, currentTarget: { value } };
}

/**
 * 4.x `GlassDateField` compat adapter (DEP-S0220).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link DateField from aura-glass/date}.
 */
export function GlassDateField(props: GlassDateFieldProps) {
  warnDeprecated('DEP-S0220');
  const { value, defaultValue, onChange, min, max, timeZone, className, label = 'Date' } = props;
  const v = toCalendarDate(value, timeZone);
  const dv = toCalendarDate(defaultValue, timeZone);
  const minV = toCalendarDate(min, timeZone);
  const maxV = toCalendarDate(max, timeZone);
  return (
    <DateField
      {...fieldProps({ ...props, label })}
      {...(value !== undefined ? { value: v ?? null } : {})}
      {...(dv ? { defaultValue: dv } : {})}
      {...(minV ? { minValue: minV } : {})}
      {...(maxV ? { maxValue: maxV } : {})}
      {...(onChange ? { onValueChange: (next: DateValue | null) => onChange(legacyChange(next ? next.toString().slice(0, 10) : '')) } : {})}
      {...(className ? { className } : {})}
    />
  );
}
