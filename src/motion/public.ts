'use client';
/* Frozen public surface of `aura-glass/motion` (ENTRIES, REQ-MAT-50).
   Implementation lives in adapter/** (+ ../gestures.ts). `motion` (optional
   peer) is loaded only through adapter/peer.ts (§4.10). No top-level await:
   startMotionPeer throws the install message from this import when the peer
   does not resolve, and otherwise starts the one dynamic load that adapter
   renders wait on (see ./peer-guard). */
import { startMotionPeer } from './peer-guard';
import { importMotionPeer } from './adapter/peer';

startMotionPeer(import.meta.url, importMotionPeer);

export { MotionProvider, SharedLayout, Shared, useDragDetents, useMomentum, magnetic } from './adapter/index';
export { toMotionTransition } from './adapter/toMotionTransition';
export type { MotionTokenName } from '../contracts/motion';
export type { DragBindings, MomentumBindings, MagneticBindings } from './adapter/index';
