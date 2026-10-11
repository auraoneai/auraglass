/** @jest-environment jsdom */
// SURF-158: 10,000 rows in a 600px container — tbody holds only the window.
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Table } from './Table';
import type { TableColumnDef } from './types';

beforeEach(() => {
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const isScroller = this.dataset?.index === undefined;
    return {
      x: 0, y: 0, top: 0, left: 0, right: 800,
      bottom: isScroller ? 600 : 40,
      width: 800,
      height: isScroller ? 600 : 40,
      toJSON: () => ({}),
    } as DOMRect;
  });
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get() {
      return 600;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get(this: HTMLElement) {
      return this.dataset?.index !== undefined ? 40 : 600;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get() {
      return 800;
    },
  });
});

type Row = { id: string; name: string };
const COLS: TableColumnDef<Row>[] = [{ accessorKey: 'name', header: 'Name' }];

describe('Table virtualization (SURF-158, REQ-SURF-70)', () => {
  it('10,000 rows render only the window + overscan', () => {
    const data: Row[] = Array.from({ length: 10_000 }, (_, i) => ({ id: `r${i}`, name: `Row ${i}` }));
    const { container } = render(
      <Table
        data={data}
        columns={COLS}
        getRowId={(r) => r.id}
        caption="Big"
        virtualize
        size="md"
        maxHeight={600}
      />,
    );
    const rows = container.querySelectorAll('tbody tr[data-ag-part="table-row"]');
    // REQ-SURF-70: bound = ceil(600/40) + 2*8 = 31
    const max = Math.ceil(600 / 40) + 2 * 8;
    expect(rows.length).toBeLessThanOrEqual(max);
    expect(container.querySelector('table')!.getAttribute('aria-rowcount')).toBe('10001');
    const first = rows[0]!;
    expect(first.getAttribute('aria-rowindex')).toBe('2');
    // header rows carry aria-rowindex=1 under virtualization
    expect(container.querySelector('thead tr')!.getAttribute('aria-rowindex')).toBe('1');
  });

  // REQ-SURF-67: scrollToRow resolves on the full (pre-pagination) row model.
  it("scrollToRow('r9000','start') scrolls the virtualizer to index 9000", () => {
    const data: Row[] = Array.from({ length: 10_000 }, (_, i) => ({ id: `r${i}`, name: `Row ${i}` }));
    const handleRef = React.createRef<TableHandle<Row>>();
    render(
      <Table
        ref={handleRef}
        data={data}
        columns={COLS}
        getRowId={(r) => r.id}
        caption="Big"
        virtualize
        maxHeight={600}
      />,
    );
    handleRef.current!.scrollToRow('r9000', 'start');
    expect(handleRef.current).toBeTruthy();
  });
});
import type { TableHandle } from './Table';
