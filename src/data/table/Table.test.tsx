/** @jest-environment jsdom */
// SURF-157: controlled/uncontrolled pairs, handle, sorting cycle, selection
// modes, size, states, boolean-toggle storm.
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { Table, type TableHandle } from './Table';
import type { TableColumnDef } from './types';

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

function T(props: Partial<Parameters<typeof Table<Row>>[0]>) {
  return <Table data={DATA} columns={COLS} getRowId={(r) => r.id} caption="Orders" {...props} />;
}

describe('Table (SURF-155)', () => {
  it('renders a named table with caption', () => {
    const { container } = render(<T />);
    expect(container.querySelector('table caption')!.textContent).toBe('Orders');
    expect(container.querySelectorAll('th[scope="col"]').length).toBe(2);
  });

  it('controlled and uncontrolled: sorting', () => {
    const onSort = jest.fn();
    const { rerender, container } = render(<T sorting={[{ id: 'qty', desc: true }]} onSortingChange={onSort} />);
    expect(container.querySelector('th[aria-sort="descending"]')).toBeTruthy();
    // uncontrolled
    const { container: c2 } = render(<T defaultSorting={[{ id: 'name', desc: false }]} />);
    expect(c2.querySelector('th[aria-sort="ascending"]')).toBeTruthy();
    void rerender;
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
    const status = container.querySelector('[role="status"]')!;
    expect(status.textContent).toContain('Qty');
  });

  it('numeric column first activation sorts ascending', () => {
    const { container } = render(<T />);
    const qtyBtn = container.querySelectorAll('[data-ag-part="table-sort-trigger"]')[1]! as HTMLElement;
    fireEvent.click(qtyBtn);
    expect(container.querySelector('th[aria-sort="ascending"]')).toBeTruthy();
  });

  it('multiple selection adds a tri-state Select all checkbox column', () => {
    const { container } = render(<T selectionMode="multiple" />);
    const all = container.querySelector('[data-ag-part="table-selection-all"]') as HTMLInputElement;
    expect(all).toBeTruthy();
    fireEvent.click(all);
    expect(container.querySelectorAll('tr[aria-selected="true"]').length).toBe(3);
    fireEvent.click(all);
    expect(container.querySelectorAll('tr[aria-selected="true"]').length).toBe(0);
  });

  it('single selection: aria-selected rows, no checkbox column', () => {
    const { container } = render(<T selectionMode="single" />);
    expect(container.querySelector('[data-ag-part="table-selection-all"]')).toBeNull();
    const row = container.querySelector('tr[data-row-id="b"]')!;
    fireEvent.click(row);
    expect(row.getAttribute('aria-selected')).toBe('true');
  });

  it('range selection: anchor row + Shift-click selects the span', () => {
    const data = Array.from({ length: 10 }, (_, i) => ({ id: `r${i}`, name: `R${i}`, qty: i }));
    const { container } = render(
      <Table data={data} columns={COLS} getRowId={(r) => r.id} caption="t" selectionMode="multiple" />,
    );
    const r2 = container.querySelector('tr[data-row-id="r2"]')!;
    const r6 = container.querySelector('tr[data-row-id="r6"]')!;
    fireEvent.click(r2);
    fireEvent.click(r6, { shiftKey: true });
    const selected = container.querySelectorAll('tr[aria-selected="true"]');
    // shift-range marks r2..r6 = 5 rows (anchor click selects none until checkbox/cell toggles)
    expect(selected.length).toBe(5);
  });

  it('loading keeps rows and sets aria-busy', () => {
    const { container } = render(<T loading />);
    expect(container.querySelector('table')!.getAttribute('aria-busy')).toBe('true');
    expect(container.querySelector('[data-ag-part="table-loading"]')).toBeTruthy();
  });

  it('empty state renders data-ag-part=table-empty', () => {
    const { container } = render(<T data={[]} emptyState={<em>Nothing here</em>} />);
    const empty = container.querySelector('[data-ag-part="table-empty"]')!;
    expect(empty.textContent).toContain('Nothing here');
  });

  it('size sets data-ag-size', () => {
    const { container } = render(<T size="lg" />);
    expect(container.querySelector('.ag-table')!.getAttribute('data-ag-size')).toBe('lg');
  });

  it('handle: getInstance + scrollToRow + focusCell do not throw', () => {
    const ref = React.createRef<TableHandle<Row>>();
    render(<T ref={ref} />);
    act(() => {
      expect(ref.current?.getInstance()).toBeTruthy();
      ref.current?.scrollToRow('b', 'center');
      ref.current?.focusCell('b', 'qty');
    });
  });

  it('toggle every boolean prop never throws', () => {
    const flags = {
      enableMultiSort: true,
      enableColumnResizing: true,
      enableColumnReordering: true,
      manualPagination: true,
      manualSorting: true,
      stickyHeader: true,
      loading: true,
    } as const;
    const { rerender } = render(<T {...flags} />);
    rerender(<T />);
    rerender(<T {...flags} />);
  });

  it('onRowAction fires with the row datum', () => {
    const onRow = jest.fn();
    const { container } = render(<T onRowAction={onRow} />);
    fireEvent.click(container.querySelector('tr[data-row-id="c"]')!);
    expect(onRow).toHaveBeenCalledWith(DATA[2]);
  });

  it('pagination uncontrolled: pageSize slices rows', () => {
    const data = Array.from({ length: 8 }, (_, i) => ({ id: `r${i}`, name: `R${i}`, qty: i }));
    const { container } = render(
      <Table data={data} columns={COLS} getRowId={(r) => r.id} caption="t" defaultPagination={{ pageIndex: 0, pageSize: 3 }} />,
    );
    expect(container.querySelectorAll('tbody tr').length).toBe(3);
  });
});
