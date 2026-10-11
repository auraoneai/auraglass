'use client';
/* CMP-232 (REQ-CMP-92): Sheet detent state machine.

   resolveDetent — pure. Model: `positionPx` is the popup's top-edge offset
   from the viewport top along the drag axis (for a bottom sheet, dragging
   down increases it); `detentsPx` are the top-edge offsets of each detent
   ascending (index 0 = tallest/highest detent). A detent's "lowest" entry is
   the last one — the smallest height, closest to the viewport edge.

   - |velocity| < 0.5 px/ms: snap to the nearest detent to the projected
     landing position (position + velocity * 200ms glide).
   - velocity >= +0.5 px/ms projected past the lowest detent → {close: true}.
   - otherwise the fling snaps to the next detent in the direction of travel;
     a slow drag always snaps to the nearest detent.

   The hook resolves detents?: Array<number | 'content' | 'full'> —
   numbers are fractions of the viewport (0..1 of 100dvh), 'content' = the
   popup's measured content block size, 'full' = the whole viewport — into
   pixel offsets and exposes the controlled/uncontrolled active index. */
import * as React from 'react';

export type SheetDetent = number | 'content' | 'full';

export interface ResolveDetentArgs {
  positionPx: number;
  velocityPxMs: number;
  detentsPx: number[];
  viewportPx: number;
}

export type DetentResolution = { index: number } | { close: true };

const FLING_PX_MS = 0.5;
const GLIDE_MS = 200;

export function resolveDetent({ positionPx, velocityPxMs, detentsPx }: ResolveDetentArgs): DetentResolution {
  const tops = [...detentsPx].sort((a, b) => a - b);
  const lowestTop = tops[tops.length - 1];
  if (tops.length === 0 || lowestTop === undefined) return { close: true };
  const projected = positionPx + velocityPxMs * GLIDE_MS;

  if (velocityPxMs >= FLING_PX_MS && projected >= lowestTop) return { close: true };

  if (Math.abs(velocityPxMs) >= FLING_PX_MS) {
    // fling: next detent in the direction of travel
    if (velocityPxMs > 0) {
      const below = tops.find((t) => t > positionPx);
      if (below !== undefined) return { index: detentsPx.indexOf(below) };
      return { index: detentsPx.indexOf(lowestTop) };
    }
    const above = tops.filter((t) => t < positionPx);
    const lastAbove = above[above.length - 1];
    if (lastAbove !== undefined) return { index: detentsPx.indexOf(lastAbove) };
    return { index: detentsPx.indexOf(tops[0]!) };
  }

  // slow release: nearest detent to the projected landing position
  let best = tops[0]!;
  for (const t of tops) {
    if (Math.abs(t - projected) < Math.abs(best - projected)) best = t;
  }
  return { index: detentsPx.indexOf(best) };
}

export interface UseSheetDetentsArgs {
  detents?: SheetDetent[] | undefined;
  detent?: number | undefined;
  defaultDetent?: number | undefined;
  onDetentChange?: ((index: number) => void) | undefined;
  /** Live viewport block size for resolving 'full'/fractions. */
  viewportPx?: number | undefined;
  /** Measured content block size for the 'content' detent. */
  contentPx?: number | undefined;
}

export interface SheetDetentsHandle {
  index: number;
  setIndex: (i: number) => void;
  /** Resolved detent heights in px, ascending; 'content' uses contentPx. */
  heightsPx: number[];
  /** Top-edge offsets of each detent for resolveDetent (viewport - height). */
  topsPx: number[];
  /** True when the active detent resolves to 'full'. */
  isFull: boolean;
}

export function useSheetDetents({
  detents = ['content'],
  detent,
  defaultDetent,
  onDetentChange,
  viewportPx = 0,
  contentPx = 0,
}: UseSheetDetentsArgs): SheetDetentsHandle {
  const [internal, setInternal] = React.useState(defaultDetent ?? 0);
  const index = detent ?? internal;
  const setIndex = React.useCallback((i: number) => {
    setInternal(i);
    onDetentChange?.(i);
  }, [onDetentChange]);

  const heightsPx = React.useMemo(() => detents.map((d) => {
    if (d === 'full') return viewportPx;
    if (d === 'content') return contentPx || viewportPx * 0.5;
    return Math.max(0, Math.min(1, d)) * viewportPx;
  }), [detents, viewportPx, contentPx]);

  const topsPx = React.useMemo(
    () => heightsPx.map((h) => Math.max(0, viewportPx - h)),
    [heightsPx, viewportPx],
  );

  const cur = detents[index];
  return { index, setIndex, heightsPx, topsPx, isFull: cur === 'full' || cur === 1 };
}
