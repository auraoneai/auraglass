/**
 * Pure ResizablePanels layout math (SURF-001).
 * All sizes are percentages; a layout always sums to 100 (±0.01).
 * No DOM, no events — the component layer feeds pointer deltas in.
 */

export interface PanelConstraint {
  /** Minimum size in percent (default 0). */
  min?: number | undefined;
  /** Maximum size in percent (default 100). */
  max?: number | undefined;
  /** Panel may collapse to `collapsedSize` (default 0) instead of `min`. */
  collapsible?: boolean | undefined;
  /** Size used when collapsed (default 0). */
  collapsedSize?: number | undefined;
  /** Size restored by expandPanel (default `min`). */
  expandedSize?: number | undefined;
}

interface Normalized {
  min: number;
  max: number;
  collapsible: boolean;
  collapsedSize: number;
  expandedSize: number;
}

const EPSILON = 0.01;

export function normalize(c: PanelConstraint | undefined): Normalized {
  const min = Math.max(0, c?.min ?? 0);
  const max = Math.min(100, Math.max(min, c?.max ?? 100));
  const collapsedSize = clamp(c?.collapsedSize ?? 0, 0, max);
  return {
    min,
    max,
    collapsible: c?.collapsible ?? false,
    collapsedSize,
    expandedSize: clamp(c?.expandedSize ?? min, collapsedSize, max),
  };
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

function sum(layout: readonly number[]): number {
  return layout.reduce((a, b) => a + b, 0);
}

/**
 * Apply `delta` (positive grows, negative shrinks) to `indices` in order,
 * clamping each panel to its constraints and pushing the remainder to the
 * next index. Returns the absorbed amount.
 */
function applyDelta(
  layout: number[],
  constraints: Normalized[],
  indices: readonly number[],
  delta: number,
): number {
  let remaining = delta;
  for (const i of indices) {
    if (Math.abs(remaining) < EPSILON) break;
    const c = constraints[i];
    const current = layout[i];
    if (c === undefined || current === undefined) break;
    const applied = clamp(current + remaining, c.min, c.max);
    remaining = current + remaining - applied;
    layout[i] = applied;
  }
  return delta - remaining;
}

/**
 * Move the boundary after `handleIndex` by `deltaPercent` (positive grows
 * panels left/above the handle, negative grows panels after it).
 * Panels push their neighbors when they hit their own bounds; the layout
 * always keeps its original sum.
 */
export function resizePanels(
  layout: readonly number[],
  constraints: readonly PanelConstraint[],
  handleIndex: number,
  deltaPercent: number,
): number[] {
  const n = layout.length;
  if (n < 2 || handleIndex < 0 || handleIndex >= n - 1 || !Number.isFinite(deltaPercent)) {
    return layout.slice();
  }
  const cons = constraints.map(normalize);
  while (cons.length < n) cons.push(normalize(undefined));
  const next = layout.slice(0, n);

  const leftIdx = Array.from({ length: handleIndex + 1 }, (_, i) => handleIndex - i);
  const rightIdx = Array.from({ length: n - handleIndex - 1 }, (_, i) => handleIndex + 1 + i);

  // Move `delta` from the right side to the left side. Whatever the right
  // cannot give is handed back so the total is conserved exactly.
  const moved = applyDelta(next, cons, leftIdx, deltaPercent);
  const given = applyDelta(next, cons, rightIdx, -moved);
  const excess = moved + given; // |excess| > 0 means left moved more than right absorbed
  if (Math.abs(excess) > EPSILON) applyDelta(next, cons, leftIdx, -excess);

  // SURF-45 snap-to-collapse: a collapsible panel pushed below min/2 snaps to
  // collapsedSize; between min/2 and min it clamps to min. The drift moves to
  // the nearest expandable neighbor so the sum stays conserved.
  for (let i = 0; i < n; i++) {
    const c = cons[i];
    const v = next[i];
    if (!c || !c.collapsible || v === undefined) continue;
    const min = c.min ?? 0;
    if (v <= c.collapsedSize + EPSILON || v >= min - EPSILON) continue;
    const target = v < min / 2 ? c.collapsedSize : min;
    const drift = target - v;
    next[i] = target;
    for (const j of [i + 1, i - 1]) {
      if (j < 0 || j >= n) continue;
      const nc = cons[j];
      const nv = next[j];
      if (!nc || nv === undefined) continue;
      next[j] = clamp(nv - drift, nc.min, nc.max);
      break;
    }
  }

  return next;
}

/** Collapse `panelIndex` to its collapsedSize, distributing the freed space to neighbors. */
export function collapsePanel(
  layout: readonly number[],
  constraints: readonly PanelConstraint[],
  panelIndex: number,
): number[] {
  const panel = constraints[panelIndex];
  const size = layout[panelIndex];
  if (!panel || size === undefined) return layout.slice();
  const cons = constraints.map(normalize);
  while (cons.length < layout.length) cons.push(normalize(undefined));
  const c = cons[panelIndex];
  if (!c?.collapsible) return layout.slice();
  const next = layout.slice();
  const freed = size - c.collapsedSize;
  next[panelIndex] = c.collapsedSize;
  // Give the freed space to the nearest expandable neighbor.
  const target = panelIndex + 1 < next.length ? panelIndex + 1 : panelIndex - 1;
  const neighbor = next[target];
  if (target >= 0 && neighbor !== undefined) next[target] = neighbor + freed;
  return next;
}

/** Restore `panelIndex` to its expandedSize, taking space from the same neighbor. */
export function expandPanel(
  layout: readonly number[],
  constraints: readonly PanelConstraint[],
  panelIndex: number,
): number[] {
  const cons = constraints.map(normalize);
  while (cons.length < layout.length) cons.push(normalize(undefined));
  const c = cons[panelIndex];
  const size = layout[panelIndex];
  if (!c || size === undefined) return layout.slice();
  const want = c.expandedSize - size;
  if (want <= EPSILON) return layout.slice();
  const next = layout.slice();
  const target = panelIndex + 1 < next.length ? panelIndex + 1 : panelIndex - 1;
  const neighbor = next[target];
  const nc = cons[target];
  if (neighbor === undefined || !nc) return next;
  const applied = clamp(Math.min(want, neighbor - nc.min), 0, want);
  next[target] = neighbor - applied;
  next[panelIndex] = size + applied;
  return next;
}

/** Convert pixel sizes to a percent layout summing to exactly 100. */
export function toPercent(sizesPx: readonly number[], totalPx: number): number[] {
  if (sizesPx.length === 0 || !(totalPx > 0)) return sizesPx.map(() => 0);
  const raw = sizesPx.map((px) => (Math.max(0, px) / totalPx) * 100);
  const drift = 100 - sum(raw);
  const last = raw.length - 1;
  raw[last] = (raw[last] ?? 0) + drift;
  return raw;
}
