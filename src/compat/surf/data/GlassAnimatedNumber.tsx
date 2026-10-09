/* GlassAnimatedNumber — 4.x compat adapter. The 5.0 StatCard renders the
   final value immediately (respecting reduced motion); animation is gone. */
'use client';
import { warnDeprecated } from '../../../internal';

export type GlassAnimatedNumberProps = {
  value: number;
  format?: (v: number) => string;
  duration?: number;
  decimals?: number;
};

export function GlassAnimatedNumber(props: GlassAnimatedNumberProps) {
  warnDeprecated('DEP-S0633');
  const { value, format, decimals } = props;
  const text = format ? format(value) : decimals !== undefined ? value.toFixed(decimals) : new Intl.NumberFormat().format(value);
  return <span data-ag-compat="GlassAnimatedNumber">{text}</span>;
}
