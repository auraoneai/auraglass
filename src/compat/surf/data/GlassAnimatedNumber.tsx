/* GlassAnimatedNumber — 4.x compat adapter. The 5.0 StatCard renders the
   final value immediately (respecting reduced motion); animation is gone.
   The fallback format pins 'en-US' (StatCard's default locale) so server and
   client text match across host locales (REQ-SURF-08). */
'use client';
import { warnDeprecated } from '../../../internal';

export type GlassAnimatedNumberProps = {
  value: number;
  format?: (v: number) => string;
  duration?: number;
  decimals?: number;
};

export function GlassAnimatedNumber(props: GlassAnimatedNumberProps) {
  warnDeprecated('GlassAnimatedNumber');
  const { value, format, decimals } = props;
  const text = format ? format(value) : decimals !== undefined ? value.toFixed(decimals) : new Intl.NumberFormat('en-US').format(value);
  return <span data-ag-compat="GlassAnimatedNumber">{text}</span>;
}
