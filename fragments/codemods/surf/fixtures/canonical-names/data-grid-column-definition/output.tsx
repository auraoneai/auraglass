// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { Table, type TableColumnDef } from 'aura-glass/data';

type Ticket = { id: string; subject: string; priority: string; age: number };

const columns: TableColumnDef<Record<string, unknown>>[] = [
  { accessorKey: 'subject', header: 'Subject', enableSorting: true },
  { accessorKey: 'priority', header: 'Priority', meta: { align: 'start' } },
  { accessorKey: 'age', header: 'Age (d)', size: 120, meta: { align: 'end' }, cell: ({ getValue, row }) => ((v, row) => <b>{String(v)}</b>)(getValue(), row.original) },
];

export function Queue({ rows }: { rows: Ticket[] }) {
  return <Table data={rows} columns={columns} />;
}
