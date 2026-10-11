'use client';
/* Frozen public surface of `aura-glass/motion` (ENTRIES, REQ-MAT-50).
   Implementation lives in adapter/** (+ ../gestures.ts). `motion` (optional
   peer) is loaded only through adapter/peer.ts (§4.10): the top-level await
   below runs after the adapter modules evaluate (they never touch the peer at
   module scope) and before any consumer code can call into them, and it
   rejects with the install message when the peer is missing. */
import { guardMotionPeer } from './peer-guard';
import { importMotionPeer } from './adapter/peer';

await guardMotionPeer(importMotionPeer);

export { MotionProvider, SharedLayout, Shared, useDragDetents, useMomentum, magnetic } from './adapter/index';
export { toMotionTransition } from './adapter/toMotionTransition';
export type { MotionTokenName } from '../contracts/motion';
export type { DragBindings, MomentumBindings, MagneticBindings } from './adapter/index';
