// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassDataGrid, type ColumnDefinition } from 'aura-glass';

type Ticket = { id: string; subject: string; priority: string; age: number };

const columns: ColumnDefinition<Record<string, unknown>>[] = [
  { key: 'subject', label: 'Subject', sortable: true },
  { key: 'priority', label: 'Priority', align: 'left' },
  { key: 'age', label: 'Age (d)', width: 120, align: 'right', render: (v, row) => <b>{String(v)}</b> },
];

export function Queue({ rows }: { rows: Ticket[] }) {
  return <GlassDataGrid data={rows} columns={columns} />;
}
