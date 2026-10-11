/* MAT-223 REQ-MOT-T14 + MAT-217/-218/-219/-220/-221/-222, strengthened for
 * REQ-MAT-50 (FIN D.3-30): MotionConfig mode mapping, spring-smooth params,
 * drag dismiss/detent, momentum settle, magnetic cap + listener cleanup, and
 * Shared's data-ag-animating lifecycle. */
import { describe, expect, it, jest, beforeAll, beforeEach, afterEach } from '@jest/globals';
import * as React from 'react';
import { act, render } from '@testing-library/react';
import * as MotionReact from 'motion/react';
import { MotionConfigContext } from 'motion/react';
import { setMotionPeer } from '../peer';
import { toMotionTransition } from '../toMotionTransition';
import { MotionProvider, Shared, SharedLayout, magnetic, useDragDetents, useMomentum } from '../index';
import { MotionCapabilityContext } from '../../capability';
import { motionTokens } from '../../tokens.generated';
import { PreferenceStoreContext } from '../../../theme/preferences/usePreference';
import { createPreferenceStore } from '../../../theme/preferences/store';
import { DURATIONS_MS, EASES } from '../../../contracts/motion';
import type { DurationName } from '../../../contracts/motion';
import type { DragBindings } from '../../../contracts/motion';

/* public.ts loads the peer with a top-level await, which jest's CJS transform
 * cannot evaluate; the frozen 7-name surface of the built entry is asserted by
 * scripts/mat/verify-motion-entry.mjs (check `with-peer-exports`) instead.
 * Here the adapter gets the same peer the entry would install. */
beforeAll(() => { setMotionPeer(MotionReact); });

type MagneticBindingsLocal = {
  ref: (el: HTMLElement | null) => void;
  style: { x: { get(): number }; y: { get(): number } };
};

const mt = motionTokens as Record<string, unknown>;
const tok = (dotted: string, dashed: string) => (mt[dotted] ?? mt[dashed]) as number;

/* Deterministic rAF: the shared ticker schedules through requestAnimationFrame,
 * and every test steps frames explicitly with a monotonic clock. */
let rafQ: Array<{ id: number; cb: (t: number) => void }> = [];
let rafSeq = 0;
let clock = 0;
const frame = (ms = 16) => { clock += ms; const q = rafQ; rafQ = []; for (const { cb } of q) cb(clock); };
const origRAF = globalThis.requestAnimationFrame;
const origCAF = globalThis.cancelAnimationFrame;

beforeEach(() => {
  rafQ = []; rafSeq = 0; clock = 0;
  globalThis.requestAnimationFrame = ((cb: (t: number) => void) => {
    const id = ++rafSeq; rafQ.push({ id, cb }); return id;
  }) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = ((id: number) => { rafQ = rafQ.filter((r) => r.id !== id); }) as typeof cancelAnimationFrame;
});
afterEach(() => {
  // every animation started in a test must have finished: a stale subscriber
  // would keep the shared ticker's rAF id alive into the next test
  expect(rafQ).toEqual([]);
  globalThis.requestAnimationFrame = origRAF;
  globalThis.cancelAnimationFrame = origCAF;
  jest.restoreAllMocks();
  document.documentElement.removeAttribute('data-ag-motion');
});

describe('adapter peer holder (REQ-MAT-50)', () => {
  it('adapter APIs throw until the entry has installed the peer', () => {
    jest.isolateModules(() => {
      // a fresh module registry: nothing has called setMotionPeer here
      const fresh = require('../peer') as typeof import('../peer');
      expect(() => fresh.motionPeer()).toThrow(/peer is not loaded/);
      fresh.setMotionPeer(MotionReact);
      expect(fresh.motionPeer().MotionConfig).toBe(MotionReact.MotionConfig);
    });
  });
});

