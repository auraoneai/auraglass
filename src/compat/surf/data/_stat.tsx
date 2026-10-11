/* Shared 4.x stat-card mapping for GlassStatCard / GlassKPICard /
   GlassMetricCard (REQ-SURF-13). title → label, value (string values such as
   '$45,231' are kept verbatim; numbers are formatted by StatCard) + unit,
   description, trend {value,direction} or trend + trendPercentage → delta,
   sparklineData (with showSparkline) → sparkline, loading, onClick is dropped
   (StatCard takes `href` for navigation). */
import * as React from 'react';
import { StatCard } from '../../../data/stat-card/StatCard';

export interface LegacyStatProps {
  title?: string;
  label?: string;
  value?: string | number;
  unit?: string;
  description?: string;
  trend?: { value: number; label?: string; direction: 'up' | 'down' | 'neutral' } | 'up' | 'down' | 'neutral' | 'none';
  trendPercentage?: number;
  trendLabel?: string;
  showSparkline?: boolean;
  sparklineData?: number[];
  loading?: boolean;
  formatValue?: (value: string | number) => string;
  className?: string;
  [legacy: string]: unknown;
}

export function renderLegacyStat(props: LegacyStatProps): React.ReactElement {
  const { title, label, value = 0, unit, description, trend, trendPercentage, trendLabel, showSparkline, sparklineData, loading, formatValue } = props;
  // 4.x trend values are percentage points (12.5 = 12.5 %); StatCard's delta
  // is a fraction formatted with style:'percent'.
  let delta: number | undefined;
  let deltaLabel: string | undefined = trendLabel;
  if (trend && typeof trend === 'object') {
    const pct = Math.abs(trend.value) / 100;
    delta = trend.direction === 'down' ? -pct : trend.direction === 'neutral' ? 0 : pct;
    deltaLabel = trend.label ?? deltaLabel;
  } else if (trendPercentage !== undefined && trend !== 'none') {
    const pct = Math.abs(trendPercentage) / 100;
    delta = trend === 'down' ? -pct : trend === 'neutral' ? 0 : pct;
  }
  const base = formatValue ? formatValue(value) : value;
  const shown: number | React.ReactNode = typeof base === 'number' && !unit ? base : <>{base}{unit}</>;
  return (
    <StatCard
      label={label ?? title ?? ''}
      value={shown}
      {...(description !== undefined ? { description } : {})}
      {...(delta !== undefined ? { delta, trendDirection: 'up-is-good' as const } : {})}
      {...(deltaLabel !== undefined && delta !== undefined ? { deltaLabel } : {})}
      {...(showSparkline !== false && sparklineData ? { sparkline: sparklineData } : {})}
      {...(loading ? { loading: true } : {})}
    />
  );
}
