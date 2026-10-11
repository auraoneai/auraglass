/**
 * @jest-environment jsdom
 */
/* REQ-QUAL-23 (FIN-440) self-test of the settled-idle probe that the L9 motion
   lane runs in-page. jsdom (pretendToBeVisual) provides requestAnimationFrame;
   document.getAnimations is not implemented by jsdom, so each case installs a
   fixed animation list on the document — the probe itself throws when the API
   is missing, which the last case asserts. Run: jest -c jest.qual.config.js. */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  installIdleProbe, markIdleProbe, readIdleProbe, settledIdleViolations,
  type IdleSnapshot,
} from '../src/motion/idleProbe';

type ProbeWindow = Window & { __agIdleProbe?: unknown };

const nextFrame = () => new Promise<void>((r) => window.requestAnimationFrame(() => r()));

interface FakeAnimation { playState: string; effect: { target: Element | null; getComputedTiming(): { iterations: number }; getKeyframes(): Array<Record<string, unknown>> } }
const fakeAnimation = (target: Element, props: string[], iterations: number, playState = 'running'): FakeAnimation => ({
  playState,
  effect: {
    target,
    getComputedTiming: () => ({ iterations }),
    getKeyframes: () => [Object.fromEntries([['offset', 0], ...props.map((p) => [p, '0'])])],
  },
});
const setAnimations = (list: FakeAnimation[]) => {
  (document as unknown as { getAnimations: () => FakeAnimation[] }).getAnimations = () => list;
};

