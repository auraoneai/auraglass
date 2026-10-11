/* Frozen public surface of `aura-glass/motion` (ENTRIES).
   Implementation lives in adapter.tsx (+ toMotionTransition.ts, gestures.ts, springs.ts);
   `motion` (optional peer) is imported only from this lane (§4.10). */
import './peer-guard'; // must precede adapter — throws the friendly peer error first
export { MotionProvider, SharedLayout, Shared, useDragDetents, useMomentum, magnetic } from './adapter/index';
export { toMotionTransition } from './adapter/toMotionTransition';
export type { MotionTokenName } from '../contracts/motion';
export type { DragBindings, MomentumBindings, MagneticBindings } from './adapter/index';
