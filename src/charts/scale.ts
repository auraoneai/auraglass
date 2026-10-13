/* src/charts/scale.ts (SURF-241..248, REQ-SURF-161/-162): linear/band
   scales, y-extent resolution and the line/area path generators, backed by
   the 5.1 optional peers d3-scale ^4.0.2 and d3-shape ^3.2.0 — imported
   only under src/charts/** and externalized in the build through
   package.json peerDependencies (tsdown externals). Importing
   aura-glass/charts without the peers fails at resolution; run
   `npx aura-glass doctor` for the install hint (charts-peers check).
   Curves: curveLinear, curveStep and curveMonotoneX (Steffen monotone
   cubic in x, which never overshoots the data). */
import { scaleBand, scaleLinear } from 'd3-scale';
import { area, curveLinear, curveMonotoneX, curveStep, line } from 'd3-shape';

export interface LinearScale {
  (v: number): number;
  domain(): [number, number];
  range(): [number, number];
  ticks(count?: number): number[];
}

export function linearScale(domain: [number, number], range: [number, number]): LinearScale {
  const s = scaleLinear().domain(domain).range(range);
  const f = ((v: number) => s(v)) as LinearScale;
  f.domain = () => s.domain() as [number, number];
  f.range = () => s.range() as [number, number];
  f.ticks = (count = 5) => s.ticks(count);
  return f;
}

export function bandScale(keys: readonly string[], range: [number, number], padding = 0.2) {
  // paddingOuter = padding/2 centres each band in its step (step = span/n),
  // so center(k) is the step centre: x(k) + bandwidth/2.
  const s = scaleBand<string>()
    .domain(keys.length ? [...keys] : [''])
    .range(range)
    .paddingInner(padding)
    .paddingOuter(padding / 2);
  const x = (k: string) => s(k) ?? s(keys[0] ?? '') ?? range[0];
  return {
    bandwidth: () => s.bandwidth(),
    x,
    center: (k: string) => x(k) + s.bandwidth() / 2,
    keys,
  };
}

export function extent(values: readonly number[]): [number, number] {
  let lo = Infinity;
  let hi = -Infinity;
  for (const v of values) {
    if (!Number.isFinite(v)) continue;
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  if (!Number.isFinite(lo)) return [0, 1];
  if (lo === hi) return [lo - 1, hi + 1];
  return [Math.min(0, lo), hi];
}

/** y-scale domain for a mark: a fixed `yDomain` tuple wins (normalised to
    [min, max]); 'auto', or a degenerate/non-finite tuple, uses the data extent. */
export function yExtent(values: readonly number[], yDomain: readonly [number, number] | 'auto' | undefined): [number, number] {
  if (yDomain !== undefined && yDomain !== 'auto') {
    const [a, b] = yDomain;
    if (Number.isFinite(a) && Number.isFinite(b) && a !== b) return a < b ? [a, b] : [b, a];
  }
  return extent(values);
}

type Pt = readonly [number, number];

export type ChartCurveName = 'linear' | 'monotone' | 'step';

const CURVES = { linear: curveLinear, monotone: curveMonotoneX, step: curveStep } as const;

/** d3-shape line generator with the named curve over [x, y] points. */
export function linePath(pts: readonly Pt[], curve: ChartCurveName): string {
  if (pts.length === 0) return '';
  const gen = line<Pt>().x((p) => p[0]).y((p) => p[1]).curve(CURVES[curve]);
  return gen(pts) ?? '';
}

/** d3-shape area generator between the `top` and `bot` point rows (paired
    by index) with the named curve on the top edge. */
export function areaPath(top: readonly Pt[], bot: readonly Pt[], curve: ChartCurveName): string {
  if (top.length === 0 || bot.length === 0) return '';
  const gen = area<Pt>()
    .x((p) => p[0])
    .y1((p) => p[1])
    .y0((_p, i) => bot[Math.min(i, bot.length - 1)]![1])
    .curve(CURVES[curve]);
  return gen(top) ?? '';
}
