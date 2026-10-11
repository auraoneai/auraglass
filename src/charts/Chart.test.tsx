/** @jest-environment jsdom */
// SURF-241..248 — Chart on ChartFrame: marks render, server output static,
// yDomain / monotone curve, pointer crosshair, resolvable label and the
// 150 ms debounced announcement (REQ-SURF-161, -163).
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { Chart } from './Chart';
import { ANNOUNCE_DEBOUNCE_MS } from './ChartPlot';

// jsdom has no ResizeObserver — stub one that reports 640x240 so the
// ChartFrame children render-prop runs (real layout comes from the browser).
class RO {
  cb: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) { this.cb = cb; }
  observe() {
    this.cb([{ contentRect: { width: 640, height: 240 } } as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
  unobserve() {}
  disconnect() {}
}
(globalThis as { ResizeObserver?: unknown }).ResizeObserver = RO;
// jsdom has no PointerEvent; fireEvent.pointerMove then drops clientX. A
// MouseEvent subclass carries the coordinates exactly as browsers do.
if (typeof (globalThis as { PointerEvent?: unknown }).PointerEvent === 'undefined') {
  class PE extends MouseEvent {}
  (globalThis as { PointerEvent?: unknown }).PointerEvent = PE;
}

const DATA = [
  { m: 'Jan', a: 30, b: 50 },
  { m: 'Feb', a: 55, b: 40 },
  { m: 'Mar', a: 42, b: 70 },
];

const base = { title: 'Revenue', data: DATA, series: [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }], x: { key: 'm', label: 'Month' } };

const plotOf = (c: HTMLElement) => c.querySelector('svg[data-ag-part="chart-plot-svg"]') as SVGSVGElement;
const liveOf = (c: HTMLElement) => c.querySelector('[role="status"][aria-live="polite"]') as HTMLElement;
const firstPath = (c: HTMLElement, part: string) => c.querySelector(`[data-ag-part="${part}"] path`)!.getAttribute('d')!;

/** Numbers of an SVG path `d`, grouped per command. */
function commands(d: string): { cmd: string; nums: number[] }[] {
  return [...d.matchAll(/([MLCZ])([^MLCZ]*)/g)].map((m) => ({
    cmd: m[1]!,
    nums: (m[2]!.match(/-?\d+(?:\.\d+)?(?:e-?\d+)?/g) ?? []).map(Number),
  }));
}

/** Samples every cubic segment of a path; returns all sampled y values. */
function sampledY(d: string, steps = 64): number[] {
  const ys: number[] = [];
  let cur: [number, number] = [0, 0];
  for (const { cmd, nums } of commands(d)) {
    if (cmd === 'M' || cmd === 'L') { cur = [nums[0]!, nums[1]!]; ys.push(cur[1]); continue; }
    if (cmd === 'C') {
      const [, y1, , y2, x3, y3] = nums as [number, number, number, number, number, number];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const u = 1 - t;
        ys.push(u * u * u * cur[1] + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3);
      }
      cur = [x3, y3];
    }
  }
  return ys;
}

afterEach(() => { jest.useRealTimers(); });

describe('Chart (SURF-241..248)', () => {
  it('renders inside a ChartFrame with title + legend', () => {
    const { container } = render(<Chart {...base} type="line" />);
    expect(container.querySelector('figcaption')!.textContent).toContain('Revenue');
    expect(container.querySelectorAll('[data-ag-part="chart-legend-item"]').length).toBe(2);
    expect(container.querySelector('[data-ag-part="chart-mark-line"]')).toBeTruthy();
  });

  it('renders area/bar/donut marks', () => {
    for (const [type, part] of [['area', 'chart-mark-area'], ['bar', 'chart-mark-bar'], ['donut', 'chart-mark-donut']] as const) {
      const { container, unmount } = render(<Chart {...base} type={type} />);
      expect(container.querySelector(`[data-ag-part="${part}"]`)).toBeTruthy();
      unmount();
    }
  });

  it('static output is server-renderable', () => {
    const html = renderToString(<Chart {...base} type="line" />);
    expect(html).toContain('chart-mark-line');
    expect(html).toContain('aria-roledescription="chart"');
  });

  it('server HTML hydrates with 0 console errors and the label still resolves', async () => {
    const ui = <Chart {...base} type="line" yDomain={[0, 100]} curve="monotone" />;
    const html = renderToString(ui);
    expect(html).toContain('chart-mark-line');
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    const errors = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { hydrateRoot } = await import('react-dom/client');
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => { root = hydrateRoot(container, ui); });
    expect(errors).not.toHaveBeenCalled();
    errors.mockRestore();
    const svg = plotOf(container);
    expect(document.getElementById(svg.getAttribute('aria-labelledby')!)?.textContent).toBe('Revenue');
    act(() => root!.unmount());
    container.remove();
  });
});

