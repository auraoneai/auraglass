'use client';
/* CMP-233/234 (REQ-CMP-93/-94): Sheet handle — the only drag surface.
   pointer capture on the handle, touch-action:none, translate written to the
   popup's style inside rAF (0 React commits per pointermove). Release calls
   resolveDetent; the snap animates via the CSS linear() spring transition
   (data-ag-dragging removed → transition live). When aura-glass/motion ships
   its spring adapter the same settle path can hand off — no core import.
   Keyboard: Enter/Space cycles detents upward; Escape closes through BU's
   dismiss (focus is inside the popup). Detent changes announce via S-26. */
import * as React from 'react';
import { useAnnouncer } from '../../theme';
import { cn } from '../../internal';
import { resolveDetent } from './useSheetDetents';
import { subscribeFrame } from '../../motion/ticker';
import { MotionCapabilityContext } from '../../motion/capability';
import type { SheetDetentsHandle } from './useSheetDetents';
import type { SheetDetent, SheetSide } from './Sheet.types';

export interface SheetHandleContextValue {
  axis: 'x' | 'y';
  /** +1 when the closing drag direction matches positive axis movement. */
  sign: 1 | -1;
  side: SheetSide;
  detents: SheetDetentsHandle;
  /** Effective (bottom-only) detent defs for value-derived announcements. */
  detentDefs: SheetDetent[];
  viewportPx: number;
  getPopup: () => HTMLElement | null;
  onRequestClose: () => void;
  labels: { handle?: string; detents?: string[] } | undefined;
  /** Writes to the provider announcer (S-26) AND a local live region in the popup. */
  announce: (text: string) => void;
}

export const SheetHandleContext = React.createContext<SheetHandleContextValue | null>(null);

export function useSheetHandleContext(): SheetHandleContextValue {
  const ctx = React.useContext(SheetHandleContext);
  if (!ctx) throw new Error('aura-glass: <Sheet.Handle> must render inside <Sheet.Root>.');
  return ctx;
}

export function SheetHandle({ className, children, ref }: {
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}) {
  const ctx = useSheetHandleContext();
  const drag = React.useRef<{ id: number; start: number; samples: { t: number; v: number }[] } | null>(null);
  const frameUnsub = React.useRef<(() => void) | null>(null);
  const pendingPx = React.useRef(0);
  /* REQ-CMP-94: MotionCapability.dragDetents (aura-glass/motion provider) owns
     the drag when present; otherwise the local subscribeFrame path runs. */
  const cap = React.useContext(MotionCapabilityContext);

  /* REQ-CMP-95: announcement derives from the detent VALUE — 1/'full' →
     'Full height', 0.5 → 'Half height', otherwise labels.detents[i]. */
  const announceDetent = React.useCallback((i: number) => {
    const def = ctx.detentDefs[i];
    const text =
      def === 1 || def === 'full' ? 'Full height'
      : def === 0.5 ? 'Half height'
      : ctx.labels?.detents?.[i] ?? `Detent ${i + 1}`;
    ctx.announce(text);
  }, [ctx]);

  const settleDetent = React.useCallback((i: number) => {
    ctx.detents.setIndex(i);
    announceDetent(i);
    // clear the drag-written transform so the CSS snap takes over
    const el = ctx.getPopup();
    if (el) el.style.transform = '';
  }, [ctx, announceDetent]);

  // S-13: one transform write per frame via the shared ticker (no raw rAF)
  const writeTransform = React.useCallback((px: number) => {
    pendingPx.current = px;
    if (frameUnsub.current) return;
    let unsub: () => void;
    unsub = subscribeFrame(() => {
      frameUnsub.current = null;
      unsub();
      const el = ctx.getPopup();
      if (!el) return;
      el.style.transform = ctx.axis === 'y' ? `translateY(${pendingPx.current}px)` : `translateX(${pendingPx.current}px)`;
    });
    frameUnsub.current = unsub;
  }, [ctx]);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    try {
      (e.currentTarget as HTMLButtonElement).setPointerCapture?.(e.pointerId);
    } catch { /* jsdom has no pointer capture */ }
    const v = ctx.axis === 'y' ? e.clientY : e.clientX;
    drag.current = { id: e.pointerId, start: v, samples: [{ t: performance.now(), v }] };
    ctx.getPopup()?.setAttribute('data-ag-dragging', '');
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    const v = ctx.axis === 'y' ? e.clientY : e.clientX;
    d.samples.push({ t: performance.now(), v });
    if (d.samples.length > 6) d.samples.shift();
    // overshoot above the top detent is clamped to a small rubber band
    const delta = (v - d.start) * ctx.sign;
    writeTransform(Math.max(-24, delta));
  };

  const endDrag = (e: React.PointerEvent<HTMLButtonElement>, cancelled: boolean) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    drag.current = null;
    try {
      (e.currentTarget as HTMLButtonElement).releasePointerCapture?.(e.pointerId);
    } catch { /* already released / jsdom */ }
    const popup = ctx.getPopup();
    popup?.removeAttribute('data-ag-dragging');
    if (cancelled || !popup) {
      writeTransform(0);
      return;
    }
    const last = d.samples[d.samples.length - 1] ?? d.samples[0]!;
    const first = d.samples[0] ?? last;
    const dt = Math.max(1, last.t - first.t);
    const velocityPxMs = ((last.v - first.v) / dt) * ctx.sign;
    const deltaPx = (last.v - d.start) * ctx.sign;
    const { topsPx, index } = ctx.detents;
    const positionPx = (topsPx[index] ?? 0) + deltaPx;
    const res = resolveDetent({
      positionPx,
      velocityPxMs,
      detentsPx: topsPx,
      viewportPx: ctx.viewportPx,
    });
    if ('close' in res) ctx.onRequestClose();
    else settleDetent(res.index);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // cycle upward = toward the next taller detent (smaller top offset)
      const { topsPx, index } = ctx.detents;
      const order = topsPx.map((_, i) => i).sort((a, b) => (topsPx[a] ?? 0) - (topsPx[b] ?? 0));
      const pos = order.indexOf(index);
      const next = order[(pos + 1) % order.length] ?? index;
      settleDetent(next);
    }
    // Escape reaches BU's dismiss → onOpenChange('escape-key'); no local handler.
  };

  React.useEffect(() => () => frameUnsub.current?.(), []);

  /* REQ-CMP-94: when the aura-glass/motion MotionProvider is mounted,
     MotionCapability.dragDetents owns the drag (same onSettle contract);
     otherwise the local pointer path above runs. */
  const capBindings = React.useMemo(() =>
    cap?.dragDetents
      ? cap.dragDetents({
          detents: ctx.detents.topsPx,
          axis: ctx.axis,
          onSettle: (i: number) => settleDetent(i),
        })
      : null,
  [cap, ctx.detents.topsPx, ctx.axis, settleDetent]);

  return (
    <button
      type="button"
      data-ag-part="handle"
      aria-label={ctx.labels?.handle ?? 'Resize sheet'}
      className={cn('ag-sheet-handle', className)}
      style={capBindings?.style as React.CSSProperties | undefined}
      onPointerDown={capBindings ? (capBindings.onPointerDown as never) : onPointerDown}
      onPointerMove={capBindings ? undefined : onPointerMove}
      onPointerUp={capBindings ? undefined : (e) => endDrag(e, false)}
      onPointerCancel={capBindings ? undefined : (e) => endDrag(e, true)}
      onKeyDown={onKeyDown}
      ref={ref}
    >
      {children ?? <span className="ag-sheet-handle-bar" aria-hidden="true" />}
    </button>
  );
}
