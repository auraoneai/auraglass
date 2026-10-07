/* @ag-contract-seed: S-13. Owner MAT replaces internals; exports frozen. Internal module
   (not a public subpath) — the public surface is src/motion/public.ts. */
import * as React from 'react';
import type { FrameCallback, MotionCapability } from '../contracts/motion';

const MAX_DT_MS = 50;

const frameSubs = new Set<{ cb: FrameCallback; el?: Element }>();
let rafId: number | null = null;
let lastNow = 0;
let listening = false;

const doc = () => (typeof document === 'undefined' ? null : document);

function tick(now: number) {
  const dt = Math.min(now - lastNow, MAX_DT_MS);
  lastNow = now;
  for (const s of [...frameSubs]) s.cb(dt, now);
  rafId = frameSubs.size ? requestAnimationFrame(tick) : null;
}

function onVisibility() {
  const d = doc();
  if (!d) return;
  if (d.hidden && rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  } else if (!d.hidden && frameSubs.size && rafId === null) {
    lastNow = 0;
    rafId = requestAnimationFrame(tick);
  }
}

/** One shared rAF loop; dt capped at 50 ms; pauses on visibilitychange. */
export function subscribeFrame(cb: FrameCallback, opts?: { element?: Element }): () => void {
  const sub = { cb, ...(opts?.element !== undefined ? { el: opts.element } : {}) };
  frameSubs.add(sub);
  if (typeof requestAnimationFrame !== 'undefined' && rafId === null) {
    const d = doc();
    if (!listening && d) { d.addEventListener('visibilitychange', onVisibility); listening = true; }
    if (!d?.hidden) { lastNow = 0; rafId = requestAnimationFrame(tick); }
  }
  return () => { frameSubs.delete(sub); };
}

let io: IntersectionObserver | null = null;
/** Sole owner of data-ag-offscreen (§4.4). */
export function observeOffscreen(el: Element): () => void {
  if (typeof IntersectionObserver === 'undefined') return () => {};
  if (!io) {
    io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) e.target.removeAttribute('data-ag-offscreen');
        else e.target.setAttribute('data-ag-offscreen', '');
      }
    });
  }
  io.observe(el);
  return () => { io?.unobserve(el); };
}

/** startMorph calls update() synchronously; View Transition wrapper comes from MAT. */
export async function startMorph(update: () => void | Promise<void>): Promise<void> {
  await update();
}

export const MotionCapabilityContext = React.createContext<MotionCapability | null>(null);