describe('settled-idle probe', () => {
  const originals = {
    raf: window.requestAnimationFrame, caf: window.cancelAnimationFrame,
    si: window.setInterval, ci: window.clearInterval, ct: window.clearTimeout,
  };
  let consoleError: ReturnType<typeof jest.spyOn>;
  beforeEach(() => {
    // jsdom does not implement getComputedStyle(el, '::before'); the probe still
    // scans pseudo-elements in real engines. Only that jsdom notice is tolerated.
    const real = console.error.bind(console);
    consoleError = jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      if (/Not implemented: window\.getComputedStyle\(elt, pseudoElt\)/.test(String((args[0] as Error)?.message ?? args[0]))) return;
      real(...args);
    });
    setAnimations([]);
    installIdleProbe(window);
  });
  afterEach(() => {
    consoleError.mockRestore();
    window.requestAnimationFrame = originals.raf;
    window.cancelAnimationFrame = originals.caf;
    window.setInterval = originals.si;
    window.clearInterval = originals.ci;
    window.clearTimeout = originals.ct;
    delete (window as ProbeWindow).__agIdleProbe;
    delete (document as unknown as { getAnimations?: unknown }).getAnimations;
    document.body.innerHTML = '';
  });

  it('counts a self-rescheduling rAF loop as pending and clears it once the id is cancelled', async () => {
    let id = 0;
    const loop = () => { id = window.requestAnimationFrame(loop); };
    id = window.requestAnimationFrame(loop);
    await nextFrame();
    await nextFrame();
    expect(readIdleProbe(window).pendingRaf).toBe(1);
    expect(settledIdleViolations(readIdleProbe(window))).toEqual(['pending rAF: 1 (expected 0)']);
    window.cancelAnimationFrame(id);
    expect(readIdleProbe(window).pendingRaf).toBe(0);
    expect(settledIdleViolations(readIdleProbe(window))).toEqual([]);
  });

  it('a leaky perf.frames-style loop (id never stored) stays pending; the fixed loop does not', async () => {
    // leaky: the shape tests/helpers perf.frames has on next today (REQ-FIN-08 fix pending, FIN-A)
    let stop = false;
    const leaky = () => { if (!stop) window.requestAnimationFrame(leaky); };
    window.requestAnimationFrame(leaky);
    await nextFrame();
    expect(readIdleProbe(window).pendingRaf).toBe(1);
    stop = true;
    await nextFrame();
    await nextFrame();
    expect(readIdleProbe(window).pendingRaf).toBe(0);

    // fixed: stores the id and cancels on collect
    const rec = { rafId: 0, stamps: [] as number[] };
    const loop = (t: number) => { rec.stamps.push(t); rec.rafId = window.requestAnimationFrame(loop); };
    rec.rafId = window.requestAnimationFrame(loop);
    await nextFrame();
    await nextFrame();
    window.cancelAnimationFrame(rec.rafId);
    expect(rec.stamps.length).toBeGreaterThan(0);
    expect(readIdleProbe(window).pendingRaf).toBe(0);
  });

  it('counts rAF callbacks fired since the mark', async () => {
    markIdleProbe(window);
    expect(readIdleProbe(window).rafFired).toBe(0);
    await nextFrame();
    expect(readIdleProbe(window).rafFired).toBe(1);
    markIdleProbe(window);
    expect(readIdleProbe(window).rafFired).toBe(0);
  });

  it('counts live intervals; clearInterval and clearTimeout both release them', () => {
    const a = window.setInterval(() => undefined, 1000);
    const b = window.setInterval(() => undefined, 1000);
    expect(readIdleProbe(window).intervals).toBe(2);
    expect(settledIdleViolations(readIdleProbe(window))).toEqual(['live intervals: 2 (expected 0)']);
    window.clearInterval(a);
    expect(readIdleProbe(window).intervals).toBe(1);
    window.clearTimeout(b);
    expect(readIdleProbe(window).intervals).toBe(0);
  });

  it('fails an infinite animation and only allows one transform/opacity loop for indeterminate progress', () => {
    const el = document.createElement('div');
    el.setAttribute('data-ag-part', 'indicator');
    document.body.appendChild(el);
    setAnimations([fakeAnimation(el, ['transform'], Infinity)]);
    const snap = readIdleProbe(window);
    expect(snap.running).toHaveLength(1);
    expect(snap.running[0]).toMatchObject({ infinite: true, properties: ['transform'], target: 'div[data-ag-part=indicator]' });
    expect(settledIdleViolations(snap)).toHaveLength(1);
    expect(settledIdleViolations(snap, { indeterminate: true })).toEqual([]);
    expect(settledIdleViolations(snap, { indeterminate: true, reducedMotion: true })).toHaveLength(1);

    setAnimations([fakeAnimation(el, ['width'], Infinity)]);
    expect(settledIdleViolations(readIdleProbe(window), { indeterminate: true })).toHaveLength(1);

    setAnimations([fakeAnimation(el, ['opacity'], Infinity), fakeAnimation(el, ['transform'], Infinity)]);
    expect(settledIdleViolations(readIdleProbe(window), { indeterminate: true })).toHaveLength(1);

    setAnimations([fakeAnimation(el, ['opacity'], 1)]);
    expect(settledIdleViolations(readIdleProbe(window))).toEqual([]);
    setAnimations([fakeAnimation(el, ['opacity'], Infinity, 'paused')]);
    expect(readIdleProbe(window).running).toHaveLength(0);
  });

  it('reports elements whose computed will-change is not auto', () => {
    const el = document.createElement('div');
    el.id = 'held';
    el.style.willChange = 'transform';
    document.body.appendChild(el);
    const wc = readIdleProbe(window).willChange;
    expect(wc).toContain('div#held will-change:transform');
    el.style.willChange = 'auto';
    expect(readIdleProbe(window).willChange).toEqual([]);
  });

  it('records the last transitionend so the lane can wait for settle', () => {
    expect(readIdleProbe(window).sinceLastEnd).toBe(Infinity);
    document.body.dispatchEvent(new Event('transitionend', { bubbles: true }));
    const since = readIdleProbe(window).sinceLastEnd;
    expect(Number.isFinite(since)).toBe(true);
    expect(since).toBeGreaterThanOrEqual(0);
  });

  it('throws instead of reporting idle when the probe or getAnimations is missing', () => {
    delete (document as unknown as { getAnimations?: unknown }).getAnimations;
    expect(() => readIdleProbe(window)).toThrow(/getAnimations/);
    delete (window as ProbeWindow).__agIdleProbe;
    expect(() => readIdleProbe(window)).toThrow(/not installed/);
    expect(() => markIdleProbe(window)).toThrow(/not installed/);
  });

  it('snapshot shape is stable', () => {
    const snap: IdleSnapshot = readIdleProbe(window);
    expect(Object.keys(snap).sort()).toEqual(['intervals', 'pendingRaf', 'rafFired', 'running', 'sinceLastEnd', 'willChange']);
  });
});
