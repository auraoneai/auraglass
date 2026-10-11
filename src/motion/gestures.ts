'use client';
/* MAT-219/-220: DOM gesture engines behind MotionCapability — no React, no
   motion-library imports. Runs on the shared ticker and contract springs. */
import { resolvedMotion, subscribeFrame } from './ticker';
import { springParams } from './adapter/springs';
import type { DragBindings } from '../contracts/motion';

const RUBBER = 0.55;
const DISMISS_FRAC = 0.25;
const DISMISS_V = 800;   // px/s
const PROJECT_S = 0.2;   // velocity projection window
const MOMENTUM_POWER = 0.8; // per-frame velocity decay coefficient base
const MOMENTUM_TC = 325; // ms time constant
const MOMENTUM_MAX_MS = 1000;

interface Tracked {
  pos: number; v: number; lastT: number; lastPos: number;
}

const track = (p: number, prev: Tracked | null, now: number): Tracked => {
  const dt = prev ? Math.max(1, now - prev.lastT) : 1;
  const v = prev ? (p - prev.lastPos) / dt * 1000 : 0;
  return { pos: p, v: prev ? prev.v * 0.7 + v * 0.3 : 0, lastT: now, lastPos: p };
};

const pos = (el: HTMLElement, axis: 'x' | 'y'): number =>
  parseFloat(el.style.getPropertyValue(axis === 'x' ? '--_ag-drag-x' : '--_ag-drag-y')) || 0;
const write = (el: HTMLElement, axis: 'x' | 'y', v: number) => {
  el.style.setProperty(axis === 'x' ? '--_ag-drag-x' : '--_ag-drag-y', `${v}px`);
  el.style.transform = `translate${axis === 'x' ? 'X' : 'Y'}(${v}px)`;
};

const rubberize = (v: number, lo: number, hi: number) =>
  v < lo ? lo + (v - lo) * RUBBER : v > hi ? hi + (v - hi) * RUBBER : v;

/** Drive el from `from` to `to` on the contract spring over the ticker. */
const drive = (el: HTMLElement, axis: 'x' | 'y', from: number, to: number, mode: 'full' | 'calm' | 'none', onDone: () => void) => {
  if (mode === 'none' || Math.abs(to - from) < 0.5) {
    write(el, axis, to);
    onDone();
    return () => {};
  }
  if (mode === 'calm') {
    // opacity-only small transition, then snap (REQ-MOT-55)
    el.style.transition = 'opacity 0.14s';
    el.style.opacity = '0.6';
    const id = setTimeout(() => {
      el.style.transition = '';
      el.style.opacity = '';
      write(el, axis, to);
      onDone();
    }, 140);
    return () => clearTimeout(id);
  }
  // spring from toMotionTransition('spring-smooth') per REQ-MOT-55
  const { zeta, responseMs } = springParams('smooth');
  const omega0 = (2 * Math.PI) / (responseMs / 1000);
  const wd = zeta >= 1 ? omega0 : omega0 * Math.sqrt(1 - zeta * zeta);
  // Elapsed time accumulates the ticker's frame dt (capped at 50 ms), so the
  // spring runs on the shared frame clock rather than a separate wall clock.
  let elapsedMs = 0;
  const un = subscribeFrame((dt) => {
    elapsedMs += dt;
    const t = elapsedMs / 1000;
    const w = omega0 * t;
    const x = zeta >= 1
      ? 1 - Math.exp(-w) * (1 + w)
      : 1 - Math.exp(-zeta * w) * (Math.cos(wd * t) + (zeta * omega0 / wd) * Math.sin(wd * t));
    write(el, axis, from + (to - from) * Math.min(1, Math.max(0, x)));
    if (Math.abs(x - 1) < 0.005 || t * 1000 > responseMs * 1.6) {
      write(el, axis, to);
      un();
      onDone();
    }
  });
  return un;
};

