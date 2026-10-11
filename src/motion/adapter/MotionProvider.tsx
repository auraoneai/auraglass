'use client';
/* MAT-218: MotionProvider — wires usePreference('motion') to the `motion`
 * peer's MotionConfig and provides the DOM capability implementations
 * (REQ-MOT-54). Sole peer import site alongside magnetic/SharedLayout. */
import * as React from 'react';
import { motionPeer } from './peer';
import { usePreference } from '../../theme/index';
import { MotionCapabilityContext } from '../capability';
import { resolvedMotion } from '../ticker';
import { attachDragDetents, attachMomentum } from '../gestures';
import type { DragBindings, MotionCapability } from '../../contracts/motion';

const elementOf = (e: PointerEvent | React.PointerEvent): HTMLElement | null =>
  (e.currentTarget as HTMLElement | null) ?? (e.target instanceof HTMLElement ? e.target : null);

/* One gesture engine per (bindings, element): a new pointerdown on the same
 * element reaches the engine that owns the running spring/inertia, so it can
 * interrupt it (REQ-MOT-55/-56). */
const perElement = (attach: (el: HTMLElement) => DragBindings): DragBindings => {
  const engines = new WeakMap<HTMLElement, DragBindings>();
  return {
    onPointerDown(e: PointerEvent) {
      const el = elementOf(e);
      if (!el) return;
      let engine = engines.get(el);
      if (!engine) { engine = attach(el); engines.set(el, engine); }
      engine.onPointerDown(e);
    },
  };
};

const capability: MotionCapability = {
  dragDetents(opts) {
    return perElement((el) => attachDragDetents(el, opts));
  },
  momentum(opts) {
    return perElement((el) => attachMomentum(el, opts));
  },
};

export function MotionProvider({ children }: { children?: React.ReactNode }) {
  const pref = usePreference('motion'); // 'system' | 'full' | 'calm' | 'none'
  const resolved = pref === 'system' ? resolvedMotion() : pref;
  return React.createElement(
    motionPeer().MotionConfig,
    { reducedMotion: resolved === 'full' ? 'never' : 'always' },
    React.createElement(MotionCapabilityContext.Provider, { value: capability }, children),
  );
}