describe('yDomain (REQ-SURF-161)', () => {
  it('a fixed yDomain changes the rendered line path for a known datum', () => {
    const auto = render(<Chart {...base} type="line" />);
    const autoD = firstPath(auto.container, 'chart-mark-line');
    auto.unmount();
    const fixed = render(<Chart {...base} type="line" yDomain={[0, 100]} />);
    const fixedD = firstPath(fixed.container, 'chart-mark-line');
    expect(fixedD).not.toBe(autoD);
    // Jan a=30 on [0,100] over h=240 → y = 240 - 0.3 * 240 = 168.
    const [m] = commands(fixedD);
    expect(m!.cmd).toBe('M');
    expect(m!.nums[1]).toBeCloseTo(168, 6);
  });

  it('a fixed yDomain also drives area and bar extents', () => {
    for (const [type, sel] of [['area', '[data-ag-part="chart-mark-area"] path'], ['bar', '[data-ag-part="chart-mark-bar"] rect']] as const) {
      const a = render(<Chart {...base} type={type} />);
      const autoOut = a.container.querySelector(sel)!.outerHTML;
      a.unmount();
      const f = render(<Chart {...base} type={type} yDomain={[0, 100]} />);
      expect(f.container.querySelector(sel)!.outerHTML).not.toBe(autoOut);
      f.unmount();
    }
    // bar: Jan a=30 on [0,100] → height 0.3 * 240 = 72.
    const { container } = render(<Chart {...base} type="bar" yDomain={[0, 100]} />);
    expect(Number(container.querySelector('[data-ag-part="chart-mark-bar"] rect')!.getAttribute('height'))).toBeCloseTo(72, 6);
  });
});

describe('monotone curve (REQ-SURF-161)', () => {
  // Plateaus and a sharp rise: a Catmull-Rom spline overshoots below 0 and
  // above 100 here; a monotone cubic never leaves the data extent.
  const STEPPY = [
    { m: 'Jan', a: 0 }, { m: 'Feb', a: 0 }, { m: 'Mar', a: 100 },
    { m: 'Apr', a: 100 }, { m: 'May', a: 20 }, { m: 'Jun', a: 90 },
  ];
  it('never exceeds the data min/max', () => {
    const { container } = render(
      <Chart title="Steppy" data={STEPPY} series={[{ key: 'a', label: 'A' }]} x={{ key: 'm', label: 'Month' }} type="line" curve="monotone" yDomain={[0, 100]} />,
    );
    const d = firstPath(container, 'chart-mark-line');
    expect(commands(d).filter((c) => c.cmd === 'C')).toHaveLength(STEPPY.length - 1);
    // data 0..100 on [0,100] over h=240 → pixel y in [0, 240].
    const ys = sampledY(d);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(0 - 1e-9);
    expect(Math.max(...ys)).toBeLessThanOrEqual(240 + 1e-9);
    // flat segments stay flat (Jan→Feb at y=240, Mar→Apr at y=0)
    const segs = commands(d).filter((c) => c.cmd === 'C');
    expect([segs[0]!.nums[1], segs[0]!.nums[3]]).toEqual([240, 240]);
    expect([segs[2]!.nums[1], segs[2]!.nums[3]]).toEqual([0, 0]);
  });
});

