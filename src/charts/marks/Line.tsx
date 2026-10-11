/* marks/{Line,Area,Bar,Donut} — pure svg generators over the plot context;
   server-safe (no directive, no hooks), rendered by the ChartPlot island. */
import * as React from 'react';
import { bandScale, linePath, linearScale, yExtent } from '../scale';
import { val, type MarkProps } from './types';

export function Line<TRow>({ ctx, xKey, w, h, curve = 'linear', yDomain }: MarkProps<TRow>) {
  const keys = ctx.data.map((d) => String(ctx.formatX((d as Record<string, unknown>)[xKey])));
  const xs = bandScale(keys, [0, w]);
  const ys = linearScale(yExtent(ctx.visibleSeries.flatMap((s) => ctx.data.map((d) => val(d, s.key))), yDomain), [h, 0]);
  return (
    <g data-ag-part="chart-mark-line">
      {ctx.visibleSeries.map((s) => (
        <path key={s.key} d={linePath(ctx.data.map((d) => [xs.center(String(ctx.formatX((d as Record<string, unknown>)[xKey]))), ys(val(d, s.key))] as const), curve)}
          fill="none" stroke={ctx.color(s.key)} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      ))}
    </g>
  );
}
