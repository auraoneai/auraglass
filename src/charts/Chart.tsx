'use client';
/* Chart<TRow> (SURF-241, REQ-SURF-161..163): every ChartFrame prop + type/
   stacked/orientation/curve/yDomain/grid/tooltip. Renders inside a
   ChartFrame and implements ChartAdapter — static output is
   server-renderable (ctx.width undefined → viewBox fallback). */
import * as React from 'react';
import { ChartFrame } from '../data/chart-frame/ChartFrame';
import type { ChartContext } from '../data/chart-frame/types';
import { ChartTooltip } from './ChartTooltip';
import { Area, Bar, Donut, Line } from './marks/marks';
import type { ChartProps, PlotProps } from './types';

const VIEW_W = 640;
const VIEW_H = 240;

function Plot<TRow>({ ctx, type, stacked, orientation, curve, yDomain, grid, tooltip, labelledBy, xKey }: PlotProps<TRow> & { xKey: string }) {
  const w = ctx.width ?? VIEW_W;
  const h = ctx.height;
  const [focus, setFocus] = React.useState<number | null>(null);
  const [pending, setPending] = React.useState<string | null>(null);
  const lastAnnounce = React.useRef(0);
  const pendingText = React.useRef<string | null>(null);
  const liveRef = React.useRef<HTMLSpanElement | null>(null);

  const describe = (i: number) => {
    const d = ctx.data[i];
    if (d === undefined) return '';
    return `${ctx.formatX((d as Record<string, unknown>)[xKey])}: ${ctx.visibleSeries.map((s) => `${s.label} ${ctx.formatY((d as Record<string, unknown>)[s.key], s)}`).join(', ')}`;
  };

  const announce = (text: string) => {
    const now = Date.now();
    if (now - lastAnnounce.current >= 150) {
      lastAnnounce.current = now;
      pendingText.current = null;
      setPending(text);
    } else {
      pendingText.current = text;
    }
  };

  const flush = () => {
    if (pendingText.current !== null) {
      lastAnnounce.current = Date.now();
      setPending(pendingText.current);
      pendingText.current = null;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const n = ctx.data.length;
    if (n === 0) return;
    const next = focus === null
      ? (e.key === 'ArrowRight' ? 0 : n - 1)
      : (focus + (e.key === 'ArrowRight' ? 1 : -1) + n) % n;
    setFocus(next);
    announce(describe(next));
  };

  const mark = type === 'line' ? <Line ctx={ctx} w={w} h={h} curve={curve} xKey={xKey} />
    : type === 'area' ? <Area ctx={ctx} w={w} h={h} curve={curve} stacked={stacked} xKey={xKey} />
    : type === 'bar' ? <Bar ctx={ctx} w={w} h={h} stacked={stacked} orientation={orientation} xKey={xKey} />
    : <Donut ctx={ctx} w={w} h={h} xKey={xKey} />;

  return (
    <div className="ag-chart__plot-inner" style={{ position: 'relative' }}>
      <svg
        data-ag-part="chart-plot-svg"
        role="group"
        aria-roledescription="chart"
        aria-labelledby={labelledBy}
        tabIndex={0}
        width="100%"
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        onKeyDown={onKeyDown}
        onKeyUp={flush}
        onBlur={flush}
        className="ag-chart__svg"
      >
        {grid === true && type !== 'donut' ? (
          <g data-ag-part="chart-grid" className="ag-chart__grid" aria-hidden="true">
            {[0.25, 0.5, 0.75].map((f) => (
              <line key={f} x1={0} x2={w} y1={h * f} y2={h * f} className="ag-chart__grid-line" />
            ))}
          </g>
        ) : null}
        {mark}
        {focus !== null && type !== 'donut' ? (
          <line
            data-ag-part="chart-focus-cursor"
            x1={(w / Math.max(1, ctx.data.length)) * (focus + 0.5)}
            x2={(w / Math.max(1, ctx.data.length)) * (focus + 0.5)}
            y1={0}
            y2={h}
            className="ag-chart__cursor"
          />
        ) : null}
      </svg>
      {tooltip === true ? <ChartTooltip ctx={ctx} index={focus} x={focus !== null ? (w / Math.max(1, ctx.data.length)) * (focus + 0.5) : 0} xKey={xKey} /> : null}
      <span ref={liveRef} role="status" aria-live="polite" className="ag-visually-hidden">
        {pending}
      </span>
    </div>
  );
}

export function Chart<TRow extends Record<string, unknown>>({
  type = 'line',
  stacked,
  orientation,
  curve = 'linear',
  yDomain = 'auto',
  grid,
  tooltip,
  title,
  ...frame
}: ChartProps<TRow>) {
  const titleId = React.useId();
  return (
    <ChartFrame title={title} {...frame}>
      {(ctx) => (
        <Plot
          ctx={ctx as ChartContext<TRow>}
          type={type}
          stacked={stacked}
          orientation={orientation}
          curve={curve}
          yDomain={yDomain}
          grid={grid}
          tooltip={tooltip}
          labelledBy={titleId}
          xKey={frame.x.key}
        />
      )}
    </ChartFrame>
  );
}
