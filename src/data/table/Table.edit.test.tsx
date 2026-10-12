/** @jest-environment jsdom */
// REQ-SURF-79 (5.1, C-E): grid-mode inline edit. Enter or F2 on a focused
// cell whose column declares meta.editor opens the CMP control (TextField /
// NumberField / Select with meta.options); Enter or Tab commits exactly once
// via onCellEditCommit(rowId, columnId, value); Escape cancels and refocuses
// the cell; `data` is never mutated (deep-frozen here).
import { describe, expect, it, jest, beforeAll } from '@jest/globals';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Table } from './Table';
import type { TableColumnDef } from './types';

beforeAll(() => {
  if (typeof window.PointerEvent !== 'function') {
    (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
  }
});

type Row = { id: string; name: string; qty: number; status: string };
const deepFreeze = <T,>(v: T): T => {
  if (v !== null && typeof v === 'object') {
    for (const k of Object.keys(v as object)) deepFreeze((v as Record<string, unknown>)[k]);
    Object.freeze(v);
  }
  return v;
};
const DATA: readonly Row[] = deepFreeze([
  { id: 'a', name: 'Atlas', qty: 3, status: 'open' },
  { id: 'b', name: 'Boreal', qty: 10, status: 'closed' },
]);
const SNAPSHOT = JSON.stringify(DATA);
const COLS: TableColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Name', meta: { headerLabel: 'Name', editor: 'text' } },
  { accessorKey: 'qty', header: 'Qty', meta: { headerLabel: 'Qty', numeric: true, editor: 'number' } },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: {
      headerLabel: 'Status',
      editor: 'select',
      options: [
        { value: 'open', label: 'Open' },
        { value: 'closed', label: 'Closed' },
      ],
    },
  },
  { id: 'note', header: 'Note', cell: () => 'n/a', meta: { headerLabel: 'Note' } },
];

const cellOf = (c: HTMLElement, rowId: string, col: string) =>
  c.querySelector(`[data-row-id="${rowId}"] [data-cell="${col}"]`) as HTMLElement;

function setup(extra: Partial<React.ComponentProps<typeof Table<Row>>> = {}) {
  const onCommit = jest.fn<(rowId: string, columnId: string, value: unknown) => void>();
  const onRowAction = jest.fn();
  const utils = render(
    <>
      <Table
        data={DATA}
        columns={COLS}
        getRowId={(r) => r.id}
        caption="Orders"
        mode="grid"
        onCellEditCommit={onCommit}
        onRowAction={onRowAction}
        {...extra}
      />
      <button type="button">after</button>
    </>,
  );
  return { ...utils, onCommit, onRowAction };
}

/** Focus the cell and press `key`; resolves once the lazy editor rendered. */
async function openEditor(c: HTMLElement, rowId: string, col: string, key: 'Enter' | 'F2' = 'Enter') {
  const cell = cellOf(c, rowId, col);
  act(() => cell.focus());
  fireEvent.keyDown(cell, { key });
  await waitFor(() => expect(cell.querySelector('input, [role="combobox"]')).not.toBeNull());
  return cell;
}

