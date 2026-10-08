'use client';
/* MAT-220: useMomentum — consumes MotionCapabilityContext.momentum. */
import * as React from 'react';
import { MotionCapabilityContext } from '../capability';
import type { DragBindings } from '../../contracts/motion';

export type MomentumBindings = DragBindings;

export function useMomentum(opts: { axis: 'x' | 'y'; bounds: [number, number] }): MomentumBindings {
  const ctx = React.useContext(MotionCapabilityContext);
  return React.useMemo(
    () => ctx?.momentum?.(opts) ?? { onPointerDown: () => {} },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- opts is the caller's contract
    [ctx],
  );
}
