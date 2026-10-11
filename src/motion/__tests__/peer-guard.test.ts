/* REQ-MAT-50 (FIN D.3-30): the `aura-glass/motion` peer guard is browser-safe
 * (no node: imports, no Node globals) and turns a failed load of the optional
 * `motion` peer into the contract install message. */
import { describe, expect, it, jest } from '@jest/globals';
import * as MotionReact from 'motion/react';
import { MOTION_PEER_MESSAGE, guardMotionPeer } from '../peer-guard';
import type { MotionPeer } from '../adapter/peer';

const CONTRACT_MESSAGE =
  'aura-glass/motion requires the optional peer "motion@^12". Install it with: npm i motion@^12';

describe('peer-guard (REQ-MAT-50)', () => {
  it('uses the contract install message verbatim', () => {
    expect(MOTION_PEER_MESSAGE).toBe(CONTRACT_MESSAGE);
  });

  it('rejects with the install message (keeping the cause) when the peer cannot be loaded', async () => {
    const notFound = Object.assign(new Error("Cannot find package 'motion'"), { code: 'ERR_MODULE_NOT_FOUND' });
    const err = await guardMotionPeer(() => Promise.reject(notFound)).then(() => null, (e: unknown) => e as Error);
    if (!err) throw new Error('guardMotionPeer resolved without a peer');
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe(CONTRACT_MESSAGE);
    expect((err as Error & { cause?: unknown }).cause).toBe(notFound);
  });

  it('rejects with the install message for a browser-style dynamic import failure', async () => {
    const fetchFail = new TypeError('Failed to fetch dynamically imported module: /node_modules/motion/react');
    await expect(guardMotionPeer(() => Promise.reject(fetchFail))).rejects.toThrow(CONTRACT_MESSAGE);
  });

  it('installs the loaded peer for the adapter', async () => {
    const load = jest.fn(() => Promise.resolve(MotionReact as MotionPeer));
    let motionPeer: (() => MotionPeer) | null = null;
    let guard: typeof guardMotionPeer | null = null;
    jest.isolateModules(() => {
      ({ motionPeer } = require('../adapter/peer') as typeof import('../adapter/peer'));
      ({ guardMotionPeer: guard } = require('../peer-guard') as typeof import('../peer-guard'));
    });
    expect(() => motionPeer!()).toThrow();
    await expect(guard!(load)).resolves.toBe(MotionReact);
    expect(load).toHaveBeenCalledTimes(1);
    expect(motionPeer!().MotionConfig).toBe(MotionReact.MotionConfig);
  });

  it('really loads motion/react through the adapter dynamic import', async () => {
    const { importMotionPeer } = await import('../adapter/peer');
    const peer = await importMotionPeer();
    expect(typeof peer.MotionConfig).toBe('function');
  });
});