describe('Table inline edit (REQ-SURF-79)', () => {
  it('F2 and Enter open the text editor on the focused cell, prefilled and focused', async () => {
    const { container, onRowAction } = setup();
    const cell = await openEditor(container, 'a', 'name', 'F2');
    const input = cell.querySelector('input')!;
    expect(input.value).toBe('Atlas');
    expect(input.getAttribute('aria-label')).toBe('Name');
    expect(document.activeElement).toBe(input);
    // opening is not a row action
    expect(onRowAction).not.toHaveBeenCalled();

    const cellB = await openEditor(container, 'b', 'name', 'Enter');
    expect(cellB.querySelector('input')!.value).toBe('Boreal');
    // one editor at a time
    expect(container.querySelectorAll('tbody input').length).toBe(1);
  });

  it('Enter commits exactly once, closes the editor and refocuses the cell', async () => {
    const { container, onCommit, onRowAction } = setup();
    const cell = await openEditor(container, 'a', 'name');
    const input = cell.querySelector('input')!;
    await userEvent.clear(input);
    await userEvent.type(input, 'Apex');
    await userEvent.keyboard('{Enter}');
    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith('a', 'name', 'Apex');
    expect(cell.querySelector('input')).toBeNull();
    expect(document.activeElement).toBe(cell);
    // the editor's Enter never reached the row (no onRowAction)
    expect(onRowAction).not.toHaveBeenCalled();
    // the cell shows the owner's data, which was not mutated
    expect(cell.textContent).toBe('Atlas');
    expect(JSON.stringify(DATA)).toBe(SNAPSHOT);
  });

  it('Tab commits once and moves focus out of the grid', async () => {
    const { container, onCommit, getByText } = setup();
    const cell = await openEditor(container, 'b', 'name');
    const input = cell.querySelector('input')!;
    await userEvent.type(input, '!');
    await userEvent.tab();
    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith('b', 'name', 'Boreal!');
    expect(cell.querySelector('input')).toBeNull();
    expect(document.activeElement).toBe(getByText('after'));
    // the grid keeps exactly one tab stop: the edited cell
    expect(container.querySelectorAll('[role="grid"] [tabindex="0"]')).toHaveLength(1);
    expect(cell.getAttribute('tabindex')).toBe('0');
  });

  it('Escape cancels without committing and restores focus to the cell', async () => {
    const { container, onCommit } = setup();
    const cell = await openEditor(container, 'a', 'name');
    await userEvent.type(cell.querySelector('input')!, 'zzz');
    await userEvent.keyboard('{Escape}');
    expect(cell.querySelector('input')).toBeNull();
    expect(document.activeElement).toBe(cell);
    expect(onCommit).not.toHaveBeenCalled();
    expect(cell.textContent).toBe('Atlas');
  });

  it('editing keys stay in the editor: arrows do not move the grid, Space does not select', async () => {
    const onSel = jest.fn();
    const { container } = setup({ selectionMode: 'multiple', onRowSelectionChange: onSel });
    const cell = await openEditor(container, 'a', 'name');
    const input = cell.querySelector('input')!;
    await userEvent.keyboard('{ArrowDown}{ArrowRight} ');
    expect(document.activeElement).toBe(input);
    expect(onSel).not.toHaveBeenCalled();
  });

  it('number editor commits a number', async () => {
    const { container, onCommit } = setup();
    const cell = await openEditor(container, 'b', 'qty');
    const input = cell.querySelector('input')!;
    expect(input.getAttribute('aria-label')).toBe('Qty');
    expect(input.value).toBe('10');
    await userEvent.clear(input);
    await userEvent.type(input, '42');
    await userEvent.keyboard('{Enter}');
    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith('b', 'qty', 42);
    expect(document.activeElement).toBe(cell);
  });

  it('select editor lists meta.options and commits the chosen option once', async () => {
    const { container, onCommit } = setup();
    const cell = await openEditor(container, 'a', 'status');
    const trigger = cell.querySelector('[role="combobox"]') as HTMLElement;
    expect(trigger.getAttribute('aria-label')).toBe('Status');
    expect(document.activeElement).toBe(trigger);
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(document.querySelector('[role="listbox"]')).not.toBeNull());
    const labels = [...document.querySelectorAll('[role="option"]')].map((o) => o.textContent);
    expect(labels).toEqual(['Open', 'Closed']);
    const closed = [...document.querySelectorAll<HTMLElement>('[role="option"]')].find((o) => o.textContent === 'Closed')!;
    await userEvent.click(closed);
    await waitFor(() => expect(cell.querySelector('[role="combobox"]')).toBeNull());
    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith('a', 'status', 'closed');
    expect(JSON.stringify(DATA)).toBe(SNAPSHOT);
  });

  it('Escape on the closed select trigger cancels', async () => {
    const { container, onCommit } = setup();
    const cell = await openEditor(container, 'b', 'status');
    await userEvent.keyboard('{Escape}');
    expect(cell.querySelector('[role="combobox"]')).toBeNull();
    expect(document.activeElement).toBe(cell);
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('columns without meta.editor, table mode, or no onCellEditCommit never open an editor', async () => {
    const { container, onRowAction } = setup();
    const note = cellOf(container, 'a', 'note');
    act(() => note.focus());
    fireEvent.keyDown(note, { key: 'Enter' });
    expect(onRowAction).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(note, { key: 'F2' });
    await act(async () => {});
    expect(note.querySelector('input')).toBeNull();

    const table = render(<Table data={DATA} columns={COLS} getRowId={(r) => r.id} caption="t" onCellEditCommit={() => {}} />);
    const tcell = cellOf(table.container, 'a', 'name');
    fireEvent.keyDown(tcell, { key: 'F2' });
    await act(async () => {});
    expect(tcell.querySelector('input')).toBeNull();

    const noCb = render(<Table data={DATA} columns={COLS} getRowId={(r) => r.id} caption="t" mode="grid" />);
    const ncell = cellOf(noCb.container, 'a', 'name');
    act(() => ncell.focus());
    fireEvent.keyDown(ncell, { key: 'F2' });
    await act(async () => {});
    expect(ncell.querySelector('input')).toBeNull();
  });
});
