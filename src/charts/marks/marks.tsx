'use client';
/* marks/{Line,Area,Bar,Donut} — pure svg generators over the plot context. */
import * as React from 'react';
import { bandScale, extent, linePath, linearScale } from '../scale';
import type { ChartContext } from '../../data/chart-frame/types';
import type { ChartCurve } from '../types';

interface MarkProps<TRow> {
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

export function Donut<TRow>({ ctx, w, h, innerRadius = 0.55 }: MarkProps<TRow>) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2;
  const ir = r * innerRadius;
  const totals = ctx.visibleSeries.map((s) => ctx.data.reduce((a, d) => a + val(d, s.key), 0));
  const sum = totals.reduce((a, b) => a + b, 0) || 1;
  let a0 = -Math.PI / 2;
  const arcs = ctx.visibleSeries.map((s, i) => {
    const a1 = a0 + (totals[i]! / sum) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0); const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1); const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + ir * Math.cos(a1); const yi1 = cy + ir * Math.sin(a1);
    const xi0 = cx + ir * Math.cos(a0); const yi0 = cy + ir * Math.sin(a0);
    const d = `M${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} L${xi1},${yi1} A${ir},${ir} 0 ${large} 0 ${xi0},${yi0} Z`;
    a0 = a1;
    return <path key={s.key} d={d} fill={ctx.color(s.key)} />;
  });
  return <g data-ag-part="chart-mark-donut">{arcs}</g>;
}
