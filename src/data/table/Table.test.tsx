/** @jest-environment jsdom */
// SURF-157 / REQ-SURF-66..76: controlled/uncontrolled pairs, handle, sorting
// cycle, selection modes (+ range, Shift+Space, commit count), grid keyboard,
// pinning, size/numeric, states, boolean-toggle storm.
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as React from 'react';
import { Table, type TableHandle } from './Table';
import type { TableColumnDef } from './types';

// jsdom lacks PointerEvent; BU Checkbox dispatches it on activation.
if (typeof window.PointerEvent !== 'function') {
  (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
}

// SURF-066: announcements flow through the MAT useAnnouncer seam — mock it
// once per file and assert calls on the returned announce fn.
const announceCalls: string[] = [];
jest.mock('../../theme', () => {
  const actual = jest.requireActual<typeof import('../../theme')>('../../theme');
  return {
    ...actual,
    useAnnouncer: () => ({ announce: (m: string) => announceCalls.push(m) }),
  };
});

type Row = { id: string; name: string; qty: number };
const DATA: Row[] = [
  { id: 'a', name: 'Atlas', qty: 3 },
  { id: 'b', name: 'Boreal', qty: 10 },
  { id: 'c', name: 'Cinder', qty: 1 },
];
const COLS: TableColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Name', meta: { headerLabel: 'Name' } },
  { accessorKey: 'qty', header: 'Qty', meta: { headerLabel: 'Qty', numeric: true } },
];
const rowsOf = (n: number): Row[] => Array.from({ length: n }, (_, i) => ({ id: `r${i}`, name: `R${i}`, qty: i }));

function T(props: Partial<Parameters<typeof Table<Row>>[0]>) {
  return <Table data={DATA} columns={COLS} getRowId={(r) => r.id} caption="Orders" {...props} />;
}

const bodyRows = (c: HTMLElement) => c.querySelectorAll('tbody tr[data-ag-part="table-row"]');
const headerTexts = (c: HTMLElement) => [...c.querySelectorAll('thead th')].map((th) => th.textContent);
const selectedIds = (c: HTMLElement) =>
  [...c.querySelectorAll('tr[aria-selected="true"]')].map((tr) => tr.getAttribute('data-row-id'));

beforeEach(() => { announceCalls.length = 0; });

