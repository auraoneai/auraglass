/* REQ-MAT-50 / REQ-MOT-15/-59: friendly missing-peer error for `aura-glass/motion`.
 * Browser-safe: no `node:` imports and no Node globals. public.ts awaits
 * guardMotionPeer(importMotionPeer) before any adapter API can run; the
 * dynamic `import('motion/react')` sits inside try/catch, so a consumer without
 * the optional peer gets the contract install message instead of
 * ERR_MODULE_NOT_FOUND / "Failed to fetch dynamically imported module". */
import { setMotionPeer } from './adapter/peer';
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