describe('toMotionTransition (REQ-MOT-52/-53)', () => {
  it('spring-smooth maps to a spring with stiffness ≈ 322.3, damping ≈ 32.31 and unit mass', () => {
    const t = toMotionTransition('spring-smooth') as unknown as Record<string, unknown>;
    expect(Object.keys(t).sort()).toEqual(['damping', 'mass', 'stiffness', 'type']);
    expect(t.type).toBe('spring');
    expect(Math.abs((t.stiffness as number) - 322.3)).toBeLessThan(0.05);
    expect(Math.abs((t.damping as number) - 32.31)).toBeLessThan(0.005);
    expect(t.mass).toBe(1);
  });
  it('spring-snappy emits a spring with stiffness, damping and unit mass — no bounce/visualDuration', () => {
    const t = toMotionTransition('spring-snappy') as unknown as Record<string, unknown>;
    expect(t.type).toBe('spring');
    expect(t.stiffness).toBeCloseTo(986.96, 1);
    expect(t.damping).toBeCloseTo(62.83, 1);
    expect(t.mass).toBe(1);
    expect('bounce' in t).toBe(false);
    expect('visualDuration' in t).toBe(false);
  });
  it('passes velocity through when given', () => {
    expect((toMotionTransition('spring-smooth', { velocity: 4 }) as { velocity?: number }).velocity).toBe(4);
    expect('velocity' in (toMotionTransition('spring-smooth') as object)).toBe(false);
  });
  it('duration converts ms→s and ease is standard', () => {
    for (const d of ['instant', 'micro', 'small', 'medium', 'large'] as DurationName[]) {
      const t = toMotionTransition(`duration-${d}`) as { duration: number; ease: readonly number[] };
      expect(t.duration).toBeCloseTo(tok(`duration.${d}`, `duration-${d}`) / 1000, 6);
      expect(t.duration).toBeCloseTo(DURATIONS_MS[d].enter / 1000, 6);
      expect(t.ease).toEqual(EASES.standard);
    }
  });
  it('exit uses durationExit + ease.accelerate', () => {
    const t = toMotionTransition('duration-small', { exit: true }) as { duration: number; ease: readonly number[] };
    expect(t.duration).toBeCloseTo(tok('duration.small-exit', 'duration-small-exit') / 1000, 6);
    expect(t.duration).toBeCloseTo(DURATIONS_MS.small.exit / 1000, 6);
    expect(t.ease).toEqual(EASES.accelerate);
  });
});

describe('MotionProvider (REQ-MOT-54)', () => {
  it('provides a MotionCapability with real dragDetents/momentum impls', () => {
    let cap: unknown = null;
    const Probe = () => { cap = React.useContext(MotionCapabilityContext); return null; };
    render(<MotionProvider><Probe /></MotionProvider>);
    expect(typeof (cap as { dragDetents?: unknown }).dragDetents).toBe('function');
    expect(typeof (cap as { momentum?: unknown }).momentum).toBe('function');
  });

  const reducedMotionFor = (pref: 'full' | 'calm' | 'none' | 'system', attr?: string): string | undefined => {
    if (attr) document.documentElement.setAttribute('data-ag-motion', attr);
    const store = createPreferenceStore({ storage: null, target: null });
    store.set('motion', pref);
    let value: string | undefined;
    const Probe = () => { value = React.useContext(MotionConfigContext).reducedMotion; return null; };
    render(
      <PreferenceStoreContext.Provider value={store}>
        <MotionProvider><Probe /></MotionProvider>
      </PreferenceStoreContext.Provider>,
    );
    return value;
  };

  it.each([
    ['full', 'never'],
    ['calm', 'always'],
    ['none', 'always'],
  ] as const)('preference %s → MotionConfig reducedMotion="%s"', (pref, expected) => {
    expect(reducedMotionFor(pref)).toBe(expected);
  });
  it.each([
    ['full', 'never'],
    ['calm', 'always'],
    ['none', 'always'],
  ] as const)('preference system with resolved data-ag-motion=%s → reducedMotion="%s"', (attr, expected) => {
    expect(reducedMotionFor('system', attr)).toBe(expected);
  });
});

/* Pointer events at a fixed velocity along y. jsdom has no PointerEvent, so
 * MouseEvents carry pointerId/timeStamp the way the gesture engines read them. */
const mk = (type: string, y: number, t: number, target?: HTMLElement) => {
  const ev = new MouseEvent(type, { clientY: y, clientX: 0, bubbles: true });
  Object.defineProperty(ev, 'timeStamp', { value: t });
  Object.defineProperty(ev, 'pointerId', { value: 1 });
  if (target) Object.defineProperty(ev, 'currentTarget', { value: target });
  return ev as unknown as PointerEvent;
};
const drag = (el: HTMLElement, b: DragBindings, opts: { from: number; vPxS: number; ms: number }) => {
  b.onPointerDown(mk('pointerdown', opts.from, 0, el));
  const steps = 20;
  const dt = opts.ms / steps;
  let y = opts.from;
  for (let i = 1; i <= steps; i++) {
    y = opts.from + (opts.vPxS * dt * i) / 1000;
    el.dispatchEvent(mk('pointermove', y, dt * i));
  }
  const tUp = opts.ms + dt;
  el.dispatchEvent(mk('pointerup', opts.from + (opts.vPxS * tUp) / 1000, tUp));
};
const yOf = (el: HTMLElement) => parseFloat(el.style.getPropertyValue('--_ag-drag-y'));

