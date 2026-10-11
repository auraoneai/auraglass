'use client';
/* REQ-MAT-50: the one place the adapter obtains the optional `motion` peer.
 * No adapter module imports `motion/react` statically: under ESM a missing
 * static import fails at link time (ERR_MODULE_NOT_FOUND) before any guard can
 * run. public.ts loads the peer once with a dynamic import (see ../peer-guard)
 * and hands it to this holder; adapter components and hooks read it at render. */
import type * as MotionReact from 'motion/react';

export type MotionPeer = typeof MotionReact;

let current: MotionPeer | null = null;

/** The dynamic import of the peer; the only `motion` runtime specifier in src/motion. */
export const importMotionPeer = (): Promise<MotionPeer> => import('motion/react');

export function setMotionPeer(peer: MotionPeer): void {
  current = peer;
}

/** The loaded peer. Throws when the adapter is used without aura-glass/motion's entry having loaded it. */
export function motionPeer(): MotionPeer {
  if (!current) {
    throw new Error('aura-glass/motion: the motion peer is not loaded; import adapter APIs from "aura-glass/motion".');
  }
  return current;
}
