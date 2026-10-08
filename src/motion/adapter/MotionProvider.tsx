'use client';
/* MAT-218: MotionProvider — wires usePreference('motion') to the `motion`
 * peer's MotionConfig and provides the DOM capability implementations
 * (REQ-MOT-54). Sole peer import site alongside magnetic/SharedLayout. */
import * as React from 'react';
import { MotionConfig } from 'motion/react';
import { usePreference } from '../../theme/index';
import { MotionCapabilityContext } from '../capability';
import { resolvedMotion } from '../ticker';
import { attachDragDetents, attachMomentum } from '../gestures';
import type { MotionCapability } from '../../contracts/motion';

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

export function MotionProvider({ children }: { children?: React.ReactNode }) {
  const pref = usePreference('motion'); // 'system' | 'full' | 'calm' | 'none'
  const resolved = pref === 'system' ? resolvedMotion() : pref;
  return React.createElement(
    MotionConfig,
    { reducedMotion: resolved === 'full' ? 'never' : 'always' },
    React.createElement(MotionCapabilityContext.Provider, { value: capability }, children),
  );
}