describe('pointer crosshair (REQ-SURF-161)', () => {
  it('pointermove shows chart-tooltip and the crosshair for the nearest datum', () => {
    const { container } = render(<Chart {...base} tooltip />);
    const svg = plotOf(container);
    svg.getBoundingClientRect = () => ({ left: 0, top: 0, width: 640, height: 240, right: 640, bottom: 240, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
    expect(container.querySelector('[data-ag-part="chart-tooltip"]')).toBeNull();
    fireEvent.pointerMove(svg, { clientX: 320, clientY: 100 });
    const tip = container.querySelector('[data-ag-part="chart-tooltip"]');
    expect(tip).toBeTruthy();
    expect(tip!.textContent).toContain('Feb');
    expect(tip!.textContent).toContain('A: 55');
    expect(container.querySelector('[data-ag-part="chart-focus-cursor"]')!.getAttribute('x1')).toBe(String((640 / 3) * 1.5));
    fireEvent.pointerLeave(svg);
    expect(container.querySelector('[data-ag-part="chart-tooltip"]')).toBeNull();
  });
});

describe('keyboard + labelling (REQ-SURF-163)', () => {
  it('plot is one tab stop, role=group, labelled by an element carrying the title', () => {
    const { container } = render(<Chart {...base} />);
    const svg = plotOf(container);
    expect(svg.getAttribute('role')).toBe('group');
    expect(svg.getAttribute('aria-roledescription')).toBe('chart');
    expect(svg.getAttribute('tabindex')).toBe('0');
    expect(container.querySelectorAll('[tabindex="0"]').length).toBe(1);
    const labelledBy = svg.getAttribute('aria-labelledby')!;
    expect(document.getElementById(labelledBy)?.textContent).toBe('Revenue');
  });

  it('ArrowRight x3 produces one polite announcement after 150 ms with x and every series value', () => {
    jest.useFakeTimers();
    const { container } = render(<Chart {...base} />);
    const svg = plotOf(container);
    const live = liveOf(container);
    const writes: string[] = [];
    const mo = new MutationObserver(() => { writes.push(live.textContent ?? ''); });
    mo.observe(live, { childList: true, characterData: true, subtree: true });

    fireEvent.keyDown(svg, { key: 'ArrowRight' });
    act(() => { jest.advanceTimersByTime(ANNOUNCE_DEBOUNCE_MS - 50); });
    fireEvent.keyDown(svg, { key: 'ArrowRight' });
    act(() => { jest.advanceTimersByTime(ANNOUNCE_DEBOUNCE_MS - 50); });
    fireEvent.keyDown(svg, { key: 'ArrowRight' });
    // cursor moved immediately; nothing announced inside the debounce window
    expect(container.querySelector('[data-ag-part="chart-focus-cursor"]')).toBeTruthy();
    act(() => { jest.advanceTimersByTime(ANNOUNCE_DEBOUNCE_MS - 1); });
    expect(live.textContent).toBe('');
    act(() => { jest.advanceTimersByTime(1); });
    return Promise.resolve().then(() => {
      mo.disconnect();
      expect(live.textContent).toBe('Mar: A 42, B 70');
      expect(writes.filter((w) => w !== '')).toEqual(['Mar: A 42, B 70']);
    });
  });

  it('clamps at the ends; Home/End jump; ArrowLeft from no cursor starts at the last datum', () => {
    jest.useFakeTimers();
    const { container } = render(<Chart {...base} />);
    const svg = plotOf(container);
    const live = liveOf(container);
    const settle = () => act(() => { jest.advanceTimersByTime(ANNOUNCE_DEBOUNCE_MS); });
    fireEvent.keyDown(svg, { key: 'ArrowLeft' }); settle();
    expect(live.textContent).toContain('Mar');
    fireEvent.keyDown(svg, { key: 'ArrowRight' }); settle();
    expect(live.textContent).toContain('Mar');
    fireEvent.keyDown(svg, { key: 'Home' }); settle();
    expect(live.textContent).toContain('Jan');
    fireEvent.keyDown(svg, { key: 'ArrowLeft' }); settle();
    expect(live.textContent).toContain('Jan');
    fireEvent.keyDown(svg, { key: 'End' }); settle();
    expect(live.textContent).toContain('Mar');
  });

  it('unmount inside the debounce window cancels the pending announcement', () => {
    jest.useFakeTimers();
    const clear = jest.spyOn(globalThis, 'clearTimeout');
    const { container, unmount } = render(<Chart {...base} />);
    fireEvent.keyDown(plotOf(container), { key: 'ArrowRight' });
    const before = clear.mock.calls.length;
    unmount();
    expect(clear.mock.calls.length).toBe(before + 1);
    expect(jest.getTimerCount()).toBe(0);
    clear.mockRestore();
  });

  it('grid + tooltip islands render; the tooltip never announces on its own', () => {
    const { container } = render(<Chart {...base} grid tooltip />);
    expect(container.querySelector('[data-ag-part="chart-grid"]')).toBeTruthy();
    fireEvent.keyDown(plotOf(container), { key: 'ArrowRight' });
    const tip = container.querySelector('[data-ag-part="chart-tooltip"]')!;
    expect(tip).toBeTruthy();
    expect(tip.getAttribute('aria-hidden')).toBe('true');
    expect(tip.getAttribute('role')).toBeNull();
    expect(container.querySelectorAll('[role="status"]').length).toBe(1);
  });
});