describe('Table (SURF-155)', () => {
  it('renders a named table with caption', () => {
    const { container } = render(<T />);
    expect(container.querySelector('table caption')!.textContent).toBe('Orders');
    expect(container.querySelectorAll('th[scope="col"]').length).toBe(2);
  });

  // REQ-SURF-66: no pagination props → no pagination row model → every row.
  it('renders all rows without pagination props (120 rows -> 120 tr)', () => {
    const { container } = render(<Table data={rowsOf(120)} columns={COLS} getRowId={(r) => r.id} caption="t" />);
    expect(container.querySelectorAll('tbody tr').length).toBe(120);
  });

  it('controlled and uncontrolled: sorting', () => {
    const onSort = jest.fn();
    const { container } = render(<T sorting={[{ id: 'qty', desc: true }]} onSortingChange={onSort} />);
    expect(container.querySelector('th[aria-sort="descending"]')).toBeTruthy();
    fireEvent.click(container.querySelectorAll('[data-ag-part="table-sort-trigger"]')[0]!);
    expect(onSort).toHaveBeenCalledWith([{ id: 'name', desc: false }]);
    // controlled: DOM still follows the prop, not the click
    expect(container.querySelector('th[aria-sort="descending"]')).toBeTruthy();
    const { container: c2 } = render(<T defaultSorting={[{ id: 'name', desc: false }]} />);
    expect(c2.querySelector('th[aria-sort="ascending"]')).toBeTruthy();
  });

  // REQ-SURF-66: one controlled-only test per state pair — the onChange fires
  // and the DOM follows the prop (not internal state).
  describe('controlled pairs', () => {
    it('columnVisibility', () => {
      const ref = React.createRef<TableHandle<Row>>();
      const on = jest.fn();
      const { container, rerender } = render(<T ref={ref} columnVisibility={{ qty: false }} onColumnVisibilityChange={on} />);
      expect(headerTexts(container)).toEqual(['Name']);
      act(() => ref.current!.getInstance().getColumn('qty')!.toggleVisibility(true));
      expect(on).toHaveBeenCalledWith({ qty: true });
      expect(headerTexts(container)).toEqual(['Name']);
      rerender(<T ref={ref} columnVisibility={{ qty: true }} onColumnVisibilityChange={on} />);
      expect(headerTexts(container)).toEqual(['Name', 'Qty']);
    });

    it('columnSizing', () => {
      const on = jest.fn();
      const { container, rerender } = render(
        <T enableColumnResizing columnSizing={{ name: 200 }} onColumnSizingChange={on} />,
      );
      const sep = () => container.querySelector('[role="separator"]') as HTMLElement;
      expect(sep().getAttribute('aria-valuenow')).toBe('200');
      fireEvent.keyDown(sep(), { key: 'ArrowRight' });
      expect(on).toHaveBeenCalledWith({ name: 208 });
      expect(sep().getAttribute('aria-valuenow')).toBe('200');
      rerender(<T enableColumnResizing columnSizing={{ name: 208 }} onColumnSizingChange={on} />);
      expect(sep().getAttribute('aria-valuenow')).toBe('208');
    });

    it('columnPinning', () => {
      const ref = React.createRef<TableHandle<Row>>();
      const on = jest.fn();
      const { container, rerender } = render(
        <T ref={ref} columnPinning={{ left: ['qty'] }} onColumnPinningChange={on} />,
      );
      const qtyCell = () => container.querySelector('tr[data-row-id="a"] [data-ag-cell="qty"]') as HTMLElement;
      const nameCell = () => container.querySelector('tr[data-row-id="a"] [data-ag-cell="name"]') as HTMLElement;
      expect(qtyCell().getAttribute('data-ag-pinned')).toBe('start');
      act(() => ref.current!.getInstance().getColumn('name')!.pin('left'));
      expect(on).toHaveBeenCalledWith(expect.objectContaining({ left: ['qty', 'name'] }));
      expect(nameCell().hasAttribute('data-ag-pinned')).toBe(false);
      rerender(<T ref={ref} columnPinning={{ left: ['qty', 'name'] }} onColumnPinningChange={on} />);
      expect(nameCell().getAttribute('data-ag-pinned')).toBe('start');
    });

    it('columnOrder', () => {
      const ref = React.createRef<TableHandle<Row>>();
      const on = jest.fn();
      const { container, rerender } = render(<T ref={ref} columnOrder={['qty', 'name']} onColumnOrderChange={on} />);
      expect(headerTexts(container)).toEqual(['Qty', 'Name']);
      act(() => ref.current!.getInstance().setColumnOrder(['name', 'qty']));
      expect(on).toHaveBeenCalledWith(['name', 'qty']);
      expect(headerTexts(container)).toEqual(['Qty', 'Name']);
      rerender(<T ref={ref} columnOrder={['name', 'qty']} onColumnOrderChange={on} />);
      expect(headerTexts(container)).toEqual(['Name', 'Qty']);
    });

    it('pagination', () => {
      const ref = React.createRef<TableHandle<Row>>();
      const on = jest.fn();
      const data = rowsOf(6);
      const P = (p: { pageIndex: number }) => (
        <Table ref={ref} data={data} columns={COLS} getRowId={(r) => r.id} caption="t"
          pagination={{ pageIndex: p.pageIndex, pageSize: 2 }} onPaginationChange={on} />
      );
      const ids = (c: HTMLElement) => [...bodyRows(c)].map((r) => r.getAttribute('data-row-id'));
      const { container, rerender } = render(<P pageIndex={1} />);
      expect(ids(container)).toEqual(['r2', 'r3']);
      act(() => ref.current!.getInstance().nextPage());
      expect(on).toHaveBeenCalledWith({ pageIndex: 2, pageSize: 2 });
      expect(ids(container)).toEqual(['r2', 'r3']);
      rerender(<P pageIndex={2} />);
      expect(ids(container)).toEqual(['r4', 'r5']);
    });
  });

  it('sorting cycles none -> asc -> desc -> none and announces', () => {
    const { container } = render(<T />);
    const btn = container.querySelectorAll('[data-ag-part="table-sort-trigger"]')[1]! as HTMLElement;
    fireEvent.click(btn);
    expect(container.querySelectorAll('th[aria-sort="ascending"]').length).toBe(1);
    fireEvent.click(btn);
    expect(container.querySelectorAll('th[aria-sort="descending"]').length).toBe(1);
    fireEvent.click(btn);
    expect(container.querySelectorAll('th[aria-sort="ascending"], th[aria-sort="descending"]').length).toBe(0);
    expect(announceCalls).toEqual(['Sorted by Qty, ascending', 'Sorted by Qty, descending', 'Sorting cleared for Qty']);
  });

  // REQ-SURF-68: the first activation of a sort header announces exactly one
  // message through useAnnouncer (the keyboard path runs in the remote
  // table.apg.spec.ts — jsdom does not synthesize Enter -> click).
  it('first activation announces exactly "Sorted by Qty, ascending" via useAnnouncer', () => {
    render(<T />);
    const btn = screen.getByRole('button', { name: 'Sort by Qty' });
    fireEvent.click(btn);
    expect(announceCalls).toEqual(['Sorted by Qty, ascending']);
    expect(btn.closest('th')!.getAttribute('aria-sort')).toBe('ascending');
  });

  it('numeric column first activation sorts ascending', () => {
    const { container } = render(<T />);
    const qtyBtn = container.querySelectorAll('[data-ag-part="table-sort-trigger"]')[1]! as HTMLElement;
    fireEvent.click(qtyBtn);
    expect(container.querySelector('th[aria-sort="ascending"]')).toBeTruthy();
  });

  it('multiple selection adds a tri-state CMP Checkbox "Select all rows" column', () => {
    const { container } = render(<T selectionMode="multiple" />);
    const all = screen.getByRole('checkbox', { name: 'Select all rows' });
    // CMP Checkbox root part inside the header cell
    expect(all.getAttribute('data-ag-part')).toBe('root');
    expect(all.classList.contains('ag-checkbox')).toBe(true);
    fireEvent.click(all);
    expect(selectedIds(container).length).toBe(3);
    fireEvent.click(all);
    expect(selectedIds(container).length).toBe(0);
    fireEvent.click(container.querySelector('tr[data-row-id="b"]')!);
    expect(screen.getByRole('checkbox', { name: 'Select all rows' }).getAttribute('aria-checked')).toBe('mixed');
  });

  it('single selection: aria-selected rows, no checkbox column, one row at a time', () => {
    const { container } = render(<T selectionMode="single" />);
    expect(container.querySelector('[data-ag-cell="__select"]')).toBeNull();
    fireEvent.click(container.querySelector('tr[data-row-id="b"]')!);
    expect(selectedIds(container)).toEqual(['b']);
    fireEvent.click(container.querySelector('tr[data-row-id="c"]')!);
    expect(selectedIds(container)).toEqual(['c']);
  });

  it('range selection: anchor row 2 + Shift-click row 6 selects 5', () => {
    const { container } = render(
      <Table data={rowsOf(10)} columns={COLS} getRowId={(r) => r.id} caption="t" selectionMode="multiple" />,
    );
    fireEvent.click(container.querySelector('tr[data-row-id="r2"]')!);
    expect(selectedIds(container)).toEqual(['r2']);
    fireEvent.click(container.querySelector('tr[data-row-id="r6"]')!, { shiftKey: true });
    expect(selectedIds(container)).toEqual(['r2', 'r3', 'r4', 'r5', 'r6']);
  });

  it('range selection follows the sorted row model', () => {
    const { container } = render(
      <Table data={rowsOf(10)} columns={COLS} getRowId={(r) => r.id} caption="t" selectionMode="multiple"
        defaultSorting={[{ id: 'qty', desc: true }]} />,
    );
    fireEvent.click(container.querySelector('tr[data-row-id="r8"]')!);
    fireEvent.click(container.querySelector('tr[data-row-id="r6"]')!, { shiftKey: true });
    expect(selectedIds(container)).toEqual(['r8', 'r7', 'r6']);
  });

  it('checkbox click toggles exactly once (no double toggle via the row)', () => {
    const { container } = render(<T selectionMode="multiple" />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select row b' }));
    expect(selectedIds(container)).toEqual(['b']);
  });

  it('Shift+Space range: anchor r2, Shift+Space at r6 selects 5', () => {
    const { container } = render(
      <Table data={rowsOf(10)} columns={COLS} getRowId={(r) => r.id} caption="t" selectionMode="multiple" />,
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select row r2' }));
    expect(selectedIds(container)).toEqual(['r2']);
    fireEvent.keyDown(screen.getByRole('checkbox', { name: 'Select row r6' }), { key: ' ', shiftKey: true });
    expect(selectedIds(container)).toEqual(['r2', 'r3', 'r4', 'r5', 'r6']);
  });

  it('a selection toggle costs <=3 React commits and re-renders only the changed row', () => {
    let cellRenders = 0;
    const cols: TableColumnDef<Row>[] = [
      { accessorKey: 'name', header: 'Name', cell: (ctx) => { cellRenders++; return String(ctx.getValue()); } },
    ];
    const onRender = jest.fn();
    const { container } = render(
      <React.Profiler id="table" onRender={onRender}>
        <Table data={rowsOf(10)} columns={cols} getRowId={(r) => r.id} caption="t" selectionMode="multiple" />
      </React.Profiler>,
    );
    onRender.mockClear();
    cellRenders = 0;
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select row r4' }));
    expect(selectedIds(container)).toEqual(['r4']);
    expect(onRender.mock.calls.length).toBeGreaterThanOrEqual(1);
    expect(onRender.mock.calls.length).toBeLessThanOrEqual(3);
    // only r4's data cell re-rendered; the 9 untouched rows were skipped
    expect(cellRenders).toBe(1);
  });

  // REQ-SURF-74
  describe('states', () => {
    it('loading keeps the 3 rows (data-state=loading), appends 8 skeleton rows, aria-busy', () => {
      const { container } = render(<T loading />);
      expect(container.querySelector('table')!.getAttribute('aria-busy')).toBe('true');
      const rows = bodyRows(container);
      expect(rows.length).toBe(3);
      rows.forEach((r) => expect(r.getAttribute('data-state')).toBe('loading'));
      const loadingRows = container.querySelectorAll('tbody tr[data-ag-part="table-loading"]');
      expect(loadingRows.length).toBe(8);
      loadingRows.forEach((r) => expect(r.querySelectorAll('td .ag-skeleton').length).toBe(2));
    });

    it('not loading: no aria-busy, no skeleton rows', () => {
      const { container } = render(<T />);
      expect(container.querySelector('table')!.hasAttribute('aria-busy')).toBe(false);
      expect(container.querySelector('[data-ag-part="table-loading"]')).toBeNull();
    });

    it('empty renders emptyState in one td[data-ag-part=table-empty][colspan]', () => {
      const { container } = render(<T data={[]} emptyState={<em>Nothing here</em>} />);
      const empty = container.querySelectorAll('[data-ag-part="table-empty"]');
      expect(empty.length).toBe(1);
      expect(empty[0]!.tagName).toBe('TD');
      expect(empty[0]!.getAttribute('colspan')).toBe('2');
      expect(empty[0]!.textContent).toBe('Nothing here');
    });
  });

  // REQ-SURF-76: walk the real table.css CSSOM (jsdom has no layer-aware
  // cascade) and resolve the declarations whose selectors match the
  // rendered element, in source order.
  describe('size / numeric', () => {
    const sheet = (() => {
      const style = document.createElement('style');
      style.textContent = readFileSync(join(__dirname, 'table.css'), 'utf8');
      document.head.appendChild(style);
      return style.sheet!;
    })();
    const declared = (el: Element, prop: string, media?: string): string | undefined => {
      let out: string | undefined;
      const walk = (rules: CSSRuleList, inMedia: string | undefined) => {
        for (const r of [...rules]) {
          if ('selectorText' in r && (inMedia === media) && el.matches((r as CSSStyleRule).selectorText)) {
            const v = (r as CSSStyleRule).style.getPropertyValue(prop);
            if (v !== '') out = v.trim();
          } else if ('cssRules' in r) {
            const m = 'conditionText' in r ? String((r as CSSMediaRule).conditionText) : inMedia;
            walk((r as CSSGroupingRule).cssRules, m);
          }
        }
      };
      walk(sheet.cssRules, undefined);
      return out;
    };

    it.each([
      ['sm', '8px', '32px'],
      ['md', '12px', '40px'],
      ['lg', '16px', '48px'],
    ] as const)('size %s: inline padding %s, row height %s x density', (size, pad, height) => {
      const { container } = render(<T size={size} />);
      const root = container.querySelector('[data-ag-part="table-root"]')!;
      expect(root.getAttribute('data-ag-size')).toBe(size);
      expect(declared(root, '--_ag-table-pad-inline')).toBe(`var(--_ag-table-pad-${size}, ${pad})`);
      expect(declared(root, '--_ag-table-row-height')).toBe(
        `calc(var(--_ag-table-row-${size}-px, ${height}) * var(--ag-density, 1))`,
      );
      const td = container.querySelector('td[data-ag-part="table-cell"]')!;
      const th = container.querySelector('th[data-ag-part="table-header-cell"]')!;
      expect(declared(td, 'padding-inline')).toBe('var(--_ag-table-pad-inline)');
      expect(declared(th, 'padding-inline')).toBe('var(--_ag-table-pad-inline)');
      expect(declared(td, 'block-size')).toBe('var(--_ag-table-row-height)');
    });

    it('coarse pointer floors the row height at the 44px touch target', () => {
      const { container } = render(<T />);
      const root = container.querySelector('[data-ag-part="table-root"]')!;
      expect(declared(root, '--_ag-table-row-height', '(pointer: coarse)')).toBe(
        'max(var(--_ag-touch-target, 44px), var(--_ag-table-row-height))',
      );
    });

    it('numeric: header + cells are text-align end with tabular-nums', () => {
      const { container } = render(<T />);
      const td = container.querySelector('tr[data-row-id="a"] [data-ag-cell="qty"]') as HTMLElement;
      const th = container.querySelectorAll('thead th')[1] as HTMLElement;
      for (const el of [td, th]) {
        expect(el.style.textAlign).toBe('end');
        expect(el.style.fontVariantNumeric).toBe('tabular-nums');
      }
      const nameTd = container.querySelector('tr[data-row-id="a"] [data-ag-cell="name"]') as HTMLElement;
      expect(nameTd.style.fontVariantNumeric).toBe('');
    });
  });

  // REQ-SURF-67
  it('handle: focusCell moves activeElement to the [data-ag-cell] cell (grid mode)', () => {
    const ref = React.createRef<TableHandle<Row>>();
    const { container } = render(<T ref={ref} mode="grid" />);
    expect(ref.current!.getInstance().getRowModel().rows.length).toBe(3);
    act(() => ref.current!.focusCell('b', 'qty'));
    const cell = container.querySelector('tr[data-row-id="b"] [data-ag-cell="qty"]');
    expect(document.activeElement).toBe(cell);
    // the focused cell becomes the roving tab stop
    expect(cell!.getAttribute('tabindex')).toBe('0');
  });

  it('handle: scrollToRow (non-virtual) scrolls the row element into view', () => {
    const ref = React.createRef<TableHandle<Row>>();
    const spy = jest.fn();
    (HTMLElement.prototype as unknown as { scrollIntoView: unknown }).scrollIntoView = spy;
    const { container } = render(<T ref={ref} />);
    act(() => ref.current!.scrollToRow('c', 'center'));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.contexts[0]).toBe(container.querySelector('tr[data-row-id="c"]'));
    expect(spy).toHaveBeenCalledWith({ block: 'center' });
  });

  // REQ-SURF-77: rules-of-hooks at runtime — flipping any boolean prop of
  // TableProps (one at a time and all at once, false -> true -> false) must
  // keep the same hook order and keep rendering every row. virtualize needs a
  // height-bearing scroller, so the layout reads are mocked for this case.
  describe('toggle every boolean prop (REQ-SURF-77)', () => {
    const BOOLEAN_PROPS = [
      'enableMultiSort',
      'enableColumnResizing',
      'enableColumnReordering',
      'manualPagination',
      'manualSorting',
      'virtualize',
      'stickyHeader',
      'loading',
    ] as const;
    const restore: (() => void)[] = [];
    beforeEach(() => {
      jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
        () => ({ x: 0, y: 0, top: 0, left: 0, right: 800, bottom: 400, width: 800, height: 400, toJSON: () => ({}) }) as DOMRect,
      );
      for (const [key, value] of [['clientHeight', 400], ['offsetHeight', 400], ['offsetWidth', 800]] as const) {
        const prev = Object.getOwnPropertyDescriptor(HTMLElement.prototype, key);
        Object.defineProperty(HTMLElement.prototype, key, { configurable: true, get: () => value });
        restore.push(() => (prev ? Object.defineProperty(HTMLElement.prototype, key, prev) : undefined));
      }
    });
    afterEach(() => {
      while (restore.length) restore.pop()!();
      jest.restoreAllMocks();
    });

    const ids = (c: HTMLElement) => [...bodyRows(c)].map((r) => r.getAttribute('data-row-id')).sort();

    it('covers all 8 boolean props of TableProps', () => {
      // Compile-time: every listed name is a boolean-accepting TableProps key.
      const typed: readonly (keyof Parameters<typeof Table<Row>>[0])[] = BOOLEAN_PROPS;
      expect(typed).toHaveLength(8);
    });

    it.each(BOOLEAN_PROPS)('%s: false -> true -> false keeps rendering all rows', (prop) => {
      const errors = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      const { rerender, container } = render(<T {...{ [prop]: false }} />);
      expect(ids(container)).toEqual(['a', 'b', 'c']);
      rerender(<T {...{ [prop]: true }} />);
      expect(ids(container)).toEqual(['a', 'b', 'c']);
      rerender(<T {...{ [prop]: false }} />);
      expect(ids(container)).toEqual(['a', 'b', 'c']);
      // A hook-order change surfaces as a React console.error before throwing.
      expect(errors).not.toHaveBeenCalled();
    });

    it('all 8 at once: false -> true -> false keeps rendering all rows', () => {
      const errors = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      const all = (v: boolean) => Object.fromEntries(BOOLEAN_PROPS.map((p) => [p, v]));
      const { rerender, container } = render(<T {...all(false)} selectionMode="multiple" />);
      expect(ids(container)).toEqual(['a', 'b', 'c']);
      rerender(<T {...all(true)} selectionMode="multiple" />);
      expect(ids(container)).toEqual(['a', 'b', 'c']);
      expect(container.querySelector('table')!.getAttribute('aria-rowcount')).toBe('4');
      rerender(<T {...all(false)} selectionMode="multiple" />);
      expect(ids(container)).toEqual(['a', 'b', 'c']);
      expect(container.querySelector('table')!.hasAttribute('aria-rowcount')).toBe(false);
      expect(errors).not.toHaveBeenCalled();
    });
  });

  it('onRowAction fires with the row datum', () => {
    const onRow = jest.fn();
    const { container } = render(<T onRowAction={onRow} />);
    fireEvent.click(container.querySelector('tr[data-row-id="c"]')!);
    expect(onRow).toHaveBeenCalledWith(DATA[2]);
  });

  it('pagination uncontrolled: pageSize slices rows', () => {
    const { container } = render(
      <Table data={rowsOf(8)} columns={COLS} getRowId={(r) => r.id} caption="t" defaultPagination={{ pageIndex: 0, pageSize: 3 }} />,
    );
    expect(container.querySelectorAll('tbody tr').length).toBe(3);
  });

  describe('dev warnings', () => {
    const env = process.env['NODE_ENV'];
    afterEach(() => { process.env['NODE_ENV'] = env; });
    it('>500 rows without virtualize warns once per render; with virtualize it does not', () => {
      process.env['NODE_ENV'] = 'development';
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const big = rowsOf(501);
      const { unmount } = render(<Table data={big} columns={COLS} getRowId={(r) => r.id} caption="t" />);
      const hits = () => warn.mock.calls.filter((c) => String(c[0]).includes('>500 rows without virtualize'));
      expect(hits().length).toBeGreaterThanOrEqual(1);
      unmount();
      warn.mockClear();
      render(<Table data={big} columns={COLS} getRowId={(r) => r.id} caption="t" virtualize />);
      expect(hits().length).toBe(0);
      render(<Table data={rowsOf(500)} columns={COLS} getRowId={(r) => r.id} caption="t" />);
      expect(hits().length).toBe(0);
      warn.mockRestore();
    });
  });
});

