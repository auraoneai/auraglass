/* MAT-204 REQ-MOT-T09: shared ticker + offscreen ownership + tween + announce.
   rAF and IntersectionObserver are stubbed for deterministic frame stepping. */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import {
  subscribeFrame, observeOffscreen, tween, announceFinal, onMotionChange, resolvedMotion,
} from '../ticker';

/* ---- deterministic rAF ---- */
let rafQ: Array<{ id: number; cb: (t: number) => void }> = [];
let rafSeq = 0;
let cancelled: number[] = [];
const step = (t: number) => {
  const q = rafQ; rafQ = [];
  for (const { cb } of q) cb(t);
};
const scheduled = () => rafQ.length;

/* ---- fake IntersectionObserver ---- */
class FakeIO implements IntersectionObserver {
  static instances: FakeIO[] = [];
  readonly root = null; readonly rootMargin = '0px'; readonly thresholds = [0];
  private cb: IntersectionObserverCallback;
  observed = new Set<Element>();
  constructor(cb: IntersectionObserverCallback) { this.cb = cb; FakeIO.instances.push(this); }
  observe(el: Element) { this.observed.add(el); }
  unobserve(el: Element) { this.observed.delete(el); }
  disconnect() { this.observed.clear(); }
  takeRecords(): IntersectionObserverEntry[] { return []; }
  fire(target: Element, isIntersecting: boolean) {
    this.cb([{ isIntersecting, target } as IntersectionObserverEntry], this);
  }
}

const origIO = globalThis.IntersectionObserver;
const origRAF = globalThis.requestAnimationFrame;
const origCAF = globalThis.cancelAnimationFrame;

beforeEach(() => {
  rafQ = []; rafSeq = 0; cancelled = [];
  // note: the module-level shared observer persists across tests — do not reset
  globalThis.IntersectionObserver = FakeIO as unknown as typeof IntersectionObserver;
  globalThis.requestAnimationFrame = ((cb: (t: number) => void) => {
    const id = ++rafSeq; rafQ.push({ id, cb }); return id;
  }) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = ((id: number) => {
    cancelled.push(id);
    rafQ = rafQ.filter((r) => r.id !== id);
  }) as typeof cancelAnimationFrame;
});
afterEach(() => {
  globalThis.IntersectionObserver = origIO;
  globalThis.requestAnimationFrame = origRAF;
  globalThis.cancelAnimationFrame = origCAF;
  jest.restoreAllMocks();
  document.documentElement.removeAttribute('data-ag-motion');
});

describe('subscribeFrame (REQ-MOT-33)', () => {
  it('runs one shared rAF per frame for 5 subscribers', () => {
    const calls: number[] = [];
    const unsubs = Array.from({ length: 5 }, (_, i) =>
      subscribeFrame((dt) => { calls.push(i * 1000 + dt); }));
    expect(scheduled()).toBe(1); // a single rAF scheduled for all five
    step(16);
    expect(calls.length).toBe(5);
    expect(scheduled()).toBe(1); // rescheduled once for the whole set
    unsubs.forEach((u) => u());
  });
  it('caps dt at 50 ms', () => {
    const dts: number[] = [];
    const u = subscribeFrame((dt) => dts.push(dt));
    step(0);
    step(5000); // giant jump -> clamped
    expect(dts[1]).toBe(50);
    u();
  });
  it('cancels the loop at zero subscribers', () => {
    const u1 = subscribeFrame(() => {});
    const u2 = subscribeFrame(() => {});
    u1(); u2();
    expect(scheduled()).toBe(0);
    expect(cancelled.length).toBeGreaterThanOrEqual(1);
  });
  it('delivers 0 callbacks while the document is hidden', () => {
    let calls = 0;
    const u = subscribeFrame(() => { calls += 1; });
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    step(16); step(32);
    expect(calls).toBe(0);
    expect(scheduled()).toBe(0);
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    step(48);
    expect(calls).toBe(1);
    u();
  });
  it('skips subscribers whose element is offscreen', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    let onscreen = 0, off = 0;
    const u1 = subscribeFrame(() => { onscreen += 1; });
    const u2 = subscribeFrame(() => { off += 1; }, { element: el });
    const io = FakeIO.instances[0]!;
    io.fire(el, false); // element goes offscreen
    step(16);
    expect(onscreen).toBe(1);
    expect(off).toBe(0);    // offscreen subscriber skipped
    expect(el.hasAttribute('data-ag-offscreen')).toBe(true);
    io.fire(el, true);
    step(32);
    expect(off).toBe(1);    // back on-screen
    expect(el.hasAttribute('data-ag-offscreen')).toBe(false);
    u1(); u2();
    document.body.removeChild(el);
  });
});

