/** @jest-environment jsdom */
// SURF-165: column reorder via header Menu buttons, announced.
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
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


const DATA = [{ id: 'a', name: 'x', qty: 1 }];
const COLS: TableColumnDef<(typeof DATA)[number]>[] = [
  { accessorKey: 'name', header: 'Name', meta: { headerLabel: 'Name' } },
  { accessorKey: 'qty', header: 'Qty', meta: { headerLabel: 'Qty' } },
];

describe('Table reorder (SURF-165, REQ-SURF-74)', () => {
  it('Move left/right swaps column order and announces the position', async () => {
    const { container } = render(
      <Table data={DATA} columns={COLS} caption="t" enableColumnReordering />,
    );
    const headers = () => Array.from(container.querySelectorAll('th')).map((th) => th.textContent);
    expect(headers()[0]).toContain('Name');
    // REQ-SURF-75: reorder actions live inside the CMP column menu.
    fireEvent.click(container.querySelector('[data-ag-part="table-column-menu"]')!);
    await waitFor(() =>
      expect(
        Array.from(document.querySelectorAll('[role="menuitem"], [data-ag-part="item"]'))
          .some((el) => el.textContent?.includes('Move right')),
      ).toBe(true),
    );
    const moveRight = Array.from(document.querySelectorAll('[role="menuitem"], [data-ag-part="item"]'))
      .find((el) => el.textContent?.includes('Move right')) as HTMLElement;
    fireEvent.click(moveRight);
    const headerOrder = container.querySelectorAll('th');
    // after swap, first th renders Qty
    expect(headerOrder[0]!.textContent).toContain('Qty');
    
    expect(announceCalls.some((m) => m.includes('Name'))).toBe(true);
    expect(announceCalls.some((m) => m.includes('2 of 2'))).toBe(true);
  });
});
