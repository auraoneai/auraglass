'use client';
/* ChartPlot — the client island of Chart (REQ-SURF-161/-163). ChartClient
   composes the ChartFrame render-prop (kept on the client side of the RSC
   boundary); ChartPlot owns the keyboard datum cursor, the pointer crosshair
   and the polite live region. The marks it renders are pure functions of the
   ChartFrame context.
   - One tab stop: the <svg> is role="group" + aria-roledescription="chart",
     labelled by an element carrying the frame title (aria-labelledby resolves).
   - ArrowLeft/ArrowRight/Home/End move the focused datum (clamped at the ends);
     the x value and every visible series value are announced politely with a
     true 150 ms trailing debounce: a burst of key presses yields one
     announcement of the last datum.
   - pointermove over the plot moves the crosshair and the tooltip to the
     nearest datum; pointerleave hides them. Pointer moves never announce. */
import * as React from 'react';
import { ChartFrame } from '../data/chart-frame/ChartFrame';
import type { ChartContext } from '../data/chart-frame/types';
import { ChartTooltip } from './ChartTooltip';
import { Area } from './marks/Area';
import { Bar } from './marks/Bar';
import { Donut } from './marks/Donut';
import { Line } from './marks/Line';
import type { ChartProps, PlotProps } from './types';

const VIEW_W = 640;
/** Trailing debounce for the datum announcement (REQ-SURF-163). */
export const ANNOUNCE_DEBOUNCE_MS = 150;

export function ChartPlot<TRow>({ ctx, type, stacked, orientation, curve, yDomain, grid, tooltip, title, xKey }: PlotProps<TRow>) {
  const w = ctx.width ?? VIEW_W;
  const h = ctx.height;
  const n = ctx.data.length;
  const labelId = React.useId();
  const [focus, setFocus] = React.useState<number | null>(null);
  const [hover, setHover] = React.useState<number | null>(null);
  const [live, setLive] = React.useState('');
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
  }, []);

  const describe = (i: number) => {
    const d = ctx.data[i] as Record<string, unknown> | undefined;
    if (d === undefined) return '';
    return `${ctx.formatX(d[xKey])}: ${ctx.visibleSeries.map((s) => `${s.label} ${ctx.formatY(d[s.key], s)}`).join(', ')}`;
  };

  const announce = (text: string) => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      setLive(text);
    }, ANNOUNCE_DEBOUNCE_MS);
  };

  const onKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (n === 0) return;
    let next: number;
    switch (e.key) {
      case 'ArrowRight': next = focus === null ? 0 : Math.min(n - 1, focus + 1); break;
      case 'ArrowLeft': next = focus === null ? n - 1 : Math.max(0, focus - 1); break;
      case 'Home': next = 0; break;
      case 'End': next = n - 1; break;
      default: return;
    }
    e.preventDefault();
    setFocus(next);
    announce(describe(next));
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (n === 0 || type === 'donut') return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || !Number.isFinite(e.clientX)) return;
    const i = Math.floor(((e.clientX - rect.left) / rect.width) * n);
    setHover(Math.min(n - 1, Math.max(0, i)));
  };

  const active = hover ?? focus;
  const cursorX = active !== null ? (w / Math.max(1, n)) * (active + 0.5) : 0;

  const mark = type === 'line' ? <Line ctx={ctx} w={w} h={h} curve={curve} yDomain={yDomain} xKey={xKey} />
    : type === 'area' ? <Area ctx={ctx} w={w} h={h} curve={curve} stacked={stacked} yDomain={yDomain} xKey={xKey} />
    : type === 'bar' ? <Bar ctx={ctx} w={w} h={h} stacked={stacked} orientation={orientation} yDomain={yDomain} xKey={xKey} />
    : <Donut ctx={ctx} w={w} h={h} xKey={xKey} />;

  return (
    <div className="ag-chart__plot-inner" style={{ position: 'relative' }}>
      <span id={labelId} hidden>{title}</span>
      <svg
        data-ag-part="chart-plot-svg"
        role="group"
        aria-roledescription="chart"
        aria-labelledby={labelId}
        tabIndex={0}
        width="100%"
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        onKeyDown={onKeyDown}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHover(null)}
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
        {active !== null && type !== 'donut' ? (
          <line data-ag-part="chart-focus-cursor" x1={cursorX} x2={cursorX} y1={0} y2={h} className="ag-chart__cursor" />
        ) : null}
      </svg>
      {tooltip === true ? <ChartTooltip ctx={ctx} index={active} x={cursorX} xKey={xKey} /> : null}
      <span role="status" aria-live="polite" className="ag-visually-hidden">
        {live}
      </span>
    </div>
  );
}

/** The client half of Chart: composes the ChartFrame with the ChartPlot
    render-prop. The function child is created here, inside the client graph,
    so it never crosses the RSC boundary into ChartFrame.Interactive; the
    server-safe Chart wrapper passes only serialisable props. */
export function ChartClient<TRow extends Record<string, unknown>>({
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
  return (
    <ChartFrame title={title} {...frame}>
      {(ctx) => (
        <ChartPlot
          ctx={ctx as ChartContext<TRow>}
          type={type}
          stacked={stacked}
          orientation={orientation}
          curve={curve}
          yDomain={yDomain}
          grid={grid}
          tooltip={tooltip}
          title={title}
          xKey={frame.x.key}
        />
      )}
    </ChartFrame>
  );
}
