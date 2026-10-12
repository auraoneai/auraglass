/* GlassDateField — 4.x compat adapter (REQ-SURF-13, DEP-S0220) → DateField.
   4.x GlassDateField was a native <input type="date">: value/defaultValue
   were 'YYYY-MM-DD' strings (Date also accepted) and onChange received the
   input change event. Values parse to CalendarDate; onChange receives an
   event-shaped object whose target.value is the ISO date string ('' when
   cleared). label (4.x default "Date"), helperText, error, required,
   disabled map through ./shared fieldProps. The mapping lives in
   ./GlassDateField.impl, loaded on first render (../lazyAdapter) so importing
   aura-glass/compat never evaluates the optional date peers. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { lazyAdapter } from '../lazyAdapter';
import type { LegacyFieldProps } from './shared';

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

const Impl = /*#__PURE__*/ lazyAdapter<GlassDateFieldProps>(() => import('./GlassDateField.impl').then((m) => m.GlassDateFieldImpl));

/**
 * 4.x `GlassDateField` compat adapter (DEP-S0220).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link DateField from aura-glass/date}.
 */
export function GlassDateField(props: GlassDateFieldProps) {
  warnDeprecated('DEP-S0220');
  return <Impl.Render {...props} />;
}
