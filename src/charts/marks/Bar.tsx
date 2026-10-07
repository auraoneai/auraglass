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

export function Bar<TRow>({ ctx, xKey, w, h, stacked, orientation }: MarkProps<TRow>) {
  const keys = ctx.data.map((d) => String(ctx.formatX((d as Record<string, unknown>)[xKey])));
  const horizontal = orientation === 'horizontal';
  const bandAxis = bandScale(keys, [0, horizontal ? h : w]);
  const totals = ctx.data.map((d) => ctx.visibleSeries.reduce((s, ser) => s + val(d, ser.key), 0));
  const maxes = stacked === true ? totals : ctx.data.map((d) => Math.max(...ctx.visibleSeries.map((s) => val(d, s.key))));
  const valAxis = linearScale(extent(maxes), [0, horizontal ? w : h]);
  const per = ctx.visibleSeries.length || 1;
  const barW = stacked === true ? bandAxis.bandwidth() : bandAxis.bandwidth() / per;
  const rects: React.ReactNode[] = [];
  ctx.data.forEach((d, di) => {
    let acc = 0;
    ctx.visibleSeries.forEach((s, si) => {
      const v = val(d, s.key);
      const len = valAxis(v);
      const base = valAxis(acc);
      const pos = bandAxis.x(String(ctx.formatX((d as Record<string, unknown>)[xKey]))) + (stacked === true ? 0 : si * barW);
      rects.push(
        <rect
          key={`${s.key}-${di}`}
          x={horizontal ? (stacked === true ? base : 0) : pos}
          y={horizontal ? pos : (h - (stacked === true ? base + len : len))}
          width={horizontal ? (stacked === true ? len : valAxis(v)) : barW}
          height={horizontal ? barW : (stacked === true ? len : valAxis(v))}
          fill={ctx.color(s.key)}
        />,
      );
      acc += v;
    });
  });
  return <g data-ag-part="chart-mark-bar">{rects}</g>;
}
