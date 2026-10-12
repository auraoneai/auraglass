/* GlassTimeField implementation — loaded on first render by ./GlassTimeField
   (../lazyAdapter: keeps the optional date peers out of the compat import graph).
   4.x GlassTimeField was a native <input type="time">: value/defaultValue
   were 'HH:mm' strings (Date also accepted) and onChange received the input
   change event. Values parse to Time; onChange receives an event-shaped
   object whose target.value is 'HH:mm' ('' when cleared). label (4.x
   default "Time"), helperText, error, required, disabled map through
   ./shared fieldProps. */
import * as React from 'react';
import { TimeField } from '../../../date/TimePicker';
import type { TimeValue } from '../../../date/shared';
import { fieldProps, legacyChange, toTimeValue } from './shared';
import type { GlassTimeFieldProps } from './GlassTimeField';

export function GlassTimeFieldImpl(props: GlassTimeFieldProps) {
  const { value, defaultValue, onChange, timeZone, className, label = 'Time' } = props;
  const v = toTimeValue(value, timeZone);
  const dv = toTimeValue(defaultValue, timeZone);
  return (
    <TimeField
      {...fieldProps({ ...props, label })}
      {...(value !== undefined ? { value: v ?? null } : {})}
      {...(dv ? { defaultValue: dv } : {})}
      {...(onChange ? { onValueChange: (next: TimeValue | null) => onChange(legacyChange(next ? next.toString().slice(0, 5) : '')) } : {})}
      {...(className ? { className } : {})}
    />
  );
}
