/* MAT-213 REQ-MOT-T11: startMorph — native VT when present, FLIP otherwise;
   update exactly once; AbortError/InvalidStateError swallowed; data-ag-vt
   lifecycle; none = synchronous; reactViewTransition detection. */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import * as React from 'react';
import { startMorph, reactViewTransition } from '../viewTransition';

jest.useFakeTimers();

const surface = () => {
  const el = document.createElement('div');
  el.setAttribute('data-ag-surface', '');
  document.body.appendChild(el);
  return el;
};

type VTStub = (spec: unknown) => { finished: Promise<void> };

const withVT = (impl: VTStub | ((...args: never[]) => unknown)) => {
  (document as unknown as Record<string, unknown>).startViewTransition = impl;
};
const withoutVT = () => {
  (document as unknown as Record<string, unknown>).startViewTransition = undefined;
};

const abortErr = () => new DOMException('aborted', 'AbortError');
const invalidErr = () => new DOMException('invalid', 'InvalidStateError');

beforeEach(() => {
  withoutVT();
  document.documentElement.removeAttribute('data-ag-motion');
});
afterEach(() => {
  withoutVT();
  jest.clearAllTimers();
  jest.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('startMorph — native path (REQ-MOT-36)', () => {
  it('uses document.startViewTransition with types [ag-morph]', async () => {
    const el = surface();
    const spy = jest.fn((spec: { update: () => void; types?: string[] }) => {
      expect(spec.types).toEqual(['ag-morph']);
      spec.update();
      return { finished: Promise.resolve() };
    });
    withVT(spy as unknown as VTStub);
    let ran = 0;
    await startMorph(() => { ran += 1; }, { surfaces: [el], motion: 'full' });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(ran).toBe(1);
    expect(el.hasAttribute('data-ag-vt')).toBe(false); // removed after finished
    expect(el.hasAttribute('data-ag-vt-settled')).toBe(true);
    jest.advanceTimersByTime(200);
    expect(el.hasAttribute('data-ag-vt-settled')).toBe(false); // cleared after micro
  });
  it('calm runs with the ag-morph-calm type', async () => {
    const spy = jest.fn((spec: { update: () => void; types?: string[] }) => {
      expect(spec.types).toEqual(['ag-morph-calm']);
      spec.update();
      return { finished: Promise.resolve() };
    });
    withVT(spy as unknown as VTStub);
    await startMorph(() => {}, { surfaces: [surface()], motion: 'calm' });
  });
  it('falls back to the callback form on TypeError', async () => {
    let calls = 0;
    withVT(((spec: unknown) => {
      calls += 1;
      if (calls === 1) throw new TypeError('object form unsupported');
      (spec as () => void)();
      return { finished: Promise.resolve() };
    }) as VTStub);
    let ran = 0;
    await startMorph(() => { ran += 1; }, { surfaces: [surface()], motion: 'full' });
    expect(calls).toBe(2);
    expect(ran).toBe(1);
  });
  it.each(['AbortError', 'InvalidStateError'])('update runs once when finished rejects with %s', async (name) => {
    withVT(((spec: { update: () => void }) => {
      spec.update();
      return { finished: Promise.reject(name === 'AbortError' ? abortErr() : invalidErr()) };
    }) as VTStub);
    let ran = 0;
    await startMorph(() => { ran += 1; }, { surfaces: [surface()], motion: 'full' });
    expect(ran).toBe(1);
  });
});

describe('startMorph — FLIP fallback (REQ-MOT-39)', () => {
  const animateStub = (el: Element) => {
    const calls: Array<[Keyframe[], KeyframeAnimationOptions?]> = [];
    // jsdom has no WAAPI — install a recorder
    (el as unknown as Record<string, unknown>).animate = (k: Keyframe[] | Keyframe, o?: KeyframeAnimationOptions) => {
      calls.push([(Array.isArray(k) ? k : [k]) as Keyframe[], o ?? {}]);
      return { finished: Promise.resolve(), finish: jest.fn() } as unknown as Animation;
    };
    return calls;
  };
  it('animates transform-only keyframes with spring-fluid timing from computed style', async () => {
    const el = surface();
    const calls = animateStub(el);
    const rects = [
      { left: 10, top: 10, width: 100, height: 50 },
      { left: 40, top: 10, width: 200, height: 50 },
    ];
    let i = 0;
    jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => rects[i++] as DOMRect);
    // jsdom resolves custom properties only when set on the element itself
    el.style.setProperty('--ag-spring-fluid', 'linear(0,1)');
    el.style.setProperty('--ag-spring-fluid-duration', '450');
    let ran = 0;
    await startMorph(() => { ran += 1; }, { surfaces: [el], motion: 'full' });
    expect(ran).toBe(1);
    expect(calls).toHaveLength(1);
    const [frames, opts] = calls[0]!;
    for (const f of frames) {
      const keys = Object.keys(f);
      expect(keys.every((k) => k === 'transform' || k === 'transformOrigin')).toBe(true);
    }
    expect(frames[0]!.transform).toBe('translate(-30px, 0px) scale(0.5, 1)');
    expect(opts?.easing).toBe('linear(0,1)');
    expect(opts?.duration).toBe(450);
  });
  it('no-ops the animation when geometry is unchanged but still runs update once', async () => {
    const el = surface();
    const calls = animateStub(el);
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(
      { left: 0, top: 0, width: 10, height: 10 } as DOMRect);
    let ran = 0;
    await startMorph(() => { ran += 1; }, { surfaces: [el], motion: 'full' });
    expect(ran).toBe(1);
    expect(calls).toHaveLength(0);
  });
});

describe('startMorph — none + sync (REQ-MOT-36)', () => {
  it('mode none runs update synchronously with no VT call', async () => {
    const spy = jest.fn(() => ({ finished: Promise.resolve() }));
    withVT(spy as unknown as VTStub);
    let ran = 0;
    await startMorph(() => { ran += 1; }, { surfaces: [surface()], motion: 'none' });
    expect(ran).toBe(1);
    expect(spy).not.toHaveBeenCalled();
  });
  it('data-ag-vt is set before update and removed after finished', async () => {
    const el = surface();
    let vtAttrDuringUpdate = false;
    withVT(((spec: { update: () => void }) => {
      vtAttrDuringUpdate = el.hasAttribute('data-ag-vt');
      spec.update();
      return { finished: Promise.resolve() };
    }) as VTStub);
    await startMorph(() => {}, { surfaces: [el], motion: 'full' });
    expect(vtAttrDuringUpdate).toBe(true);
    expect(el.hasAttribute('data-ag-vt')).toBe(false);
  });
});

describe('reactViewTransition (REQ-MOT-36)', () => {
  it('reflects React.ViewTransition ?? React.unstable_ViewTransition ?? null', () => {
    const R = React as unknown as Record<string, unknown>;
    const expected = R.ViewTransition ?? R.unstable_ViewTransition ?? null;
    expect(reactViewTransition).toBe(expected);
  });
});
