// @ts-nocheck
// Golden: ColumnDefinition -> Table column def per REQ-SURF-14.
import { Table } from 'aura-glass/data';

interface Ticket { id: string; subject: string; priority: string; age: number }

const columns = [
  { accessorKey: 'subject', header: 'Subject', enableSorting: true },
  { accessorKey: 'priority', header: 'Priority', meta: { align: 'start' } },
  {
    accessorKey: 'age', header: 'Age (d)', size: 120, meta: { align: 'end' },
    cell: ({ getValue, row }: { getValue: () => unknown; row: { original: Ticket } }) => <b>{String(getValue())}</b>,
  },
];

export function Queue({ rows }: { rows: Ticket[] }) {
  return <Table data={rows} columns={columns} getRowId={(r: Ticket) => r.id} />;
}
