/** @jest-environment jsdom */
// SURF-241..248 — Chart on ChartFrame: marks render, server output static,
// keyboard cursor + announce (REQ-SURF-161..164).
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { Chart } from './Chart';

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

const DATA = [
  { m: 'Jan', a: 30, b: 50 },
  { m: 'Feb', a: 55, b: 40 },
  { m: 'Mar', a: 42, b: 70 },
];

const base = { title: 'Revenue', data: DATA, series: [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }], x: { key: 'm', label: 'Month' } };

describe('Chart (SURF-241..248)', () => {
  it('renders inside a ChartFrame with title + legend', () => {
    const { container } = render(<Chart {...base} type="line" />);
    expect(container.querySelector('figcaption')).toHaveTextContent('Revenue');
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

  it('plot is one tab stop, role=group, labelled by the title', () => {
    const { container } = render(<Chart {...base} />);
    const svg = container.querySelector('svg[data-ag-part="chart-plot-svg"]')!;
    expect(svg.getAttribute('role')).toBe('group');
    expect(svg.getAttribute('aria-roledescription')).toBe('chart');
    expect(svg.getAttribute('tabindex')).toBe('0');
    expect(svg.getAttribute('aria-labelledby')).toBeTruthy();
  });

  it('ArrowRight moves the datum cursor and announces politely', () => {
    const { container } = render(<Chart {...base} />);
    const svg = container.querySelector('svg[data-ag-part="chart-plot-svg"]')!;
    fireEvent.keyDown(svg, { key: 'ArrowRight' });
    expect(container.querySelector('[data-ag-part="chart-focus-cursor"]')).toBeTruthy();
    const live = container.querySelector('[role="status"]')!;
    expect(live.textContent).toContain('Jan');
    fireEvent.keyDown(svg, { key: 'ArrowRight' });
    fireEvent.keyUp(svg, { key: 'ArrowRight' }); // flush the debounced pending announce
    expect(live.textContent).toContain('Feb');
  });

  it('grid + tooltip islands render', () => {
    const { container } = render(<Chart {...base} grid tooltip />);
    expect(container.querySelector('[data-ag-part="chart-grid"]')).toBeTruthy();
    fireEvent.keyDown(container.querySelector('svg[data-ag-part="chart-plot-svg"]')!, { key: 'ArrowRight' });
    expect(container.querySelector('[data-ag-part="chart-tooltip"]')).toBeTruthy();
  });
});
