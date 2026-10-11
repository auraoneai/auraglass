/** @jest-environment jsdom */
// SURF-183 / REQ-SURF-92..94: legend toggling + last-series guard, table
// fallback modes and toggle label, narrow legend placement, the measured
// context (dir, colours, placeholder) and ResizeObserver cleanup.
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { ChartFrame } from './ChartFrame';
import type { ChartContext } from './types';

type Row = { m: string; a: number; b: number };
const DATA: Row[] = [
  { m: 'Jan', a: 1, b: 4 },
  { m: 'Feb', a: 3, b: 2 },
];
const SERIES = [
  { key: 'a', label: 'Alpha' },
  { key: 'b', label: 'Beta' },
];

// jsdom has no ResizeObserver: a controllable one. observe() reports the
// configured width synchronously, like the first RO callback after layout.
let roWidth = 640;
const instances: RO[] = [];
class RO {
  cb: ResizeObserverCallback;
  observed: Element[] = [];
  disconnect = jest.fn();
  constructor(cb: ResizeObserverCallback) {
    this.cb = cb;
    instances.push(this);
  }
  observe(el: Element) {
    this.observed.push(el);
    this.cb([{ contentRect: { width: roWidth, height: 240 } } as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
  unobserve() {}
  fire(width: number) {
    this.cb([{ contentRect: { width, height: 240 } } as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
}
const saved = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
beforeEach(() => {
  roWidth = 640;
  instances.length = 0;
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = RO;
});
afterEach(() => {
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = saved;
});

function F(props: Partial<React.ComponentProps<typeof ChartFrame<Row>>>) {
  return (
    <ChartFrame<Row> title="Sales" data={DATA} series={SERIES} x={{ key: 'm', label: 'Month' }} {...props}>
      {props.children ?? ((ctx) => <div data-testid="plot">{ctx.visibleSeries.length} series @ {ctx.width}px</div>)}
    </ChartFrame>
  );
}

const legend = (c: HTMLElement) => c.querySelector('[data-ag-part="chart-legend"]') as HTMLElement | null;
const partOrder = (c: HTMLElement) =>
  [...c.querySelectorAll('figure > [data-ag-part]')].map((el) => el.getAttribute('data-ag-part'));

describe('ChartFrame (SURF-181, REQ-SURF-92..94)', () => {
  it('figcaption + context drive the adapter', () => {
    const { container, getByTestId } = render(<F />);
    expect(container.querySelector('figcaption')!.textContent).toContain('Sales');
    expect(getByTestId('plot').textContent).toContain('2 series @ 640');
  });

  it('legend: toggles hide a series; the last visible one is protected and described', () => {
    const on = jest.fn();
    const { container } = render(<F onHiddenSeriesChange={on} />);
    const btns = container.querySelectorAll<HTMLElement>('[data-ag-part="chart-legend-item"]');
    fireEvent.click(btns[0]!);
    expect(btns[0]!.getAttribute('aria-pressed')).toBe('false');
    expect(on).toHaveBeenLastCalledWith(['a']);
    // Beta is now the last visible series
    expect(btns[1]!.getAttribute('aria-disabled')).toBe('true');
    const descId = btns[1]!.getAttribute('aria-describedby')!;
    expect(container.ownerDocument.getElementById(descId)!.textContent).toBe('At least one series must be visible');
    fireEvent.click(btns[1]!);
    expect(on).toHaveBeenCalledTimes(1);
    expect(container.querySelectorAll('[aria-pressed="true"]').length).toBe(1);
    expect(btns[0]!.hasAttribute('aria-describedby')).toBe(false);
  });

  it('hiddenSeries controlled pair', () => {
    const on = jest.fn();
    const { container } = render(<F hiddenSeries={['b']} onHiddenSeriesChange={on} />);
    const btns = container.querySelectorAll('[data-ag-part="chart-legend-item"]');
    fireEvent.click(btns[1]!);
    expect(on).toHaveBeenCalledWith([]);
  });

  it('table fallback: toggle label switches Show/Hide and aria-expanded follows', () => {
    const { container } = render(<F table="toggle" />);
    const toggle = container.querySelector('[data-ag-part="chart-table-toggle"]')!;
    expect(toggle.textContent).toBe('Show data table');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    const region = container.ownerDocument.getElementById(toggle.getAttribute('aria-controls')!)!;
    expect(region.hidden).toBe(true);
    fireEvent.click(toggle);
    expect(toggle.textContent).toBe('Hide data table');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(region.hidden).toBe(false);
    const table = container.querySelector('[data-ag-part="chart-table"]')!;
    expect(table.querySelector('caption')!.textContent).toBe('Sales');
    expect([...table.querySelectorAll('thead th')].map((th) => th.textContent)).toEqual(['Month', 'Alpha', 'Beta']);
    expect([...table.querySelectorAll('tbody th[scope="row"]')].map((th) => th.textContent)).toEqual(['Jan', 'Feb']);
    fireEvent.click(toggle);
    expect(toggle.textContent).toBe('Show data table');
  });

  it('table fallback: custom show/hide labels', () => {
    const { container } = render(<F labels={{ showTable: 'Tabelle zeigen', hideTable: 'Tabelle ausblenden' }} />);
    const toggle = container.querySelector('[data-ag-part="chart-table-toggle"]')!;
    expect(toggle.textContent).toBe('Tabelle zeigen');
    fireEvent.click(toggle);
    expect(toggle.textContent).toBe('Tabelle ausblenden');
  });

  it('visually-hidden keeps the table in the a11y tree and hides the plot', () => {
    const { container } = render(<F table="visually-hidden" />);
    expect(container.querySelector('[data-ag-part="chart-table"].ag-visually-hidden')).toBeTruthy();
    expect(container.querySelector('[data-ag-part="chart-plot"]')!.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('[data-ag-part="chart-table-toggle"]')).toBeNull();
  });

  it('always shows the table without a toggle', () => {
    const { container } = render(<F table="always" />);
    expect(container.querySelector('[data-ag-part="chart-table-toggle"]')).toBeNull();
    expect(container.querySelector('[data-ag-part="chart-table"]')!.closest('[hidden]')).toBeNull();
  });

  it('legend placement: a top legend renders after the plot below 480px and returns at >= 480px', () => {
    roWidth = 360;
    const { container } = render(<F legend="top" />);
    expect(legend(container)!.getAttribute('data-placement')).toBe('bottom');
    expect(partOrder(container)).toEqual(['chart-plot', 'chart-table-toggle', 'chart-legend']);
    act(() => instances[0]!.fire(800));
    expect(legend(container)!.getAttribute('data-placement')).toBe('top');
    expect(partOrder(container)).toEqual(['chart-legend', 'chart-plot', 'chart-table-toggle']);
    act(() => instances[0]!.fire(479));
    expect(legend(container)!.getAttribute('data-placement')).toBe('bottom');
  });

  it("legend='bottom' stays bottom and legend='none' renders no legend", () => {
    roWidth = 360;
    const { container, rerender } = render(<F legend="bottom" />);
    expect(legend(container)!.getAttribute('data-placement')).toBe('bottom');
    rerender(<F legend="none" />);
    expect(legend(container)).toBeNull();
  });

  it('context: dir is rtl under a dir=rtl parent; color() returns var(--_ag-chart-N)', () => {
    let seen: ChartContext<Row> | null = null;
    render(
      <div dir="rtl">
        <F series={[...SERIES, { key: 'c', label: 'Gamma', colorIndex: 7 }]}>
          {(ctx) => {
            seen = ctx;
            return null;
          }}
        </F>
      </div>,
    );
    const ctx = seen as unknown as ChartContext<Row>;
    expect(ctx.dir).toBe('rtl');
    expect([ctx.color('a'), ctx.color('b'), ctx.color('c')]).toEqual(['var(--_ag-chart-1)', 'var(--_ag-chart-2)', 'var(--_ag-chart-7)']);
    expect(ctx.width).toBe(640);
    expect(ctx.height).toBe(240);
    expect(ctx.formatY(1234.5, { key: 'a', label: 'A', format: { maximumFractionDigits: 0 } })).toBe('1,235');
  });

  it('context: dir is ltr without an rtl ancestor', () => {
    let dir: string | null = null;
    render(<F>{(ctx) => { dir = ctx.dir; return null; }}</F>);
    expect(dir).toBe('ltr');
  });

  it('element adapters read the same context through ChartFrame.useContext()', () => {
    function Adapter() {
      const ctx = ChartFrame.useContext<Row>();
      return <span data-testid="el">{ctx.visibleSeries.map((s) => s.label).join(',')} {ctx.color('b')}</span>;
    }
    const { getByTestId } = render(<F defaultHiddenSeries={['a']}><Adapter /></F>);
    expect(getByTestId('el').textContent).toBe('Beta var(--_ag-chart-2)');
  });

  it('ChartFrame.useContext() outside a frame throws a named error', () => {
    function Lost() {
      ChartFrame.useContext();
      return null;
    }
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Lost />)).toThrow(/must render inside <ChartFrame>/);
    err.mockRestore();
  });

  it('observer cleanup: one ResizeObserver on the plot, disconnected once on unmount', () => {
    const { container, unmount } = render(<F />);
    expect(instances).toHaveLength(1);
    expect(instances[0]!.observed).toEqual([container.querySelector('[data-ag-part="chart-plot"]')]);
    expect(instances[0]!.disconnect).not.toHaveBeenCalled();
    unmount();
    expect(instances[0]!.disconnect).toHaveBeenCalledTimes(1);
  });

  it('until the plot is measured the adapter is not invoked and a height placeholder holds the box', () => {
    // An observer that never reports: width stays undefined.
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    const adapter = jest.fn(() => <div data-testid="plot" />);
    const { container, queryByTestId } = render(<F height={180}>{adapter}</F>);
    expect(adapter).not.toHaveBeenCalled();
    expect(queryByTestId('plot')).toBeNull();
    const ph = container.querySelector<HTMLElement>('.ag-chart-frame__placeholder')!;
    expect(ph.style.blockSize).toBe('180px');
    expect(container.querySelector<HTMLElement>('[data-ag-part="chart-plot"]')!.style.blockSize).toBe('180px');
  });

  it('without ResizeObserver the plot is measured once', () => {
    delete (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
    const { getByTestId } = render(<F />);
    // jsdom lays nothing out: getBoundingClientRect().width is 0, which is a measured width.
    expect(getByTestId('plot').textContent).toContain('2 series @ 0px');
  });
});
