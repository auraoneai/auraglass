# ChartFrame adapters (SURF-531)

`ChartFrame` renders a `ChartSpec` through a renderer you supply. The three
adapters below were verified against the docs-app type-check lane (pinned
versions live in the docs app only — **none of these libraries is added to
the aura-glass dependency set**).

Rule that applies to every adapter: **register the engine inside the
component (or `mount`), never at module scope** — module-scope registration
breaks SSR (no `window`/`ResizeObserver`) and leaks state between frames.

## Recharts 2.x

Recharts is declarative; the adapter renders `ChartSpec` to its component
tree inside `ChartFrame`'s slot:

```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import type { ChartSpec } from 'aura-glass/charts';

export function RechartsAdapter({ spec }: { spec: ChartSpec }) {
  // Mapping happens in render, not module scope: the theme tokens come
  // from the frame's provider, not a file-level constant.
  const series = spec.encodings.map((e) => (
    <Line key={e.field} dataKey={e.field} stroke="var(--ag-chart-series, currentColor)" dot={false} />
  ));
  return (
    <LineChart data={spec.data} width={spec.width} height={spec.height}>
      <XAxis dataKey={spec.encodings[0]?.field} />
      <YAxis />
      <Tooltip />
      {series}
    </LineChart>
  );
}
```

## visx

visx is lower-level; mount scales once and update via `update`:

```ts
import { scaleLinear } from '@visx/scale';
import type { ChartRenderer } from 'aura-glass/charts';

export const visxRenderer: ChartRenderer = {
  mount(el, spec) {
    // Engine handles live inside mount — no shared module-level scales.
    const y = scaleLinear({ domain: spec.yDomain, range: [spec.height, 0] });
    const render = (s: ChartSpec) => {
      el.replaceChildren(buildPoints(s, y));
    };
    render(spec);
    return {
      update: render,
      resize: () => y.range([spec.height, 0]),
      destroy: () => el.replaceChildren(),
    };
  },
};
```

## chart.js 4

Chart.js mutates a canvas in place; the adapter owns the instance:

```ts
import { Chart, registerables } from 'chart.js';
import type { ChartRenderer } from 'aura-glass/charts';

export const chartJsRenderer: ChartRenderer = {
  mount(el, spec) {
    // registerables registration + Chart construction INSIDE mount —
    // module-scope `Chart.register(...)` breaks SSR and is flagged.
    Chart.register(...registerables);
    const canvas = document.createElement('canvas');
    el.append(canvas);
    const chart = new Chart(canvas, toChartJsConfig(spec));
    return {
      update: (s) => { chart.data = toChartJsConfig(s).data; chart.update(); },
      resize: (w, h) => chart.resize(w, h),
      destroy: () => { chart.destroy(); canvas.remove(); },
    };
  },
};
```

## Verification

Each adapter is exercised by `tests/capability/registry/` conformance rows
plus the docs-app type-check (React 19, strict mode). The pinned versions
the examples were verified against:

- `recharts` 2.15.x
- `@visx/scale` + friends 3.12.x
- `chart.js` 4.5.x
