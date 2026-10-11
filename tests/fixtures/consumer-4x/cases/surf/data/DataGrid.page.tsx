// @ts-nocheck — frozen 4.x consumer usage (codemod input).
import { GlassDataGrid, type ColumnDefinition } from 'aura-glass';

type Ticket = { id: string; subject: string; priority: string };

const columns: ColumnDefinition[] = [
  { key: 'subject', label: 'Subject', sortable: true },
  { key: 'priority', label: 'Priority', cellRenderer: (v) => <mark>{String(v)}</mark> },
];

export function QueuePage({ tickets }: { tickets: Ticket[] }) {
  return <GlassDataGrid data={tickets} columns={columns} />;
}
