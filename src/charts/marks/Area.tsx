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

export function Area<TRow>({ ctx, xKey, w, h, curve = 'linear', stacked }: MarkProps<TRow>) {
  const keys = ctx.data.map((d) => String(ctx.formatX((d as Record<string, unknown>)[xKey])));
  const xs = bandScale(keys, [0, w]);
  const stacks = ctx.data.map((d) => {
    let acc = 0;
    return ctx.visibleSeries.map((s) => { const v = val(d, s.key); acc += stacked ? v : 0; return { base: acc, v }; });
  });
  const ys = linearScale(extent(stacks.flat().map((s) => s.base + s.v)), [h, 0]);
  return (
    <g data-ag-part="chart-mark-area">
      {ctx.visibleSeries.map((s, si) => {
        const top = ctx.data.map((d, i) => [xs.center(String(ctx.formatX((d as Record<string, unknown>)[xKey]))), ys(stacks[i]![si]!.base + stacks[i]![si]!.v)] as const);
        const bot = ctx.data.map((d, i) => [xs.center(String(ctx.formatX((d as Record<string, unknown>)[xKey]))), ys(stacks[i]![si]!.base)] as const);
        const d = `${linePath(top, curve)} ${bot.slice().reverse().map((p) => `L${p[0]},${p[1]}`).join(' ')} Z`;
        return <path key={s.key} d={d} fill={ctx.color(s.key)} fillOpacity={0.35} stroke={ctx.color(s.key)} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />;
      })}
    </g>
  );
}
