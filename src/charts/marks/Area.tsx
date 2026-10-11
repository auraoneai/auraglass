/* marks/{Line,Area,Bar,Donut} — pure svg generators over the plot context;
   server-safe (no directive, no hooks), rendered by the ChartPlot island. */
import * as React from 'react';
import { bandScale, linePath, linearScale, yExtent } from '../scale';
import { val, type MarkProps } from './types';

export function Area<TRow>({ ctx, xKey, w, h, curve = 'linear', stacked, yDomain }: MarkProps<TRow>) {
  const keys = ctx.data.map((d) => String(ctx.formatX((d as Record<string, unknown>)[xKey])));
  const xs = bandScale(keys, [0, w]);
  const stacks = ctx.data.map((d) => {
    let acc = 0;
    return ctx.visibleSeries.map((s) => { const v = val(d, s.key); acc += stacked ? v : 0; return { base: acc, v }; });
  });
  const ys = linearScale(yExtent(stacks.flat().map((s) => s.base + s.v), yDomain), [h, 0]);
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
