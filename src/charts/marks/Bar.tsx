/* marks/{Line,Area,Bar,Donut} — pure svg generators over the plot context;
   server-safe (no directive, no hooks), rendered by the ChartPlot island. */
import * as React from 'react';
import { bandScale, linearScale, yExtent } from '../scale';
import { val, type MarkProps } from './types';

export function Bar<TRow>({ ctx, xKey, w, h, stacked, orientation, yDomain }: MarkProps<TRow>) {
  const keys = ctx.data.map((d) => String(ctx.formatX((d as Record<string, unknown>)[xKey])));
  const horizontal = orientation === 'horizontal';
  const bandAxis = bandScale(keys, [0, horizontal ? h : w]);
  const totals = ctx.data.map((d) => ctx.visibleSeries.reduce((s, ser) => s + val(d, ser.key), 0));
  const maxes = stacked === true ? totals : ctx.data.map((d) => Math.max(...ctx.visibleSeries.map((s) => val(d, s.key))));
  const valAxis = linearScale(yExtent(maxes, yDomain), [0, horizontal ? w : h]);
  const per = ctx.visibleSeries.length || 1;
  const barW = stacked === true ? bandAxis.bandwidth() : bandAxis.bandwidth() / per;
  const rects: React.ReactNode[] = [];
  ctx.data.forEach((d, di) => {
    let acc = 0;
    ctx.visibleSeries.forEach((s, si) => {
      const v = val(d, s.key);
      // Stacked segments span [acc, acc + v]; grouped bars span [domain min, v].
      // Lengths clamp at 0 when a fixed yDomain sits above the value.
      const base = stacked === true ? Math.max(0, valAxis(acc)) : 0;
      const len = Math.max(0, (stacked === true ? valAxis(acc + v) : valAxis(v)) - base);
      const pos = bandAxis.x(String(ctx.formatX((d as Record<string, unknown>)[xKey]))) + (stacked === true ? 0 : si * barW);
      rects.push(
        <rect
          key={`${s.key}-${di}`}
          x={horizontal ? base : pos}
          y={horizontal ? pos : h - (base + len)}
          width={horizontal ? len : barW}
          height={horizontal ? barW : len}
          fill={ctx.color(s.key)}
        />,
      );
      acc += v;
    });
  });
  return <g data-ag-part="chart-mark-bar">{rects}</g>;
}
