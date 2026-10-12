/* GlassTimeField — 4.x compat adapter (REQ-SURF-13, DEP-S0221) → TimeField.
   4.x GlassTimeField was a native <input type="time">: value/defaultValue
   were 'HH:mm' strings (Date also accepted) and onChange received the input
   change event. Values parse to Time; onChange receives an event-shaped
   object whose target.value is 'HH:mm' ('' when cleared). label (4.x
   default "Time"), helperText, error, required, disabled map through
   ./shared fieldProps. The mapping lives in ./GlassTimeField.impl, loaded on
   first render (../lazyAdapter) so importing aura-glass/compat never evaluates the
   optional date peers. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { lazyAdapter } from '../lazyAdapter';
import type { LegacyFieldProps } from './shared';

export interface GlassTimeFieldProps extends LegacyFieldProps {
  value?: string | Date | null;
  defaultValue?: string | Date | null;
  onChange?: (event: { target: { value: string }; currentTarget: { value: string } }) => void;
  timeZone?: string;
  className?: string;
  [legacy: string]: unknown;
}

const Impl = /*#__PURE__*/ lazyAdapter<GlassTimeFieldProps>(() => import('./GlassTimeField.impl').then((m) => m.GlassTimeFieldImpl));

/**
 * 4.x `GlassTimeField` compat adapter (DEP-S0221).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link TimeField from aura-glass/date}.
 */
export function GlassTimeField(props: GlassTimeFieldProps) {
  warnDeprecated('DEP-S0221');
  return <Impl.Render {...props} />;
}
