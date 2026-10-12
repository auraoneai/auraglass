/* GlassDateField implementation — loaded on first render by ./GlassDateField
   (../lazyAdapter: keeps the optional date peers out of the compat import graph).
   4.x GlassDateField was a native <input type="date">: value/defaultValue
   were 'YYYY-MM-DD' strings (Date also accepted) and onChange received the
   input change event. Values parse to CalendarDate; onChange receives an
   event-shaped object whose target.value is the ISO date string ('' when
   cleared). label (4.x default "Date"), helperText, error, required,
   disabled map through ./shared fieldProps. */
import * as React from 'react';
import { DateField } from '../../../date/DateField';
import type { DateValue } from '../../../date/shared';
import { fieldProps, legacyChange, toCalendarDate } from './shared';
import type { GlassDateFieldProps } from './GlassDateField';

export function GlassDateFieldImpl(props: GlassDateFieldProps) {
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
