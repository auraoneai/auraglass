'use client';
/* MAT-219: useDragDetents — consumes MotionCapabilityContext.dragDetents
 * (DOM attach in ../gestures.ts via the provider's capability impl). */
import * as React from 'react';
import { MotionCapabilityContext } from '../capability';
import type { DragBindings } from '../../contracts/motion';

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