// REQ-SURF-72
describe('Table pinning (SURF-072)', () => {
  const COLS4: TableColumnDef<Row>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'qty', header: 'Qty' },
    { id: 'c3', header: 'C3', accessorFn: (r) => r.id },
    { id: 'c4', header: 'C4', accessorFn: (r) => r.id },
  ];

  it('right pins resolve against getAfter: the last column insetInlineEnd is 0, pinned-edge=end on the first right pin', () => {
    const { container } = render(
      <Table data={DATA} columns={COLS4} getRowId={(r) => r.id} caption="t"
        columnSizing={{ c3: 120, c4: 90 }} columnPinning={{ left: ['name'], right: ['c3', 'c4'] }} />,
    );
    const cell = (id: string) => container.querySelector(`tr[data-row-id="a"] [data-ag-cell="${id}"]`) as HTMLElement;
    expect(cell('c4').style.position).toBe('sticky');
    expect(Number.parseFloat(cell('c4').style.insetInlineEnd)).toBe(0);
    expect(cell('c3').style.insetInlineEnd).toBe('90px');
    expect(cell('c3').getAttribute('data-ag-pinned-edge')).toBe('end');
    expect(cell('c4').hasAttribute('data-ag-pinned-edge')).toBe(false);
    expect(Number.parseFloat(cell('name').style.insetInlineStart)).toBe(0);
    expect(cell('name').getAttribute('data-ag-pinned-edge')).toBe('start');
    expect(cell('qty').hasAttribute('data-ag-pinned')).toBe(false);
    // pinned-edge is an attribute, never leaked into inline style; the
    // surface paint lives in table.css, not inline.
    expect(cell('name').getAttribute('style')).not.toMatch(/pinned|background/);
    const th = container.querySelectorAll('thead th')[0]!;
    expect(th.getAttribute('data-ag-pinned-edge')).toBe('start');
  });

  describe('auto-pin below 480px', () => {
    let observed: ((entries: { contentRect: { width: number } }[]) => void) | null = null;
    const RO = window.ResizeObserver;
    beforeEach(() => {
      observed = null;
      (window as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
        cb: (entries: { contentRect: { width: number } }[]) => void;
        constructor(cb: (entries: { contentRect: { width: number } }[]) => void) { this.cb = cb; }
        // only the table scroller's observer is driven by the test
        observe(el: Element) { if (el.getAttribute('data-ag-part') === 'table-scroller') observed = this.cb; }
        unobserve() {}
        disconnect() {}
      };
    });
    afterEach(() => { (window as unknown as { ResizeObserver: unknown }).ResizeObserver = RO; });

    const pinnedIds = (c: HTMLElement) =>
      [...c.querySelectorAll('tr[data-row-id="a"] [data-ag-pinned]')].map((el) => el.getAttribute('data-ag-cell'));

    it('selection + first data column pin when narrow with >3 columns', () => {
      const { container } = render(
        <Table data={DATA} columns={COLS4} getRowId={(r) => r.id} caption="t" selectionMode="multiple" />,
      );
      expect(pinnedIds(container)).toEqual([]);
      act(() => observed!([{ contentRect: { width: 400 } }]));
      expect(pinnedIds(container)).toEqual(['__select', 'name']);
      act(() => observed!([{ contentRect: { width: 900 } }]));
      expect(pinnedIds(container)).toEqual([]);
    });

    it('does not auto-pin with <=3 columns or when columnPinning is given', () => {
      const { container } = render(<Table data={DATA} columns={COLS4.slice(0, 3)} getRowId={(r) => r.id} caption="t" />);
      act(() => observed!([{ contentRect: { width: 400 } }]));
      expect(pinnedIds(container)).toEqual([]);
      observed = null;
      const { container: c2 } = render(
        <Table data={DATA} columns={COLS4} getRowId={(r) => r.id} caption="t" columnPinning={{ left: ['qty'] }} />,
      );
      act(() => observed?.([{ contentRect: { width: 400 } }]));
      expect(pinnedIds(c2)).toEqual(['qty']);
    });
  });
});