describe('useDragDetents (REQ-MOT-55/-103)', () => {
  const mount = (detents: number[], start: number) => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'offsetHeight', { value: 1000 });
    el.style.setProperty('--_ag-drag-y', `${start}px`);
    document.body.appendChild(el);
    const settled: number[] = [];
    let bindings: DragBindings | null = null;
    const Comp = () => {
      bindings = useDragDetents({ detents, axis: 'y', onSettle: (i) => { settled.push(i); } });
      return null;
    };
    const r = render(<MotionProvider><Comp /></MotionProvider>);
    return { el, settled, bindings: bindings!, cleanup: () => { r.unmount(); el.remove(); } };
  };
  const runSpring = (settled: number[]) => {
    for (let i = 0; i < 200 && settled.length === 0; i++) frame(16);
  };

  it('a +1500 px/s release dismisses to the far detent', () => {
    document.documentElement.setAttribute('data-ag-motion', 'full');
    const m = mount([0, 300, 600], 300);
    drag(m.el, m.bindings, { from: 300, vPxS: 1500, ms: 100 }); // 150 px travel: < 25% of 1000
    runSpring(m.settled);
    expect(m.settled).toEqual([2]);
    expect(yOf(m.el)).toBe(600);
    m.cleanup();
  });
  it('a −1500 px/s release dismisses to the near detent', () => {
    document.documentElement.setAttribute('data-ag-motion', 'full');
    const m = mount([0, 300, 600], 300);
    drag(m.el, m.bindings, { from: 300, vPxS: -1500, ms: 100 });
    runSpring(m.settled);
    expect(m.settled).toEqual([0]);
    expect(yOf(m.el)).toBe(0);
    m.cleanup();
  });
  it('a slow drag snaps exactly to the detent nearest position + velocity × 0.2', () => {
    document.documentElement.setAttribute('data-ag-motion', 'full');
    const m = mount([0, 300, 600], 300);
    // 100 px/s for 1.6 s → released at ~468 px; projected ~488 → detent 600 (idx 2)
    drag(m.el, m.bindings, { from: 300, vPxS: 100, ms: 1600 });
    runSpring(m.settled);
    expect(m.settled).toEqual([2]);
    expect(yOf(m.el)).toBe(600);
    m.cleanup();
  });
  it('a slow short drag returns to its own detent', () => {
    document.documentElement.setAttribute('data-ag-motion', 'full');
    const m = mount([0, 300, 600], 300);
    drag(m.el, m.bindings, { from: 300, vPxS: 100, ms: 500 }); // ~352 px, projected ~372 → 300
    runSpring(m.settled);
    expect(m.settled).toEqual([1]);
    expect(yOf(m.el)).toBe(300);
    m.cleanup();
  });
  it('the spring settles on the frame clock within 1.6 × the smooth response', () => {
    document.documentElement.setAttribute('data-ag-motion', 'full');
    const m = mount([0, 300, 600], 300);
    drag(m.el, m.bindings, { from: 300, vPxS: 1500, ms: 100 });
    let frames = 0;
    while (m.settled.length === 0 && frames < 200) { frame(16); frames++; }
    expect(m.settled).toEqual([2]);
    expect(frames * 16).toBeLessThanOrEqual(350 * 1.6 + 16);
    m.cleanup();
  });
  it('under motion none the release jumps without frames', () => {
    document.documentElement.setAttribute('data-ag-motion', 'none');
    const m = mount([0, 300, 600], 300);
    drag(m.el, m.bindings, { from: 300, vPxS: 1500, ms: 100 });
    expect(m.settled).toEqual([2]);
    expect(yOf(m.el)).toBe(600);
    m.cleanup();
  });
});

