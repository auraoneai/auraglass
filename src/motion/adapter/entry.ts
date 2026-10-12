'use client';
/* Client entry module of `aura-glass/motion` (REQ-MAT-50). ../public.ts is a
   directive-free, re-export-only barrel (REQ-PLAT-69) over this module; the
   peer start lives here, behind the 'use client' boundary, so a server graph
   importing `aura-glass/motion` receives client references and never runs it.
   No top-level await: startMotionPeer throws the install message from this
   import when the peer does not resolve, and otherwise starts the one dynamic
   load that adapter renders wait on (see ../peer-guard). It runs after the
   adapter modules below evaluate (they never touch the peer at module scope)
   and before any consumer code can call into them. */
import { startMotionPeer } from '../peer-guard';
import { importMotionPeer } from './peer';

startMotionPeer(import.meta.url, importMotionPeer);

export { MotionProvider, SharedLayout, Shared, useDragDetents, useMomentum, magnetic } from './index';
export { toMotionTransition } from './toMotionTransition';
export type { DragBindings, MomentumBindings, MagneticBindings } from './index';
