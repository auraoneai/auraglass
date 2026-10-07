'use client';
/* MAT-217..223: `aura-glass/motion` public surface — the only modules that may
   import the optional `motion` peer (§4.10). Frozen exports live in public.ts. */
import * as React from 'react';
import {
  LayoutGroup, MotionConfig, motion, useMotionValue, useSpring,
} from 'motion/react';
import { usePreference } from '../theme/index';
import { MotionCapabilityContext } from './capability';
import { resolvedMotion } from './ticker';
import { toMotionTransition } from './toMotionTransition';
import { attachDragDetents, attachMomentum } from './gestures';
import type { MotionCapability, DragBindings } from '../contracts/motion';
import type { SpringTransition } from './toMotionTransition';

export type { DragBindings } from '../contracts/motion';
export type MomentumBindings = DragBindings;
export interface MagneticBindings {
  ref: React.Ref<HTMLElement>;
  style: { x: unknown; y: unknown };
  onPointerMove?: never; // pointer handling is internal — consumers spread `ref` + `style` only
}

/* ---- capability implementations (REQ-MOT-54) ---- */

const elementOf = (e: PointerEvent | React.PointerEvent): HTMLElement | null =>
  (e.currentTarget as HTMLElement | null) ?? (e.target instanceof HTMLElement ? e.target : null);

const capability: MotionCapability = {
  dragDetents(opts) {
    return {
      onPointerDown(e: PointerEvent) {
        const el = elementOf(e);
        if (el) attachDragDetents(el, opts).onPointerDown(e);
      },
    };
  },
  momentum(opts) {
    return {
      onPointerDown(e: PointerEvent) {
        const el = elementOf(e);
        if (el) attachMomentum(el, opts).onPointerDown(e);
      },
    };
  },
};

/* ---- provider (MAT-218) ---- */

export function MotionProvider({ children }: { children?: React.ReactNode }) {
  const pref = usePreference('motion'); // 'system' | 'full' | 'calm' | 'none'
  const resolved = pref === 'system' ? resolvedMotion() : pref;
  return React.createElement(
    MotionConfig,
    { reducedMotion: resolved === 'full' ? 'never' : 'always' },
    React.createElement(MotionCapabilityContext.Provider, { value: capability }, children),
  );
}

/* ---- hooks (MAT-219/220/221) ---- */

export function useDragDetents(opts: {
  detents: number[]; axis: 'x' | 'y'; onSettle(i: number): void;
}): DragBindings {
  const ctx = React.useContext(MotionCapabilityContext);
  return React.useMemo(
    () => ctx?.dragDetents?.(opts) ?? { onPointerDown: () => {} },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- opts is the caller's contract
    [ctx],
  );
}

export function useMomentum(opts: { axis: 'x' | 'y'; bounds: [number, number] }): DragBindings {
  const ctx = React.useContext(MotionCapabilityContext);
  return React.useMemo(
    () => ctx?.momentum?.(opts) ?? { onPointerDown: () => {} },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- opts is the caller's contract
    [ctx],
  );
}

/** REQ-MOT-57: magnetic offset toward pointer — useMotionValue/useSpring only, no state.
   Exported under the frozen name `magnetic` (contract); implementation is a hook. */
function useMagnetic(opts: { strength?: number } = {}): MagneticBindings {
  const strength = Math.max(0, Math.min(0.3, opts.strength ?? 0.15));
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = toMotionTransition('spring-snappy') as SpringTransition;
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const enabled = React.useRef(false);
  const ref = React.useCallback((el: HTMLElement | null) => {
    if (!el) return;
    enabled.current =
      resolvedMotion() === 'full' &&
      typeof matchMedia === 'function' && matchMedia('(pointer: fine)').matches;
    if (!enabled.current) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const cap = Math.min(strength * 0.5 * Math.min(r.width, r.height), 8);
      const len = Math.hypot(dx, dy) || 1;
      x.set((dx / len) * cap);
      y.set((dy / len) * cap);
    };
    const leave = () => { x.set(0); y.set(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
  }, [strength, x, y]);
  return { ref, style: { x: sx, y: sy } };
}
export const magnetic = useMagnetic;

/* ---- shared layout (MAT-222) ---- */

export function SharedLayout({ children, id }: { children?: React.ReactNode; id?: string }) {
  return React.createElement(LayoutGroup, id === undefined ? {} : { id }, children);
}

export function Shared({ id, children, ...rest }: { id: string; children?: React.ReactNode } & Record<string, unknown>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const onStart = () => {
    ref.current?.setAttribute('data-ag-animating', '');
    ref.current?.style.setProperty('--_ag-optics', '0');
  };
  const onDone = () => {
    ref.current?.removeAttribute('data-ag-animating');
    ref.current?.style.removeProperty('--_ag-optics');
  };
  return React.createElement(
    motion.div,
    {
      layoutId: id, ref,
      onLayoutAnimationStart: onStart,
      onLayoutAnimationComplete: onDone,
      ...rest,
    },
    children,
  );
}
