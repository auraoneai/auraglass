/* src/charts/scale.ts (SURF-241..248, REQ-SURF-161): linear/band scales,
   y-extent resolution and the three curve generators.
   REQ-SURF-162 makes d3-scale/d3-shape the 5.1 optional peers imported only by
   src/charts/**; that needs the 5.1 contract PR plus their devDependencies
   (FIN-C, package.json). Until then these locals implement the same math:
   curveLinear, curveStep and an exact Fritsch-Carlson monotone cubic (the
   REQ-SURF-161 fallback), which never overshoots the data. */

export interface LinearScale {
  (v: number): number;
  domain(): [number, number];
  range(): [number, number];
  ticks(count?: number): number[];
}

export function linearScale(domain: [number, number], range: [number, number]): LinearScale {
  const f = (v: number) => range[0] + ((v - domain[0]) / (domain[1] - domain[0] || 1)) * (range[1] - range[0]);
  f.domain = () => domain;
  f.range = () => range;
  f.ticks = (count = 5) => {
    const [d0, d1] = domain;
    const step = (d1 - d0) / Math.max(1, count - 1);
    return Array.from({ length: count }, (_, i) => d0 + step * i);
  };
  return f;
}

export function bandScale(keys: readonly string[], range: [number, number], padding = 0.2) {
  const n = keys.length || 1;
  const span = range[1] - range[0];
  const band = span / n;
  const inner = band * (1 - padding);
  return {
    bandwidth: () => inner,
    x: (k: string) => range[0] + Math.max(0, keys.indexOf(k)) * band + (band - inner) / 2,
    center: (k: string) => range[0] + Math.max(0, keys.indexOf(k)) * band + band / 2,
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

/* Fritsch-Carlson monotone cubic Hermite tangents (Fritsch & Carlson 1980):
   secant slopes, averaged interior tangents (0 at local extrema and flat
   segments), then each segment's (alpha, beta) is pulled into the radius-3
   circle. Every control point then lies between its segment's end values, so
   the cubic stays inside the data extent. */
function monotoneTangents(pts: readonly Pt[]): number[] {
  const n = pts.length;
  const s: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = pts[i + 1]![0] - pts[i]![0];
    s.push(dx === 0 ? 0 : (pts[i + 1]![1] - pts[i]![1]) / dx);
  }
  const t: number[] = new Array<number>(n).fill(0);
  t[0] = s[0]!;
  t[n - 1] = s[n - 2]!;
  for (let i = 1; i < n - 1; i++) {
    t[i] = s[i - 1]! * s[i]! <= 0 ? 0 : (s[i - 1]! + s[i]!) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (s[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i]! / s[i]!;
    const b = t[i + 1]! / s[i]!;
    const h = a * a + b * b;
    if (h > 9) {
      const tau = 3 / Math.sqrt(h);
      t[i] = tau * a * s[i]!;
      t[i + 1] = tau * b * s[i]!;
    }
  }
  return t;
}

/* Path generators with d3-shape curve semantics: linear (curveLinear
   polyline), step (curveStep mid-point verticals), monotone (Fritsch-Carlson
   monotone cubic in x, as cubic Bezier segments). */
export function linePath(pts: readonly Pt[], curve: 'linear' | 'monotone' | 'step'): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M${pts[0]![0]},${pts[0]![1]}`;
  if (curve === 'linear') return `M${pts[0]![0]},${pts[0]![1]} ${pts.slice(1).map((p) => `L${p[0]},${p[1]}`).join(' ')}`;
  if (curve === 'step') {
    let d = `M${pts[0]![0]},${pts[0]![1]}`;
    for (let i = 1; i < pts.length; i++) {
      const mid = (pts[i - 1]![0] + pts[i]![0]) / 2;
      d += ` L${mid},${pts[i - 1]![1]} L${mid},${pts[i]![1]} L${pts[i]![0]},${pts[i]![1]}`;
    }
    return d;
  }
  const t = monotoneTangents(pts);
  let d = `M${pts[0]![0]},${pts[0]![1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[i + 1]!;
    const dx = (x1 - x0) / 3;
    d += ` C${x0 + dx},${y0 + t[i]! * dx} ${x1 - dx},${y1 - t[i + 1]! * dx} ${x1},${y1}`;
  }
  return d;
}
