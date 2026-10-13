/* src/charts/scale.ts (SURF-241..248, REQ-SURF-161/-162): linear/band
   scales, y-extent resolution and the line/area path generators, backed by
   the 5.1 optional peers d3-scale ^4.0.2 and d3-shape ^3.2.0 — imported
   only under src/charts/** and externalized in the build through
   package.json peerDependencies (tsdown externals). The peers load through
   dynamic import() (loadScales) rather than a static import: d3-scale and
   d3-shape are ESM-only, and the contract story loader (S-35/S-41) loads
   story modules with require(), which cannot load ESM from a CJS graph on
   the pinned CI Node. ChartPlot (the client island, invoked only once the
   frame is measured) suspends on the cached load promise, so the static
   server output (frame, placeholder, table fallback) never touches d3.
   Importing aura-glass/charts without the peers fails at resolution; run
   `npx aura-glass doctor` for the install hint (charts-peers check).
   Curves: curveLinear, curveStep and curveMonotoneX (Steffen monotone
   cubic in x, which never overshoots the data). */
import type { scaleBand, scaleLinear } from 'd3-scale';
import type { area, curveLinear, curveMonotoneX, curveStep, line } from 'd3-shape';

interface D3Peer {
  scaleBand: typeof scaleBand;
  scaleLinear: typeof scaleLinear;
  area: typeof area;
  curveLinear: typeof curveLinear;
  curveMonotoneX: typeof curveMonotoneX;
  curveStep: typeof curveStep;
  line: typeof line;
}

export interface LinearScale {
  (v: number): number;
  domain(): [number, number];
  range(): [number, number];
  ticks(count?: number): number[];
}

export interface BandScale {
  bandwidth(): number;
  x(k: string): number;
  center(k: string): number;
  keys: readonly string[];
}

type Pt = readonly [number, number];

export type ChartCurveName = 'linear' | 'monotone' | 'step';

/** The d3-backed scale/path factory set ChartPlot hands to the marks. */
export interface ChartScales {
  linearScale(domain: [number, number], range: [number, number]): LinearScale;
  bandScale(keys: readonly string[], range: [number, number], padding?: number): BandScale;
  linePath(pts: readonly Pt[], curve: ChartCurveName): string;
  areaPath(top: readonly Pt[], bot: readonly Pt[], curve: ChartCurveName): string;
}

function createScales(d3: D3Peer): ChartScales {
  const CURVES = { linear: d3.curveLinear, monotone: d3.curveMonotoneX, step: d3.curveStep } as const;
  return {
    linearScale(domain, range) {
      const s = d3.scaleLinear().domain(domain).range(range);
      const f = ((v: number) => s(v)) as LinearScale;
      f.domain = () => s.domain() as [number, number];
      f.range = () => s.range() as [number, number];
      f.ticks = (count = 5) => s.ticks(count);
      return f;
    },
    bandScale(keys, range, padding = 0.2) {
      // paddingOuter = padding/2 centres each band in its step (step = span/n),
      // so center(k) is the step centre: x(k) + bandwidth/2.
      const s = d3.scaleBand<string>()
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
    },
    linePath(pts, curve) {
      if (pts.length === 0) return '';
      const gen = d3.line<Pt>().x((p) => p[0]).y((p) => p[1]).curve(CURVES[curve]);
      return gen(pts) ?? '';
    },
    areaPath(top, bot, curve) {
      if (top.length === 0 || bot.length === 0) return '';
      const gen = d3.area<Pt>()
        .x((p) => p[0])
        .y1((p) => p[1])
        .y0((_p, i) => bot[Math.min(i, bot.length - 1)]![1])
        .curve(CURVES[curve]);
      return gen(top) ?? '';
    },
  };
}

let scalesPromise: Promise<ChartScales> | null = null;
let settledScales: ChartScales | null = null;

/** Loads the d3 peers once (dynamic import: ESM-only peers, see header) and
    caches the scale factory set for every later Chart. */
export function loadScales(): Promise<ChartScales> {
  scalesPromise ??= Promise.all([import('d3-scale'), import('d3-shape')]).then(([s, sh]) => {
    settledScales = createScales({
      scaleBand: s.scaleBand,
      scaleLinear: s.scaleLinear,
      area: sh.area,
      curveLinear: sh.curveLinear,
      curveMonotoneX: sh.curveMonotoneX,
      curveStep: sh.curveStep,
      line: sh.line,
    });
    return settledScales;
  });
  return scalesPromise;
}

/** The settled scale set once loadScales() has resolved, else null. Lets a
    Chart mounted after the first load render its marks synchronously. */
export function getCachedScales(): ChartScales | null {
  return settledScales;
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