/** REQ-MOT-55/-103: drag along `axis` with detent projection, rubber-band, dismiss. */
export function attachDragDetents(el: HTMLElement, opts: {
  detents: number[]; axis: 'x' | 'y'; onSettle(i: number): void;
  doc?: Document;
}): DragBindings {
  const detents = [...opts.detents].sort((a, b) => a - b);
  const lo = detents[0] ?? 0;
  const hi = detents[detents.length - 1] ?? 0;
  let cancel: (() => void) | null = null;

  const onPointerDown = (e: PointerEvent) => {
    cancel?.();
    const el2 = (e.currentTarget as HTMLElement) ?? el;
    el2.setPointerCapture?.(e.pointerId);
    const origin = pos(el2, opts.axis);
    let t = track(origin, null, e.timeStamp);
    const size = opts.axis === 'y' ? el2.offsetHeight : el2.offsetWidth;
    const coord = (ev: PointerEvent) => (opts.axis === 'x' ? ev.clientX : ev.clientY);
    const start = coord(e) - pos(el2, opts.axis);

    const move = (ev: PointerEvent) => {
      t = track(coord(ev) - start, t, ev.timeStamp);
      write(el2, opts.axis, rubberize(t.pos, lo, hi));
    };
    const up = (ev: PointerEvent) => {
      el2.removeEventListener('pointermove', move);
      el2.removeEventListener('pointerup', up);
      el2.removeEventListener('pointercancel', up);
      const end = track(coord(ev) - start, t, ev.timeStamp);
      const projected = end.pos + end.v * PROJECT_S;
      // Dismiss on travel > 25% of the element's size (when measured) or a
      // release faster than 800 px/s; it goes to the end detent in the
      // direction of the release velocity, else of the travel.
      const travel = end.pos - origin;
      const byVelocity = Math.abs(end.v) > DISMISS_V;
      const dismissed = byVelocity || (size > 0 && Math.abs(travel) > DISMISS_FRAC * size);
      const forward = byVelocity ? end.v > 0 : travel >= 0;
      let idx = dismissed ? (forward ? detents.length - 1 : 0) : 0;
      if (!dismissed) {
        for (let i = 0; i < detents.length; i++) {
          if (Math.abs(detents[i]! - projected) < Math.abs((detents[idx] ?? 0) - projected)) idx = i;
        }
      }
      const target = idx < detents.length ? detents[idx]! : 0;
      cancel = drive(el2, opts.axis, end.pos, target, resolvedMotion(), () => opts.onSettle(idx));
    };
    el2.addEventListener('pointermove', move);
    el2.addEventListener('pointerup', up);
    el2.addEventListener('pointercancel', up);
  };
  return { onPointerDown };
}

/** REQ-MOT-56: drag, then release into bounded inertia (decay per time constant). */
export function attachMomentum(el: HTMLElement, opts: {
  axis: 'x' | 'y'; bounds: [number, number];
}): DragBindings {
  const [lo, hi] = opts.bounds;
  let unFrame: (() => void) | null = null;

  const onPointerDown = (e: PointerEvent) => {
    unFrame?.(); unFrame = null; // new pointerdown stops any running inertia
    const el2 = (e.currentTarget as HTMLElement) ?? el;
    el2.setPointerCapture?.(e.pointerId);
    let t = track(pos(el2, opts.axis), null, e.timeStamp);
    const coord = (ev: PointerEvent) => (opts.axis === 'x' ? ev.clientX : ev.clientY);
    const start = coord(e) - pos(el2, opts.axis);

    const move = (ev: PointerEvent) => {
      t = track(coord(ev) - start, t, ev.timeStamp);
      write(el2, opts.axis, Math.min(hi, Math.max(lo, t.pos)));
    };
    const up = () => {
      el2.removeEventListener('pointermove', move);
      el2.removeEventListener('pointerup', up);
      el2.removeEventListener('pointercancel', up);
      if (resolvedMotion() === 'none') return;
      let v = t.v;                                   // px/s
      let p = Math.min(hi, Math.max(lo, t.pos));
      if (Math.abs(v) < 10) return;
      let t0 = -1;
      unFrame = subscribeFrame((dt, now) => {
        if (t0 < 0) t0 = now;
        const el_ = now - t0;
        const step = Math.pow(MOMENTUM_POWER, dt / MOMENTUM_TC); // decay over tc ms
        p += (v * dt) / 1000;
        v *= step;
        if (p <= lo || p >= hi) { p = Math.min(hi, Math.max(lo, p)); v = 0; }
        write(el2, opts.axis, p);
        if (v === 0 || Math.abs(v) < 5 || el_ > MOMENTUM_MAX_MS) {
          unFrame?.(); unFrame = null;
        }
      });
    };
    el2.addEventListener('pointermove', move);
    el2.addEventListener('pointerup', up);
    el2.addEventListener('pointercancel', up);
  };
  return { onPointerDown };
}
