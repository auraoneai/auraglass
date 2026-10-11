// tests/media/motion-floor.test.tsx — REQ-SURF-190 (REQ-FIN-90): no SURF prop
// can raise motion above the OS floor or the app/user motion setting.
//
// The SURF motion opt-ins are CarouselRail `autoplay`, Backdrop `motion="drift"`
// (and its compat callers AuroraBackground `motion="full"` /
// GlassMeshGradient `animate`), and the AI streaming caret / running dots,
// which read the resolved `motion` preference. Each one may only move when
// the provider resolves allowContinuous && motion === 'full', which MAT's
// resolver floors at 'calm' under prefers-reduced-motion. This test drives
// every (OS reduced-motion × app motion × allowContinuous) cell through the
// real AuraGlassProvider and asserts the opt-in never exceeds the floor.
import { afterAll, afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import type { MotionPreference } from '../../src/contracts/motion';
import { AuraGlassProvider } from '../../src/theme/AuraGlassProvider';
import { CarouselRail } from '../../src/media/CarouselRail/CarouselRail';
import { Backdrop } from '../../src/backdrops/Backdrop';
import { AuroraBackground } from '../../src/compat/surf/backdrops/AuroraBackground';
import { StreamingText } from '../../src/ai/message/StreamingText';
import { ToolCall } from '../../src/ai/tool/ToolCall';
import type { AgToolPart } from '../../src/ai/types';

type Cell = { osReduced: boolean; motion: MotionPreference; allowContinuous: boolean };

const CELLS: Cell[] = [];
for (const osReduced of [false, true]) {
  for (const motion of ['full', 'calm', 'none'] as const) {
    for (const allowContinuous of [false, true]) CELLS.push({ osReduced, motion, allowContinuous });
  }
}
/** The only cell in which a SURF loop or autoplay may run. */
const mayMove = (c: Cell) => !c.osReduced && c.motion === 'full' && c.allowContinuous;
/** The motion value SURF parts must see: min(OS ceiling, app setting). */
const flooredMotion = (c: Cell): MotionPreference =>
  c.motion === 'none' ? 'none' : c.osReduced ? 'calm' : c.motion;

const label = (c: Cell) =>
  `os-reduced=${c.osReduced} motion=${c.motion} allowContinuous=${c.allowContinuous}`;

/* One shared fake matchMedia; MAT's MediaQueryList registry caches the MQL
   handle per query but reads `.matches` live, so flipping `osReduced` per
   cell is what the resolver sees. */
let osReduced = false;
const fakeMql = (query: string) => ({
  media: query,
  get matches() { return osReduced && query === '(prefers-reduced-motion: reduce)'; },
  onchange: null,
  addEventListener: () => undefined,
  removeEventListener: () => undefined,
  addListener: () => undefined,
  removeListener: () => undefined,
  dispatchEvent: () => false,
});
const prevMatchMedia = (window as unknown as { matchMedia?: unknown }).matchMedia;
beforeAll(() => { (window as unknown as { matchMedia: unknown }).matchMedia = fakeMql; });
afterAll(() => {
  if (prevMatchMedia === undefined) delete (window as unknown as { matchMedia?: unknown }).matchMedia;
  else (window as unknown as { matchMedia: unknown }).matchMedia = prevMatchMedia;
});

const slides = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ id: `s${i}`, label: `Slide ${i + 1}`, children: `Slide ${i + 1}` }));

afterEach(() => {
  osReduced = false;
  jest.useRealTimers();
  document.documentElement.removeAttribute('data-ag-continuous');
  document.documentElement.removeAttribute('data-ag-motion');
});

describe('SURF motion props never exceed the OS / app floor (REQ-SURF-190)', () => {
  it.each(CELLS.map((c) => [label(c), c] as const))('CarouselRail autoplay — %s', (_name, cell) => {
    osReduced = cell.osReduced;
    jest.useFakeTimers();
    const onIndexChange = jest.fn();
    const { container, unmount } = render(
      <AuraGlassProvider storage={null} motion={cell.motion} allowContinuous={cell.allowContinuous}>
        <CarouselRail.Root label="Gallery" slides={slides(3)} autoplay={{ interval: 5000 }} onIndexChange={onIndexChange} />
      </AuraGlassProvider>,
    );
    const root = container.querySelector('[data-ag-part="carousel"]')!;
    expect(root.getAttribute('data-state')).toBe(mayMove(cell) ? 'autoplaying' : 'stopped');
    act(() => { jest.advanceTimersByTime(5000 * 3); });
    if (mayMove(cell)) expect(onIndexChange).toHaveBeenCalled();
    else expect(onIndexChange).not.toHaveBeenCalled();
    unmount();
  });

  it.each(CELLS.map((c) => [label(c), c] as const))('Backdrop drift + continuous gate — %s', (_name, cell) => {
    osReduced = cell.osReduced;
    const { container, unmount } = render(
      <AuraGlassProvider storage={null} motion={cell.motion} allowContinuous={cell.allowContinuous}>
        <Backdrop preset="aurora" motion="drift" />
        <AuroraBackground motion="full" />
      </AuraGlassProvider>,
    );
    // The drift keyframe is only reachable under [data-ag-continuous="on"].
    expect(document.documentElement.getAttribute('data-ag-continuous')).toBe(mayMove(cell) ? 'on' : null);
    // The provider's resolved motion is the floor; SURF never rewrites the axis.
    expect(document.documentElement.getAttribute('data-ag-motion')).toBe(flooredMotion(cell));
    const backdrops = [...container.querySelectorAll<HTMLElement>('.ag-backdrop')];
    expect(backdrops).toHaveLength(2);
    for (const b of backdrops) {
      expect(b.classList.contains('ag-backdrop--drift')).toBe(true);
      expect(b.hasAttribute('data-ag-motion')).toBe(false);
      expect(b.closest('[data-ag-motion]')).toBe(document.documentElement);
    }
    unmount();
  });

  it.each(CELLS.map((c) => [label(c), c] as const))('StreamingText caret + ToolCall dots see the floored motion — %s', (_name, cell) => {
    osReduced = cell.osReduced;
    const { container, unmount } = render(
      <AuraGlassProvider storage={null} motion={cell.motion} allowContinuous={cell.allowContinuous}>
        <StreamingText text="Hello" streaming />
        <ToolCall part={{ type: 'tool-search', toolCallId: 'tc-1', state: 'input-available', input: { q: 'x' } } as AgToolPart} />
      </AuraGlassProvider>,
    );
    const caret = container.querySelector('[data-ag-part="caret"]')!;
    expect(caret.getAttribute('data-motion')).toBe(flooredMotion(cell));
    const dots = container.querySelector('[data-ag-part="running-dots"]')!;
    expect(dots.getAttribute('data-motion')).toBe(flooredMotion(cell));
    unmount();
  });

  it('a non-streaming StreamingText renders no caret at any motion setting', () => {
    for (const motion of ['full', 'calm', 'none'] as const) {
      const { container, unmount } = render(
        <AuraGlassProvider storage={null} motion={motion} allowContinuous>
          <StreamingText text="Done." />
        </AuraGlassProvider>,
      );
      expect(container.querySelectorAll('[data-ag-part="caret"]')).toHaveLength(0);
      unmount();
    }
  });
});
