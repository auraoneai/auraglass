'use client';
/* marks/{Line,Area,Bar,Donut} — pure svg generators over the plot context. */
import * as React from 'react';
import { bandScale, extent, linePath, linearScale } from '../scale';
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
}

function val(d: unknown, key: string): number {
  const v = (d as Record<string, unknown>)[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

export function Donut<TRow>({ ctx, w, h, innerRadius = 0.55 }: MarkProps<TRow>) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2;
  const ir = r * innerRadius;
  const totals = ctx.visibleSeries.map((s) => ctx.data.reduce((a, d) => a + val(d, s.key), 0));
  const sum = totals.reduce((a, b) => a + b, 0) || 1;
  const starts = totals.map((_, i) => totals.slice(0, i).reduce((a, b) => a + b, 0));
  const arcs = ctx.visibleSeries.map((s, i) => {
    const a0 = -Math.PI / 2 + (starts[i]! / sum) * Math.PI * 2;
    const a1 = a0 + (totals[i]! / sum) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0); const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1); const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + ir * Math.cos(a1); const yi1 = cy + ir * Math.sin(a1);
    const xi0 = cx + ir * Math.cos(a0); const yi0 = cy + ir * Math.sin(a0);
    const d = `M${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} L${xi1},${yi1} A${ir},${ir} 0 ${large} 0 ${xi0},${yi0} Z`;
    return <path key={s.key} d={d} fill={ctx.color(s.key)} />;
  });
  return <g data-ag-part="chart-mark-donut">{arcs}</g>;
}