describe('observeOffscreen (SC-21)', () => {
  it('is the sole writer of data-ag-offscreen via one shared observer', () => {
    const a = document.createElement('div');
    const b = document.createElement('div');
    document.body.append(a, b);
    const before = FakeIO.instances.length;
    const un1 = observeOffscreen(a);
    const un2 = observeOffscreen(b);
    expect(FakeIO.instances.length).toBe(before + (before === 0 ? 1 : 0)); // shared, not re-created
    const io = FakeIO.instances.at(-1)!;
    io.fire(a, false);
    expect(a.hasAttribute('data-ag-offscreen')).toBe(true);
    expect(b.hasAttribute('data-ag-offscreen')).toBe(false);
    io.fire(a, true);
    expect(a.hasAttribute('data-ag-offscreen')).toBe(false);
    un1(); un2();
    expect(io.observed.size).toBe(0);
    document.body.removeChild(a); document.body.removeChild(b);
  });
});

describe('tween (REQ-MOT-26/-34)', () => {
  it('writes intermediate values via the ticker and lands on the final value', async () => {
    const el = document.createElement('span');
    const h = tween(el, 0, 100, { duration: 100, motion: 'full' });
    expect(el.textContent).toBe('0');
    step(0); step(50);
    expect(el.textContent).toBe('50');
    step(110);
    await h.finished;
    expect(el.textContent).toBe('100');
  });
  it('under calm writes the final value immediately', () => {
    const el = document.createElement('span');
    tween(el, 0, 42, { duration: 100, motion: 'calm' });
    expect(el.textContent).toBe('42');
    expect(scheduled()).toBe(0);
  });
  it('under none writes the final value immediately', () => {
    const el = document.createElement('span');
    tween(el, 0, 42, { duration: 100, motion: 'none' });
    expect(el.textContent).toBe('42');
  });
  it('cancel() jumps to the final value', () => {
    const el = document.createElement('span');
    const h = tween(el, 0, 100, { duration: 1000, motion: 'full' });
    step(0); step(200);
    h.cancel();
    expect(el.textContent).toBe('100');
  });
  it('a preference change mid-tween jumps to final within one frame', () => {
    const el = document.createElement('span');
    tween(el, 0, 100, { duration: 1000, motion: 'full' });
    step(0); step(100);
    document.documentElement.setAttribute('data-ag-motion', 'none'); // MO fires
    // MutationObserver delivery is a macrotask hop in jsdom
    return new Promise<void>((r) => setTimeout(r, 0)).then(() => {
      expect(el.textContent).toBe('100');
    });
  });
});

describe('onMotionChange / resolvedMotion', () => {
  it('reads the attribute, else the media floor', () => {
    expect(resolvedMotion()).toBe('full');
    document.documentElement.setAttribute('data-ag-motion', 'calm');
    expect(resolvedMotion()).toBe('calm');
  });
  it('notifies subscribers on attribute change', async () => {
    const seen: string[] = [];
    const off = onMotionChange((m) => { seen.push(m); });
    document.documentElement.setAttribute('data-ag-motion', 'none');
    await new Promise((r) => setTimeout(r, 0));
    expect(seen).toEqual(['none']);
    off();
  });
});

describe('announceFinal (REQ-MOT-116)', () => {
  it('updates a polite atomic live region exactly once', () => {
    const region = document.createElement('div');
    announceFinal(region, 'Settled at 100');
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('aria-atomic')).toBe('true');
    expect(region.textContent).toBe('Settled at 100');
  });
});