describe('useMomentum (REQ-MOT-56)', () => {
  const mount = (bounds: [number, number]) => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    let bindings: DragBindings | null = null;
    const Comp = () => { bindings = useMomentum({ axis: 'y', bounds }); return null; };
    const r = render(<MotionProvider><Comp /></MotionProvider>);
    return { el, bindings: bindings!, cleanup: () => { r.unmount(); el.remove(); } };
  };
  const runInertia = (el: HTMLElement) => {
    const samples: number[] = [];
    let elapsed = 0;
    while (rafQ.length > 0 && elapsed < 3000) { frame(16); elapsed += 16; samples.push(yOf(el)); }
    return { elapsed, samples };
  };

  it('inertia after release settles in ≤ 1000 ms and stays within bounds', () => {
    document.documentElement.setAttribute('data-ag-motion', 'full');
    const m = mount([-400, 400]);
    drag(m.el, m.bindings, { from: 0, vPxS: 3000, ms: 60 });
    const releasedAt = yOf(m.el);
    expect(rafQ.length).toBe(1); // inertia is running on the ticker
    const { elapsed, samples } = runInertia(m.el);
    expect(elapsed).toBeLessThanOrEqual(1000 + 16 * 2);
    expect(samples.length).toBeGreaterThan(0);
    for (const s of samples) { expect(s).toBeGreaterThanOrEqual(-400); expect(s).toBeLessThanOrEqual(400); }
    expect(samples.at(-1)!).toBeGreaterThan(releasedAt); // it moved past the release point
    m.cleanup();
  });
  it('a new pointerdown interrupts running inertia', () => {
    document.documentElement.setAttribute('data-ag-motion', 'full');
    const m = mount([-2000, 2000]);
    drag(m.el, m.bindings, { from: 0, vPxS: 2000, ms: 60 });
    frame(16); frame(16);
    expect(rafQ.length).toBe(1);
    const at = yOf(m.el);
    m.bindings.onPointerDown(mk('pointerdown', 0, 500, m.el));
    expect(rafQ.length).toBe(0); // unsubscribed: the ticker has no subscribers left
    frame(16);
    expect(yOf(m.el)).toBe(at);
    m.el.dispatchEvent(mk('pointerup', 0, 520));
    m.cleanup();
  });
});

