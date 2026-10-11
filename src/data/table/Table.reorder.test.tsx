/** @jest-environment jsdom */
// REQ-SURF-78 (SURF-165): column reorder through the CMP column menu —
// IconButton trigger "Column actions <col>", Move left / Move right items,
// announced, and confined to the column's pinning partition.
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { Table } from './Table';
import type { TableColumnDef } from './types';

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

type Row = { id: string; name: string; qty: number; status: string };
const DATA: Row[] = [{ id: 'a', name: 'x', qty: 1, status: 'open' }];
const COLS2: TableColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Name', meta: { headerLabel: 'Name' } },
  { accessorKey: 'qty', header: 'Qty', meta: { headerLabel: 'Qty' } },
];
const COLS3: TableColumnDef<Row>[] = [
  ...COLS2,
  { accessorKey: 'status', header: 'Status', meta: { headerLabel: 'Status' } },
];

// header order = the sort-trigger names (the menu trigger's icon is excluded)
const headers = (c: HTMLElement) =>
  Array.from(c.querySelectorAll('thead th [data-ag-part="table-sort-trigger"]')).map((b) => b.textContent);

async function openMenu(colLabel: string): Promise<{ left: HTMLElement; right: HTMLElement }> {
  fireEvent.click(screen.getByRole('button', { name: `Column actions ${colLabel}` }));
  const left = await waitFor(() => screen.getByRole('menuitem', { name: 'Move left' }));
  const right = screen.getByRole('menuitem', { name: 'Move right' });
  return { left, right };
}

beforeEach(() => {
  announceCalls.length = 0;
});

describe('Table column menu reorder (REQ-SURF-78)', () => {
  it('the trigger is a button named "Column actions <col>" that opens a CMP menu', async () => {
    render(<Table data={DATA} columns={COLS2} caption="t" enableColumnReordering />);
    const trigger = screen.getByRole('button', { name: 'Column actions Name' });
    expect(trigger.getAttribute('data-ag-part')).not.toBeNull();
    fireEvent.click(trigger);
    await waitFor(() => expect(screen.getByRole('menu')).toBeTruthy());
    expect(screen.getAllByRole('menuitem').map((el) => el.textContent)).toEqual(['Move left', 'Move right', 'Hide']);
  });

  it('Move right then Move left reorders, reports onColumnOrderChange and announces the position', async () => {
    const onOrder = jest.fn();
    const { container } = render(
      <Table data={DATA} columns={COLS2} caption="t" enableColumnReordering onColumnOrderChange={onOrder} />,
    );
    expect(headers(container)).toEqual(['Name', 'Qty']);

    const first = await openMenu('Name');
    // Name is first: Move left is disabled at the start edge.
    expect(first.left.getAttribute('aria-disabled')).toBe('true');
    expect(first.right.getAttribute('aria-disabled')).toBeNull();
    fireEvent.click(first.right);
    expect(headers(container)).toEqual(['Qty', 'Name']);
    expect(onOrder).toHaveBeenLastCalledWith(['qty', 'name']);
    expect(announceCalls).toEqual(['Moved Name to position 2 of 2']);

    const second = await openMenu('Name');
    // Name is now last: Move right is disabled at the end edge.
    expect(second.right.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(second.left);
    expect(headers(container)).toEqual(['Name', 'Qty']);
    expect(onOrder).toHaveBeenLastCalledWith(['name', 'qty']);
    expect(announceCalls).toEqual(['Moved Name to position 2 of 2', 'Moved Name to position 1 of 2']);
  });

  it('a center column cannot move into a start-pinned column slot', async () => {
    const onOrder = jest.fn();
    const { container } = render(
      <Table
        data={DATA}
        columns={COLS3}
        caption="t"
        enableColumnReordering
        columnPinning={{ left: ['name'], right: [] }}
        onColumnOrderChange={onOrder}
      />,
    );
    expect(headers(container)).toEqual(['Name', 'Qty', 'Status']);
    const { left, right } = await openMenu('Qty');
    expect(left.getAttribute('aria-disabled')).toBe('true');
    expect(right.getAttribute('aria-disabled')).toBeNull();
    fireEvent.click(left);
    expect(headers(container)).toEqual(['Name', 'Qty', 'Status']);
    expect(onOrder).not.toHaveBeenCalled();
    expect(announceCalls).toEqual([]);
  });

  it('a start-pinned column cannot move out of its partition; end pins likewise', async () => {
    const onOrder = jest.fn();
    render(
      <Table
        data={DATA}
        columns={COLS3}
        caption="t"
        enableColumnReordering
        columnPinning={{ left: ['name'], right: ['status'] }}
        onColumnOrderChange={onOrder}
      />,
    );
    const pinnedStart = await openMenu('Name');
    expect(pinnedStart.left.getAttribute('aria-disabled')).toBe('true');
    expect(pinnedStart.right.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(pinnedStart.right);
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());

    const pinnedEnd = await openMenu('Status');
    expect(pinnedEnd.left.getAttribute('aria-disabled')).toBe('true');
    expect(pinnedEnd.right.getAttribute('aria-disabled')).toBe('true');
    expect(onOrder).not.toHaveBeenCalled();
  });

  it('with a selection column, reorder keeps __select first and counts data columns only', async () => {
    const onOrder = jest.fn();
    render(
      <Table
        data={DATA}
        columns={COLS2}
        getRowId={(r) => r.id}
        caption="t"
        selectionMode="multiple"
        enableColumnReordering
        onColumnOrderChange={onOrder}
      />,
    );
    const { left, right } = await openMenu('Name');
    // the selection column is not a move target
    expect(left.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(right);
    expect(onOrder).toHaveBeenLastCalledWith(['__select', 'qty', 'name']);
    expect(announceCalls).toEqual(['Moved Name to position 2 of 2']);
  });
});
