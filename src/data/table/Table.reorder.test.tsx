/** @jest-environment jsdom */
// SURF-165: column reorder via header Menu buttons, announced.
import { describe, expect, it } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { Table } from './Table';
import type { TableColumnDef } from './types';

const DATA = [{ id: 'a', name: 'x', qty: 1 }];
const COLS: TableColumnDef<(typeof DATA)[number]>[] = [
  { accessorKey: 'name', header: 'Name', meta: { headerLabel: 'Name' } },
  { accessorKey: 'qty', header: 'Qty', meta: { headerLabel: 'Qty' } },
];

describe('Table reorder (SURF-165, REQ-SURF-74)', () => {
  it('Move left/right swaps column order and announces the position', () => {
    const { container } = render(
      <Table data={DATA} columns={COLS} caption="t" enableColumnReordering />,
    );
    const headers = () => Array.from(container.querySelectorAll('th')).map((th) => th.textContent);
    expect(headers()[0]).toContain('Name');
    const moveRight = container.querySelector('button[aria-label*="Move right"]') as HTMLElement;
    fireEvent.click(moveRight);
    const headerOrder = container.querySelectorAll('th');
    // after swap, first th renders Qty
    expect(headerOrder[0]!.textContent).toContain('Qty');
    const status = container.querySelector('[role="status"]')!;
    expect(status.textContent).toContain('Name');
    expect(status.textContent).toContain('2 of 2');
  });
});