describe('magnetic (REQ-MOT-57)', () => {
  const fine = () => {
    window.matchMedia = ((q: string) => ({
      matches: q === '(pointer: fine)', media: q, onchange: null,
      addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  };
  const rect = (el: HTMLElement, w: number, h: number) => {
    el.getBoundingClientRect = () => ({ left: 0, top: 0, width: w, height: h, right: w, bottom: h, x: 0, y: 0, toJSON() { return {}; } }) as DOMRect;
  };
  const settleReal = () => act(async () => { await new Promise((r) => setTimeout(r, 700)); });
  // motion's own frameloop drives useSpring; restore the platform rAF for it
  const realFrames = () => {
    globalThis.requestAnimationFrame = origRAF;
    globalThis.cancelAnimationFrame = origCAF;
  };

  it('moves at most min(strength·0.5·min(w,h), 8) px toward the pointer, and returns on leave', async () => {
    realFrames();
    fine();
    document.documentElement.setAttribute('data-ag-motion', 'full');
    let b: MagneticBindingsLocal | null = null;
    const Comp = () => { b = magnetic({ strength: 0.9 }) as unknown as MagneticBindingsLocal; return <div ref={b.ref} data-m />; };
    const { container, unmount } = render(<Comp />);
    const el = container.querySelector<HTMLElement>('[data-m]')!;
    rect(el, 200, 200); // strength clamps to 0.3 → 0.3·0.5·200 = 30 → capped at 8
    el.dispatchEvent(new MouseEvent('pointermove', { clientX: 5000, clientY: 100 }));
    await settleReal();
    expect(b!.style.x.get()).toBeCloseTo(8, 1);
    expect(Math.hypot(b!.style.x.get(), b!.style.y.get())).toBeLessThanOrEqual(8 + 1e-6);
    el.dispatchEvent(new MouseEvent('pointerleave', {}));
    await settleReal();
    expect(b!.style.x.get()).toBeCloseTo(0, 1);
    unmount();
  });
  it('caps by the element size for small elements', async () => {
    realFrames();
    fine();
    document.documentElement.setAttribute('data-ag-motion', 'full');
    let b: MagneticBindingsLocal | null = null;
    const Comp = () => { b = magnetic({ strength: 0.2 }) as unknown as MagneticBindingsLocal; return <div ref={b.ref} data-m />; };
    const { container, unmount } = render(<Comp />);
    const el = container.querySelector<HTMLElement>('[data-m]')!;
    rect(el, 40, 40); // 0.2·0.5·40 = 4 px
    el.dispatchEvent(new MouseEvent('pointermove', { clientX: 20, clientY: 5000 }));
    await settleReal();
    expect(b!.style.y.get()).toBeCloseTo(4, 1);
    unmount();
  });
  it('is inert unless resolved motion is full', async () => {
    realFrames();
    fine();
    document.documentElement.setAttribute('data-ag-motion', 'calm');
    let b: MagneticBindingsLocal | null = null;
    const Comp = () => { b = magnetic({ strength: 0.3 }) as unknown as MagneticBindingsLocal; return <div ref={b.ref} data-m />; };
    const add = jest.spyOn(HTMLElement.prototype, 'addEventListener');
    const { container, unmount } = render(<Comp />);
    const el = container.querySelector<HTMLElement>('[data-m]')!;
    expect(add.mock.calls.filter((c, i) => c[0] === 'pointermove' && add.mock.contexts[i] === el)).toEqual([]);
    rect(el, 200, 200);
    el.dispatchEvent(new MouseEvent('pointermove', { clientX: 5000, clientY: 100 }));
    await settleReal();
    expect(b!.style.x.get()).toBe(0);
    unmount();
  });
  it('removes exactly the listeners it added on unmount', () => {
    realFrames();
    fine();
    document.documentElement.setAttribute('data-ag-motion', 'full');
    const add = jest.spyOn(HTMLElement.prototype, 'addEventListener');
    const remove = jest.spyOn(HTMLElement.prototype, 'removeEventListener');
    let b: MagneticBindingsLocal | null = null;
    const Comp = () => { b = magnetic({ strength: 0.3 }) as unknown as MagneticBindingsLocal; return <div ref={b.ref} data-m />; };
    const { container, unmount } = render(<Comp />);
    const el = container.querySelector<HTMLElement>('[data-m]')!;
    const added = add.mock.calls
      .filter((_c, i) => add.mock.contexts[i] === el)
      .map(([type, fn]) => [type, fn]);
    expect(added.map(([t]) => t).sort()).toEqual(['pointerleave', 'pointermove']);
    expect(remove.mock.calls.filter((_c, i) => remove.mock.contexts[i] === el)).toEqual([]);
    unmount();
    const removed = remove.mock.calls
      .filter((_c, i) => remove.mock.contexts[i] === el)
      .map(([type, fn]) => [type, fn]);
    expect(removed).toEqual(expect.arrayContaining(added));
    expect(removed).toHaveLength(added.length);
    void b;
  });
});

describe('SharedLayout / Shared (REQ-MOT-58)', () => {
  it('sets data-ag-animating and --_ag-optics: 0 during a layout animation and clears both after', async () => {
    globalThis.requestAnimationFrame = origRAF;
    globalThis.cancelAnimationFrame = origCAF;
    let box = { left: 0, top: 0, width: 50, height: 50 };
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
      ...box, right: box.left + box.width, bottom: box.top + box.height, x: box.left, y: box.top, toJSON() { return {}; },
    }) as DOMRect);
    const Scene = ({ k }: { k: number }) => (
      <SharedLayout><div key={k}><Shared id="a" data-s={k}><span /></Shared></div></SharedLayout>
    );
    const { container, rerender } = render(<Scene k={1} />);
    const first = container.querySelector<HTMLElement>('[data-s]')!;
    expect(first.hasAttribute('data-ag-animating')).toBe(false);
    box = { left: 200, top: 100, width: 50, height: 50 };
    rerender(<Scene k={2} />);
    const el = container.querySelector<HTMLElement>('[data-s="2"]')!;
    const seen: Array<{ animating: boolean; optics: string }> = [];
    for (let i = 0; i < 40; i++) {
      await act(async () => { await new Promise((r) => setTimeout(r, 25)); });
      seen.push({ animating: el.hasAttribute('data-ag-animating'), optics: el.style.getPropertyValue('--_ag-optics') });
    }
    const during = seen.filter((s) => s.animating);
    expect(during.length).toBeGreaterThan(0);
    for (const s of during) expect(s.optics).toBe('0');
    expect(seen.at(-1)).toEqual({ animating: false, optics: '' });
  });
});
