// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { Table, type TableColumnDef } from 'aura-glass/data';

interface Ticket { id: string; subject: string; priority: string; age: number }

const columns: TableColumnDef<Ticket>[] = [
  { accessorKey: 'subject', header: 'Subject', enableSorting: true },
  { accessorKey: 'priority', header: 'Priority', meta: { align: 'start' } },
  { accessorKey: 'age', header: 'Age (d)', size: 120, meta: { align: 'end' }, cell: ({ getValue, row }) => ((v) => <b>{String(v)}</b>)(getValue(), row.original) },
];

export function Queue({ rows }: { rows: Ticket[] }) {
  return <Table rows={rows} columns={columns} />;
}
