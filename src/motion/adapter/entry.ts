'use client';
/* Client entry module of `aura-glass/motion` (REQ-MAT-50). ../public.ts is a
   directive-free, re-export-only barrel (REQ-PLAT-69) over this module; the
   peer start lives here, behind the 'use client' boundary, so a server graph
   importing `aura-glass/motion` receives client references and never runs it.
   No top-level await: startMotionPeer throws the install message from this
   import when the peer does not resolve, and otherwise starts the one dynamic
   load that adapter renders wait on (see ../peer-guard). It runs after the
   adapter modules below evaluate (they never touch the peer at module scope)
   and before any consumer code can call into them.

   The public names are bound here (const aliases), not re-exported from
   ./index: the package declares only CSS as side-effectful, so bundlers
   (tsdown with moduleSideEffects:false, Vite/Rollup, esbuild) keep this
   module, and with it the peer start, only when an export it owns is used. A
   pure `export … from` would let them trace every name to its defining module
   and drop this file, so the import would neither throw without the peer nor
   ever load it. */
import { startMotionPeer } from '../peer-guard';
import { importMotionPeer } from './peer';
import * as adapter from './index';

startMotionPeer(import.meta.url, importMotionPeer);

export const MotionProvider: typeof adapter.MotionProvider = adapter.MotionProvider;
export const SharedLayout: typeof adapter.SharedLayout = adapter.SharedLayout;
export const Shared: typeof adapter.Shared = adapter.Shared;
export const useDragDetents: typeof adapter.useDragDetents = adapter.useDragDetents;
export const useMomentum: typeof adapter.useMomentum = adapter.useMomentum;
export const magnetic: typeof adapter.magnetic = adapter.magnetic;
export const toMotionTransition: typeof adapter.toMotionTransition = adapter.toMotionTransition;
export type { DragBindings, MomentumBindings, MagneticBindings } from './index';
