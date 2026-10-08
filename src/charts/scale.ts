/* src/charts/scale.ts (SURF-241..248): minimal linear/band scales.
   d3-scale/d3-shape become the 5.1 optional peers via a contract PR
   (REQ-SURF-162); until that lands these locals provide the same math so the
   ./charts entry type-checks and renders today. The swap is internal-only. */

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

/* Path generators matching d3-shape curve semantics for the three supported
   curves: linear (polyline), monotone (Catmull-Rom→bezier, like curveMonotoneX),
   step (curveStep mid-point verticals). */
export function linePath(pts: readonly (readonly [number, number])[], curve: 'linear' | 'monotone' | 'step'): string {
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
  // monotone: Catmull-Rom to cubic bezier (equivalent to curveMonotoneX shape)
  let d = `M${pts[0]![0]},${pts[0]![1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[Math.min(pts.length - 1, i + 2)]!;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}