// REQ-SURF-73
describe('Table grid mode keyboard (SURF-073)', () => {
  const grid = (c: HTMLElement) => c.querySelector('[role="grid"]') as HTMLElement;
  const cell = (c: HTMLElement, r: string, col: string) =>
    c.querySelector(`tr[data-row-id="${r}"] [data-ag-cell="${col}"]`) as HTMLElement;

  it('exactly one element inside role=grid has tabindex=0 and the scroller is not a tab stop', () => {
    const { container } = render(<T mode="grid" />);
    const g = grid(container);
    expect(g.querySelectorAll('[tabindex="0"]').length).toBe(1);
    expect(g.querySelector('[tabindex="0"]')).toBe(cell(container, 'a', 'name'));
    expect(container.querySelector('[data-ag-part="table-scroller"]')!.hasAttribute('tabindex')).toBe(false);
  });

  it('arrows / Home / End / Ctrl+Home / Ctrl+End move the roving focus', () => {
    const { container } = render(<T mode="grid" />);
    const a = cell(container, 'a', 'name');
    act(() => a.focus());
    fireEvent.keyDown(a, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(cell(container, 'b', 'name'));
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(cell(container, 'b', 'qty'));
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(document.activeElement).toBe(cell(container, 'b', 'name'));
    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    expect(document.activeElement).toBe(cell(container, 'b', 'qty'));
    fireEvent.keyDown(document.activeElement!, { key: 'End', ctrlKey: true });
    expect(document.activeElement).toBe(cell(container, 'c', 'qty'));
    fireEvent.keyDown(document.activeElement!, { key: 'Home', ctrlKey: true });
    expect(document.activeElement).toBe(cell(container, 'a', 'name'));
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(cell(container, 'a', 'name'));
    expect(grid(container).querySelectorAll('[tabindex="0"]').length).toBe(1);
  });

  it('Enter calls onRowAction with the row; Space toggles selection', () => {
    const onRow = jest.fn();
    const { container } = render(<T mode="grid" selectionMode="single" onRowAction={onRow} />);
    const b = cell(container, 'b', 'qty');
    act(() => b.focus());
    fireEvent.keyDown(b, { key: 'Enter' });
    expect(onRow).toHaveBeenCalledTimes(1);
    expect(onRow).toHaveBeenCalledWith(DATA[1]);
    fireEvent.keyDown(b, { key: ' ' });
    expect(selectedIds(container)).toEqual(['b']);
    fireEvent.keyDown(b, { key: ' ' });
    expect(selectedIds(container)).toEqual([]);
  });

  it('PageDown moves focus 15 rows at a 600px viewport with 40px rows', () => {
    const desc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, get: () => 600 });
    try {
      const { container } = render(
        <Table data={rowsOf(40)} columns={COLS} getRowId={(r) => r.id} caption="t" mode="grid" size="md" maxHeight={600} />,
      );
      const start = cell(container, 'r2', 'qty');
      act(() => start.focus());
      fireEvent.keyDown(start, { key: 'PageDown' });
      expect(document.activeElement).toBe(cell(container, 'r17', 'qty'));
      fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
      fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
      expect(document.activeElement).toBe(cell(container, 'r39', 'qty'));
      fireEvent.keyDown(document.activeElement!, { key: 'PageUp' });
      expect(document.activeElement).toBe(cell(container, 'r24', 'qty'));
    } finally {
      if (desc) Object.defineProperty(HTMLElement.prototype, 'clientHeight', desc);
      else delete (HTMLElement.prototype as unknown as { clientHeight?: number }).clientHeight;
    }
  });
});
