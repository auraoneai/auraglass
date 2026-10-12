/** @jest-environment jsdom */
// SURF-158 / REQ-SURF-67, -70, -73: 10,000 rows in a 600px container — tbody
// holds only the window; the virtualizer spans the FULL row model.
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { Table, type TableHandle } from './Table';
import type { TableColumnDef } from './types';

const VIEWPORT = 600;
const ROW = 40;
const restore: (() => void)[] = [];
const define = (proto: object, key: string, d: PropertyDescriptor) => {
  const prev = Object.getOwnPropertyDescriptor(proto, key);
  Object.defineProperty(proto, key, { configurable: true, ...d });
  restore.push(() => (prev ? Object.defineProperty(proto, key, prev) : delete (proto as Record<string, unknown>)[key]));
};

beforeEach(() => {
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const isScroller = this.dataset?.index === undefined;
    return {
      x: 0, y: 0, top: 0, left: 0, right: 800,
      bottom: isScroller ? VIEWPORT : ROW,
      width: 800,
      height: isScroller ? VIEWPORT : ROW,
      toJSON: () => ({}),
    } as DOMRect;
  });
  define(HTMLElement.prototype, 'clientHeight', { get: () => VIEWPORT });
  define(HTMLElement.prototype, 'offsetHeight', {
    get(this: HTMLElement) { return this.dataset?.index !== undefined ? ROW : VIEWPORT; },
  });
  define(HTMLElement.prototype, 'offsetWidth', { get: () => 800 });
  // the scroller's content height = header row + the virtual body
  define(HTMLElement.prototype, 'scrollHeight', {
    get(this: HTMLElement) {
      const body = this.querySelector?.('tbody') as HTMLElement | null;
      return this.dataset?.agPart === 'table-scroller' && body ? ROW + Number.parseFloat(body.style.height || '0') : 0;
    },
  });
  // jsdom has no scrolling: scrollTo writes scrollTop and fires 'scroll' so
  // the virtualizer's offset observer sees the new position.
  define(Element.prototype, 'scrollTo', {
    value(this: HTMLElement, opts: ScrollToOptions) {
      if (typeof opts?.top === 'number') {
        Object.defineProperty(this, 'scrollTop', { configurable: true, writable: true, value: opts.top });
        this.dispatchEvent(new Event('scroll'));
      }
    },
  });
});
afterEach(() => {
  while (restore.length) restore.pop()!();
  jest.restoreAllMocks();
});

type Row = { id: string; name: string };
const COLS: TableColumnDef<Row>[] = [{ accessorKey: 'name', header: 'Name' }];
const DATA: Row[] = Array.from({ length: 10_000 }, (_, i) => ({ id: `r${i}`, name: `Row ${i}` }));
const bodyRows = (c: HTMLElement) => c.querySelectorAll('tbody tr[data-ag-part="table-row"]');
// REQ-SURF-70: bound = ceil(600/40) + 2*8 = 31
const MAX = Math.ceil(VIEWPORT / ROW) + 2 * 8;

