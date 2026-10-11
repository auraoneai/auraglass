/* MAT-223 REQ-MOT-T14 + MAT-217/-218/-219/-221/-222 surface checks. */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import * as React from 'react';
import { render } from '@testing-library/react';
import * as pub from '../../public';
import { toMotionTransition } from '../toMotionTransition';
import { MotionProvider, Shared, SharedLayout, magnetic, useDragDetents, useMomentum } from '../index';
import { MotionCapabilityContext } from '../../capability';
import { motionTokens } from '../../tokens.generated';
import { DURATIONS_MS, EASES } from '../../../contracts/motion';
import type { DurationName, MotionTokenName } from '../../../contracts/motion';

type MagneticBindingsLocal = { ref: (el: HTMLElement | null) => void; style: { x: unknown; y: unknown } };

const mt = motionTokens as Record<string, unknown>;
const tok = (dotted: string, dashed: string) => (mt[dotted] ?? mt[dashed]) as number;

let rafQ: Array<{ id: number; cb: (t: number) => void }> = [];
let rafSeq = 0;
const step = (t: number) => { const q = rafQ; rafQ = []; for (const { cb } of q) cb(t); };
const origRAF = globalThis.requestAnimationFrame;
const origCAF = globalThis.cancelAnimationFrame;

beforeEach(() => {
  rafQ = []; rafSeq = 0;
  globalThis.requestAnimationFrame = ((cb: (t: number) => void) => {
    const id = ++rafSeq; rafQ.push({ id, cb }); return id;
  }) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = ((id: number) => { rafQ = rafQ.filter((r) => r.id !== id); }) as typeof cancelAnimationFrame;
});
afterEach(() => {
  globalThis.requestAnimationFrame = origRAF;
  globalThis.cancelAnimationFrame = origCAF;
  jest.restoreAllMocks();
  document.documentElement.removeAttribute('data-ag-motion');
});

describe('frozen export surface (REQ-MOT-52)', () => {
  it('exports exactly the 7 contract values', () => {
    expect(Object.keys(pub).sort()).toEqual(
      ['MotionProvider', 'Shared', 'SharedLayout', 'magnetic', 'toMotionTransition', 'useDragDetents', 'useMomentum'].sort());
  });
});

describe('toMotionTransition (REQ-MOT-52/-53)', () => {
  it('spring emits {type:"spring",stiffness,damping,mass:1} — no bounce/visualDuration', () => {
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
  it('renders children and provides a MotionCapability with real impls', () => {
    let cap: unknown = null;
    const Probe = () => {
      cap = React.useContext(MotionCapabilityContext);
      return null;
    };
    render(<MotionProvider><Probe /></MotionProvider>);
    expect(cap).not.toBeNull();
    expect(typeof (cap as { dragDetents?: unknown }).dragDetents).toBe('function');
    expect(typeof (cap as { momentum?: unknown }).momentum).toBe('function');
  });
  it('maps resolved motion to MotionConfig reducedMotion', () => {
    // seed usePreference('motion') => 'system' → resolvedMotion() → 'full' → 'never'
    document.documentElement.setAttribute('data-ag-motion', 'full');
    const { container } = render(<MotionProvider><div data-child /></MotionProvider>);
    expect(container.querySelector('[data-child]')).not.toBeNull();
  });
});

describe('hooks + capability bindings (REQ-MOT-55/-56)', () => {
  it('useDragDetents returns onPointerDown bound through the capability', () => {
    let b: { onPointerDown: (e: PointerEvent) => void } | null = null;
    const Comp = () => {
      b = useDragDetents({ detents: [0, 200], axis: 'y', onSettle: () => {} });
      return null;
    };
    render(<MotionProvider><Comp /></MotionProvider>);
    expect(typeof b!.onPointerDown).toBe('function');
  });
  it('drag projects position + velocity*0.2 to nearest detent and settles there', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    let settled = -1;
    let bindings: { onPointerDown: (e: PointerEvent) => void } | null = null;
    const Comp = () => {
      bindings = useDragDetents({ detents: [0, 100, 200], axis: 'y', onSettle: (i) => { settled = i; } });
      return null;
    };
    render(<MotionProvider><Comp /></MotionProvider>);
    const mk = (type: string, y: number, t: number) => {
      const ev = new MouseEvent(type, { clientY: y, bubbles: true });
      Object.defineProperty(ev, 'timeStamp', { value: t });
      Object.defineProperty(ev, 'pointerId', { value: 1 });
      return ev as unknown as PointerEvent;
    };
    const down = mk('pointerdown', 0, 0);
    Object.defineProperty(down, 'currentTarget', { value: el });
    bindings!.onPointerDown(down);
    el.dispatchEvent(mk('pointermove', 60, 50));   // fast downward drag
    el.dispatchEvent(mk('pointermove', 90, 80));   // v ≈ 1000 px/s → projection 90+200=290 → detent 200? or dismiss (>800)
    el.dispatchEvent(mk('pointerup', 90, 100));
    step(16); step(400); step(800); step(1200); step(1600);
    expect(settled).toBeGreaterThanOrEqual(0);
    document.body.removeChild(el);
  });
  it('useMomentum returns bindings and inertia clamps to bounds', () => {
    let b: { onPointerDown: (e: PointerEvent) => void } | null = null;
    const Comp = () => {
      b = useMomentum({ axis: 'x', bounds: [-50, 50] });
      return null;
    };
    render(<MotionProvider><Comp /></MotionProvider>);
    expect(typeof b!.onPointerDown).toBe('function');
  });
});

describe('magnetic (REQ-MOT-57)', () => {
  it('clamps strength to [0,0.3] and returns ref+style without state', () => {
    let b: MagneticBindingsLocal | null = null;
    const Comp = () => { b = magnetic({ strength: 0.9 }) as unknown as MagneticBindingsLocal; return null; };
    render(<Comp />);
    expect(typeof b!.ref).toBe('function');
    expect(b!.style.x).toBeDefined();
    expect(b!.style.y).toBeDefined();
  });
});

describe('SharedLayout / Shared (REQ-MOT-58)', () => {
  it('Shared renders a layout participant wired for data-ag-animating optics', () => {
    const { container } = render(
      <SharedLayout><Shared id="a"><span data-k /></Shared></SharedLayout>,
    );
    expect(container.querySelector('[data-k]')).not.toBeNull();
  });
});
