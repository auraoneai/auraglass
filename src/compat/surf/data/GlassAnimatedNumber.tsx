/* GlassAnimatedNumber — 4.x compat adapter (REQ-SURF-13, DEP-S0214). The
   5.0 successor is the StatCard value, which renders the final number
   immediately (no count-up animation; reduced motion is moot). This adapter
   keeps the 4.x inline placement: the final value formatted with decimals /
   separator / prefix / suffix (or formatter), as a single text span with the
   4.x aria-label. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';

export interface GlassAnimatedNumberProps {
  value: number;
  decimals?: number;
  separator?: boolean;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
  format?: (value: number) => string;
  className?: string;
  'aria-label'?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassAnimatedNumber` compat adapter (DEP-S0214).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link StatCard value from aura-glass/data}.
 */
export function GlassAnimatedNumber(props: GlassAnimatedNumberProps) {
  warnDeprecated('DEP-S0214');
  const { value, decimals, separator = true, prefix = '', suffix = '', formatter, format, className } = props;
  const fmt = formatter ?? format;
  const body = fmt
    ? fmt(value)
    : new Intl.NumberFormat(undefined, {
        useGrouping: separator,
        ...(decimals !== undefined ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals } : {}),
      }).format(value);
  return (
    <span {...(className ? { className } : {})} {...(props['aria-label'] ? { 'aria-label': props['aria-label'] } : {})}>
      {prefix}
      {body}
      {suffix}
    </span>
  );
}