describe('Table virtualization (SURF-158, REQ-SURF-70)', () => {
  it('10,000 rows render only the window + overscan over the full 400000px model', () => {
    const { container } = render(
      <Table data={DATA} columns={COLS} getRowId={(r) => r.id} caption="Big" virtualize size="md" maxHeight={600} />,
    );
    const rows = bodyRows(container);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThanOrEqual(MAX);
    // the virtualizer counts all 10,000 rows (not a paginated slice)
    expect((container.querySelector('tbody') as HTMLElement).style.height).toBe('400000px');
    expect(container.querySelector('table')!.getAttribute('aria-rowcount')).toBe('10001');
    expect(rows[0]!.getAttribute('aria-rowindex')).toBe('2');
    expect((rows[0] as HTMLElement).style.transform).toBe('translateY(0px)');
    // header rows carry aria-rowindex=1 under virtualization
    expect(container.querySelector('thead tr')!.getAttribute('aria-rowindex')).toBe('1');
  });

  // REQ-SURF-67: scrollToRow resolves on the full (pre-pagination) row model.
  it("scrollToRow('r9000','start') renders row r9000; aria-rowindex 9001 (row 9,000) exists, window still <=31", () => {
    const ref = React.createRef<TableHandle<Row>>();
    const { container } = render(
      <Table ref={ref} data={DATA} columns={COLS} getRowId={(r) => r.id} caption="Big" virtualize maxHeight={600} />,
    );
    expect(container.querySelector('[data-row-id="r9000"]')).toBeNull();
    act(() => ref.current!.scrollToRow('r9000', 'start'));
    const r9000 = container.querySelector('[data-row-id="r9000"]') as HTMLElement;
    expect(r9000).not.toBeNull();
    // header = 1, so data row i (0-based) is aria-rowindex i+2: r9000 → 9002
    // and the 9,000th row (r8999) → 9001, rendered in the overscan above it.
    expect(r9000.getAttribute('aria-rowindex')).toBe('9002');
    expect(container.querySelector('tr[aria-rowindex="9001"]')!.getAttribute('data-row-id')).toBe('r8999');
    expect(r9000.style.transform).toBe(`translateY(${9000 * ROW}px)`);
    expect(bodyRows(container).length).toBeLessThanOrEqual(MAX);
  });

  it('scrollToRow resolves rows beyond the first page even when pagination props are set', () => {
    const ref = React.createRef<TableHandle<Row>>();
    const { container } = render(
      <Table ref={ref} data={DATA} columns={COLS} getRowId={(r) => r.id} caption="Big" virtualize maxHeight={600}
        defaultPagination={{ pageIndex: 0, pageSize: 50 }} />,
    );
    act(() => ref.current!.scrollToRow('r9000', 'start'));
    expect(container.querySelector('[data-row-id="r9000"]')).not.toBeNull();
  });

  // REQ-SURF-73: PageDown/Ctrl+End reach rows that are not mounted yet —
  // the virtual row is scrolled in first, then focused by rowId+columnId.
  it('grid: Ctrl+End scrolls the last virtual row in and focuses its cell', () => {
    const { container } = render(
      <Table data={DATA} columns={COLS} getRowId={(r) => r.id} caption="Big" virtualize maxHeight={600} mode="grid" />,
    );
    const first = container.querySelector('[data-row-id="r0"] [data-cell="name"]') as HTMLElement;
    act(() => first.focus());
    act(() => {
      fireEvent.keyDown(first, { key: 'End', ctrlKey: true });
    });
    const last = container.querySelector('[data-row-id="r9999"] [data-cell="name"]');
    expect(last).not.toBeNull();
    expect(document.activeElement).toBe(last);
    expect(container.querySelectorAll('[role="grid"] [tabindex="0"]').length).toBe(1);
  });

  // REQ-SURF-73: one tab stop even when the active row is scrolled out of the
  // window by the mouse/wheel (no keyboard move): the virtualizer keeps the
  // active row mounted, so Tab never skips the grid.
  it('grid: scrolling the active row out of the window keeps exactly one tab stop on that cell', () => {
    const { container } = render(
      <Table data={DATA} columns={COLS} getRowId={(r) => r.id} caption="Big" virtualize maxHeight={600} mode="grid" />,
    );
    const grid = container.querySelector('[role="grid"]')!;
    const cell = container.querySelector('[data-row-id="r3"] [data-cell="name"]') as HTMLElement;
    act(() => cell.focus());
    expect(cell.getAttribute('tabindex')).toBe('0');
    const scroller = container.querySelector('[data-ag-part="table-scroller"]') as HTMLElement;
    act(() => scroller.scrollTo({ top: 5000 * ROW }));
    // the window moved: rows around 5000 are mounted, r4 (inside the old window) is not
    expect(container.querySelector('[data-row-id="r5000"]')).not.toBeNull();
    expect(container.querySelector('[data-row-id="r4"]')).toBeNull();
    const stops = grid.querySelectorAll('[tabindex="0"]');
    expect(stops.length).toBe(1);
    expect(stops[0]!.closest('[data-row-id]')!.getAttribute('data-row-id')).toBe('r3');
    expect(document.activeElement).toBe(stops[0]);
    expect(bodyRows(container).length).toBeLessThanOrEqual(MAX + 1);
  });

  it('grid: an active row removed from the data hands the tab stop to the first row', () => {
    const { container, rerender } = render(
      <Table data={DATA.slice(0, 50)} columns={COLS} getRowId={(r) => r.id} caption="Big" virtualize maxHeight={600} mode="grid" />,
    );
    const cell = container.querySelector('[data-row-id="r3"] [data-cell="name"]') as HTMLElement;
    act(() => cell.focus());
    rerender(
      <Table data={DATA.slice(0, 50).filter((r) => r.id !== 'r3')} columns={COLS} getRowId={(r) => r.id} caption="Big" virtualize maxHeight={600} mode="grid" />,
    );
    const stops = container.querySelectorAll('[role="grid"] [tabindex="0"]');
    expect(stops.length).toBe(1);
    expect(stops[0]!.closest('[data-row-id]')!.getAttribute('data-row-id')).toBe('r0');
  });
});
