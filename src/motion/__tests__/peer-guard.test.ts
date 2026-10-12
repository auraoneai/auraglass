/* REQ-MAT-50 (FIN D.3-30): the `aura-glass/motion` peer guard is browser-safe
 * (no node: imports; Node's resolver is feature-detected) and turns a failed load of the optional
 * `motion` peer into the contract install message. */
import { describe, expect, it, jest } from '@jest/globals';
import { MOTION_PEER_MESSAGE, guardMotionPeer } from '../peer-guard';
import type { MotionPeer } from '../adapter/peer';

// The real peer, loaded through the adapter (the only place motion/react is imported, REQ-MOT-60).
const loadMotionReact = async (): Promise<MotionPeer> => (await import('../adapter/peer')).importMotionPeer();

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
    const MotionReact = await loadMotionReact();
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

  it('throws the install message synchronously when motion/react does not resolve (no top-level await)', () => {
    const { assertMotionPeerResolvable } = require('../peer-guard') as typeof import('../peer-guard');
    const outside = `file://${require('node:os').tmpdir()}/ag-no-peer/entry.js`;
    expect(() => assertMotionPeerResolvable(outside)).toThrow(CONTRACT_MESSAGE);
    expect(() => assertMotionPeerResolvable(`file://${__filename}`)).not.toThrow();
  });

  it('adapter reads wait on the pending load, then return the installed peer', async () => {
    const MotionReact = await loadMotionReact();
    let motionPeer: (() => MotionPeer) | null = null;
    let start: ((from: string, load: () => Promise<MotionPeer>) => void) | null = null;
    jest.isolateModules(() => {
      ({ motionPeer } = require('../adapter/peer') as typeof import('../adapter/peer'));
      ({ startMotionPeer: start } = require('../peer-guard') as typeof import('../peer-guard'));
    });
    let resolveLoad: (p: MotionPeer) => void = () => {};
    const loading = new Promise<MotionPeer>((r) => { resolveLoad = r; });
    start!(`file://${__filename}`, () => loading);
    // outside a render React.use cannot suspend, but the read must not report "not loaded"
    expect(() => motionPeer!()).not.toThrow(/peer is not loaded/);
    resolveLoad(MotionReact as MotionPeer);
    await loading;
    await Promise.resolve();
    expect(motionPeer!().MotionConfig).toBe(MotionReact.MotionConfig);
  });
});
