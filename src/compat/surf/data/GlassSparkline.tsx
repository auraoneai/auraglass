/* GlassSparkline — 4.x compat adapter (REQ-SURF-13, DEP-S0215) → Sparkline.
   data/width/height map 1:1 (legacy `values` accepted); fill → variant
   'area'; stroke/fill colours are token-owned in 5.0 (intent) and dropped;
   the 4.x SVG had no accessible name, so the adapter supplies the 5.0
   default label. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Sparkline } from '../../../data/sparkline/Sparkline';

export interface GlassSparklineProps {
  data?: number[];
  values?: number[];
  width?: number | string;
  height?: number;
  fill?: string;
  label?: string;
  'aria-label'?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassSparkline` compat adapter (DEP-S0215).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Sparkline from aura-glass/data}.
 */
export function GlassSparkline(props: GlassSparklineProps) {
  warnDeprecated('DEP-S0215');
  const { data, values, width, height, fill, label } = props;
  return (
    <Sparkline
      data={data ?? values ?? []}
      label={label ?? props['aria-label'] ?? 'Trend'}
      {...(width !== undefined ? { width } : {})}
      {...(height !== undefined ? { height } : {})}
      {...(fill !== undefined && fill !== 'none' ? { variant: 'area' as const } : {})}
    />
  );
}
