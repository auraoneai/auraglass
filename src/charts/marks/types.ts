/* Shared mark props + value reader for marks/{Line,Area,Bar,Donut}. */
import type { ChartContext } from '../../data/chart-frame/types';
import type { ChartCurve } from '../types';

export interface MarkProps<TRow> {
  ctx: ChartContext<TRow>;
  xKey: string;
  w: number;
  h: number;
  curve?: ChartCurve | undefined;
  stacked?: boolean | undefined;
  orientation?: 'horizontal' | 'vertical' | undefined;
  innerRadius?: number | undefined;
  /** Fixed y extent ([min, max]) or 'auto' (data extent). REQ-SURF-161. */
  yDomain?: readonly [number, number] | 'auto' | undefined;
}

export function val(d: unknown, key: string): number {
  const v = (d as Record<string, unknown>)[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}
