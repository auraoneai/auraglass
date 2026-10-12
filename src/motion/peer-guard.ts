/* REQ-MAT-50 / REQ-MOT-15/-59: friendly missing-peer error for `aura-glass/motion`.
 * Browser-safe: no `node:` imports. public.ts calls startMotionPeer() at module
 * scope with no top-level await, so the entry stays loadable by synchronous
 * module loaders (require(esm), Jest; S-35):
 *  - Where the runtime can resolve synchronously (Node: process.getBuiltinModule,
 *    feature-detected through globalThis), a peer that does not resolve throws
 *    the contract install message from the import itself. Only resolution runs
 *    here; the peer is still loaded by the one dynamic import below.
 *  - The dynamic `import('motion/react')` is wrapped so a failed load rejects
 *    with the install message instead of ERR_MODULE_NOT_FOUND / "Failed to fetch
 *    dynamically imported module"; adapter renders rethrow it (adapter/peer.ts).
 *    Bundlers fail the build when the peer is absent, so browsers reach this
 *    path only with the peer installed. */
import { setMotionPeer, setPendingMotionPeer } from './adapter/peer';
import type { MotionPeer } from './adapter/peer';

export const MOTION_PEER_MESSAGE =
  'aura-glass/motion requires the optional peer "motion@^12". Install it with: npm i motion@^12';

/** Loads the peer through `load` and installs it for the adapter; rejects with the install message. */
export async function guardMotionPeer(load: () => Promise<MotionPeer>): Promise<MotionPeer> {
  let peer: MotionPeer;
  try {
    peer = await load();
  } catch (cause) {
    throw new Error(MOTION_PEER_MESSAGE, { cause });
  }
  setMotionPeer(peer);
  return peer;
}

type ModuleBuiltin = { createRequire(from: string): { resolve(id: string): string } };
type ProcessLike = { getBuiltinModule?(id: string): unknown };

/** Synchronously resolves `motion/react` from this module where the runtime allows it. */
export function assertMotionPeerResolvable(from: string): void {
  const proc = (globalThis as { process?: ProcessLike }).process;
  const mod = proc?.getBuiltinModule?.('module') as ModuleBuiltin | undefined;
  if (!mod) return; // browsers / bundlers: resolution was settled at build time
  try {
    mod.createRequire(from).resolve('motion/react');
  } catch (cause) {
    throw new Error(MOTION_PEER_MESSAGE, { cause });
  }
}

/** Entry-time guard: sync resolution check, then one dynamic load handed to the adapter. */
export function startMotionPeer(from: string, load: () => Promise<MotionPeer>): void {
  assertMotionPeerResolvable(from);
  const loading = guardMotionPeer(load);
  // The rejection is surfaced by adapter renders (React `use`); never as an unhandled rejection.
  loading.catch(() => {});
  setPendingMotionPeer(loading);
}
