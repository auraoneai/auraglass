/* Frozen public surface of `aura-glass/motion` (ENTRIES, REQ-MAT-50).
   Directive-free, re-export-only barrel (REQ-PLAT-69). Implementation lives in
   adapter/** (+ ../gestures.ts); the client entry ./adapter/entry carries the
   client directive and starts the optional `motion` peer, which is loaded only
   through adapter/peer.ts (§4.10). No top-level await (S-35). */
export { MotionProvider, SharedLayout, Shared, useDragDetents, useMomentum, magnetic, toMotionTransition } from './adapter/entry';
export type { MotionTokenName } from '../contracts/motion';
export type { DragBindings, MomentumBindings, MagneticBindings } from './adapter/entry';
