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

export function Line<TRow>({ ctx, xKey, w, h, curve = 'linear' }: MarkProps<TRow>) {
  const keys = ctx.data.map((d) => String(ctx.formatX((d as Record<string, unknown>)[xKey])));
  const xs = bandScale(keys, [0, w]);
  const ys = linearScale(extent(ctx.visibleSeries.flatMap((s) => ctx.data.map((d) => val(d, s.key)))), [h, 0]);
  return (
    <g data-ag-part="chart-mark-line">
      {ctx.visibleSeries.map((s) => (
        <path key={s.key} d={linePath(ctx.data.map((d) => [xs.center(String(ctx.formatX((d as Record<string, unknown>)[xKey]))), ys(val(d, s.key))] as const), curve)}
          fill="none" stroke={ctx.color(s.key)} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      ))}
    </g>
  );
}
