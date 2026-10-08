'use client';
/* MAT-221 / REQ-MOT-57: magnetic offset toward the pointer — useMotionValue +
 * useSpring(spring-snappy) only, no React state, strength clamped [0, 0.3] and
 * offset capped at min(strength·0.5·min(w,h), 8) px. Enabled only under
 * resolved 'full' + (pointer: fine). Exported under the frozen name
 * `magnetic`; implementation is a hook. */
import * as React from 'react';
import { useMotionValue, useSpring } from 'motion/react';
import { resolvedMotion } from '../ticker';
import { toMotionTransition } from './toMotionTransition';
import type { SpringTransition } from './toMotionTransition';

export interface MagneticBindings {
  ref: React.Ref<HTMLElement>;
  style: { x: unknown; y: unknown };
  onPointerMove?: never; // pointer handling is internal — consumers spread `ref` + `style` only
}

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
export { useMagnetic };
