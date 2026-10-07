// @ts-nocheck — frozen 4.x consumer usage (codemod input).
import { GlassDataGrid, type ColumnDefinition } from 'aura-glass';

interface Ticket { id: string; subject: string; priority: string }

const columns: ColumnDefinition<Ticket>[] = [
  { key: 'subject', label: 'Subject', sortable: true },
  { key: 'priority', label: 'Priority', cellRenderer: (v) => <mark>{String(v)}</mark> },
];

export function QueuePage({ tickets }: { tickets: Ticket[] }) {
  return <GlassDataGrid rows={tickets} columns={columns} />;
}
