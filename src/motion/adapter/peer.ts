'use client';
/* REQ-MAT-50: the one place the adapter obtains the optional `motion` peer.
 * No adapter module imports `motion/react` statically: under ESM a missing
 * static import fails at link time (ERR_MODULE_NOT_FOUND) before any guard can
 * run. ./entry.ts starts one dynamic import of the peer (see ../peer-guard) and
 * hands the pending load to this holder; adapter components and hooks read it
 * at render, suspending (React 19 `use`) until the load settles. */
import * as React from 'react';
import type * as MotionReact from 'motion/react';

export type MotionPeer = typeof MotionReact;

let current: MotionPeer | null = null;
let pending: Promise<MotionPeer> | null = null;

/** The dynamic import of the peer; the only `motion` runtime specifier in src/motion. */
export const importMotionPeer = (): Promise<MotionPeer> => import('motion/react');

export function setMotionPeer(peer: MotionPeer): void {
  current = peer;
}

/** Records the in-flight peer load; render-time reads suspend on it until it settles. */
export function setPendingMotionPeer(load: Promise<MotionPeer>): void {
  pending = load;
}

/** The loaded peer. Suspends while the entry's load is in flight (rethrowing its
 *  install-message rejection); throws when no entry has started a load. */
export function motionPeer(): MotionPeer {
  if (current) return current;
  if (pending) return React.use(pending);
  throw new Error('aura-glass/motion: the motion peer is not loaded; import adapter APIs from "aura-glass/motion".');
}
