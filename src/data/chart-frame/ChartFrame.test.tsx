/** @jest-environment jsdom */
// SURF-183: legend toggling + last-series guard, table fallback modes,
// context from ResizeObserver.
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { ChartFrame } from './ChartFrame';

type Row = { m: string; a: number; b: number };
const DATA: Row[] = [
  { m: 'Jan', a: 1, b: 4 },
  { m: 'Feb', a: 3, b: 2 },
];
const SERIES = [
  { key: 'a', label: 'Alpha' },
  { key: 'b', label: 'Beta' },
];

// jsdom has no ResizeObserver — stub one that reports 640.
class RO {
  cb: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) {
    this.cb = cb;
  }
  observe(el: Element) {
    this.cb([{ contentRect: { width: 640, height: 240 } } as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
  unobserve() {}
  disconnect() {}
}
beforeEach(() => {
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = RO;
});

function F(props: Partial<Parameters<typeof ChartFrame<Row>>[0]>) {
  return (
    <ChartFrame title="Sales" data={DATA} series={SERIES} x={{ key: 'm', label: 'Month' }} {...props}>
      {(ctx) => <div data-testid="plot">{ctx.visibleSeries.length} series @ {ctx.width}px</div>}
    </ChartFrame>
  );
}

describe('ChartFrame (SURF-181)', () => {
  it('figcaption + context drive the adapter', () => {
    const { container, getByTestId } = render(<F />);
    expect(container.querySelector('figcaption')!.textContent).toContain('Sales');
    expect(getByTestId('plot').textContent).toContain('2 series @ 640');
  });

  it('legend toggles hide a series; last visible is protected', () => {
    const { container } = render(<F />);
    const btns = container.querySelectorAll('[data-ag-part="chart-legend-item"]');
    fireEvent.click(btns[0]!);
    expect(btns[0]!.getAttribute('aria-pressed')).toBe('false');
    // Beta is now the last visible — aria-disabled
    expect(btns[1]!.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(btns[1]!);
    expect(container.querySelectorAll('[aria-pressed="true"]').length).toBe(1);
  });

  it('table toggle shows/hides the data table', () => {
    const { container } = render(<F table="toggle" />);
    const toggle = container.querySelector('[data-ag-part="chart-table-toggle"]')!;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const rows = container.querySelectorAll('[data-ag-part="chart-table"] tbody tr');
    expect(rows.length).toBe(2);
  });

  it('visually-hidden keeps the table in the a11y tree and hides the plot', () => {
    const { container } = render(<F table="visually-hidden" />);
    expect(container.querySelector('[data-ag-part="chart-table"].ag-visually-hidden')).toBeTruthy();
    expect(container.querySelector('[data-ag-part="chart-plot"]')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('hiddenSeries controlled pair', () => {
    const on = jest.fn();
    const { container } = render(<F hiddenSeries={['b']} onHiddenSeriesChange={on} />);
    const btns = container.querySelectorAll('[data-ag-part="chart-legend-item"]');
    fireEvent.click(btns[1]!);
    expect(on).toHaveBeenCalledWith([]);
  });
});
