# ChartFrame adapters (SURF-531)

`ChartFrame` (from `aura-glass/data`) is the accessible shell — title,
legend, data table and colours — around a chart engine you supply. The
engine is an **adapter**: either a render function `(ctx) => ReactNode`
(`ChartAdapter<TRow>`, client components only) or a client component that
reads the same `ChartContext<TRow>` through `ChartFrame.useContext()` (the
RSC-safe form). The three adapters below are examples; none of these
libraries is added to the aura-glass dependency set.

Rule that applies to every adapter: **register the engine inside the
component (or its effect), never at module scope** — module-scope
registration breaks SSR (no `window`/`ResizeObserver`) and leaks state
between frames.

## Recharts 2.x

Recharts is declarative; the adapter maps the context to its component
tree inside `ChartFrame`:

```tsx
'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import type { ChartAdapter } from 'aura-glass/data';

type Row = { month: string; revenue: number; cost: number };

export const rechartsAdapter: ChartAdapter<Row> = (ctx) => (
  // Mapping happens in render, not module scope: colours come from the
  // frame's context, not a file-level constant.
  <LineChart data={[...ctx.data]} width={ctx.width ?? 640} height={ctx.height}>
    <XAxis dataKey="month" tickFormatter={ctx.formatX} />
    <YAxis tickFormatter={(v) => ctx.formatY(v)} />
    <Tooltip />
    {ctx.visibleSeries.map((s) => (
      <Line key={s.key} dataKey={s.key} stroke={ctx.color(s.key)} dot={false} isAnimationActive={!ctx.reducedMotion} />
    ))}
  </LineChart>
);
```

## visx

visx is lower-level; build scales from the context on every render:

```tsx
'use client';
import { scaleLinear } from '@visx/scale';
import { ChartFrame } from 'aura-glass/data';

type Row = { x: number; y: number };

export function VisxPoints() {
  const ctx = ChartFrame.useContext<Row>();
  // Engine handles live inside the component — no shared module-level scales.
  const width = ctx.width ?? 640;
  const x = scaleLinear({ domain: [0, Math.max(1, ...ctx.data.map((d) => d.x))], range: [0, width] });
  const y = scaleLinear({ domain: [0, Math.max(1, ...ctx.data.map((d) => d.y))], range: [ctx.height, 0] });
  return (
    <svg width={width} height={ctx.height} aria-hidden="true">
      {ctx.data.map((d, i) => <circle key={i} cx={x(d.x)} cy={y(d.y)} r={3} fill={ctx.color('y')} />)}
    </svg>
  );
}
```

## chart.js 4

Chart.js mutates a canvas in place; the adapter owns the instance and
creates it in an effect:

```tsx
'use client';
import * as React from 'react';
import { Chart, registerables } from 'chart.js';
import { ChartFrame } from 'aura-glass/data';

type Row = { label: string; value: number };

export function ChartJsBars() {
  const ctx = ChartFrame.useContext<Row>();
  const canvas = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (!canvas.current) return;
    // Registration + Chart construction INSIDE the effect — module-scope
    // `Chart.register(...)` breaks SSR and is flagged.
    Chart.register(...registerables);
    const chart = new Chart(canvas.current, {
      type: 'bar',
      data: {
        labels: ctx.data.map((d) => d.label),
        datasets: ctx.visibleSeries.map((s) => ({ label: s.label, data: ctx.data.map((d) => d.value), backgroundColor: ctx.color(s.key) })),
      },
      options: { animation: ctx.reducedMotion ? false : undefined },
    });
    return () => chart.destroy();
  }, [ctx]);
  return <canvas ref={canvas} width={ctx.width} height={ctx.height} aria-hidden="true" />;
}
```

Use a context-reading adapter as the frame's child, from a Server
Component as well:

```tsx
import { ChartFrame } from 'aura-glass/data';
import { ChartJsBars } from './ChartJsBars';

export function Revenue({ rows }: { rows: { label: string; value: number }[] }) {
  return (
    <ChartFrame title="Revenue" data={rows} series={[{ key: 'value', label: 'Revenue' }]} x={{ key: 'label', label: 'Month' }}>
      <ChartJsBars />
    </ChartFrame>
  );
}
```

## Versions

The examples target these engine versions:

- `recharts` 2.15.x
- `@visx/scale` + friends 3.12.x
- `chart.js` 4.5.x
