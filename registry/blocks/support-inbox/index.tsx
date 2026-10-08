/* support-inbox (REQ-SURF-171): list/detail — Table of tickets + FilterBar +
   message list detail pane. The detail pane composes a plain message list
   (Thread's seam lands with W3's ai entry; swap target noted in the lane
   report — the block keeps every input wired to state). */
'use client';
import * as React from 'react';
import { FilterBar, Table, type FilterGroup } from 'aura-glass/data';
import { MESSAGES, TICKETS, type Ticket } from './fixtures';

const COLUMNS = [
  { accessorKey: 'id', header: 'Ticket' },
  { accessorKey: 'subject', header: 'Subject' },
  { accessorKey: 'requester', header: 'Requester' },
  { accessorKey: 'priority', header: 'Priority' },
  { accessorKey: 'status', header: 'Status' },
];

const FIELDS = [
  { id: 'status', label: 'Status', type: 'enum' as const, options: ['open', 'pending', 'closed'] },
  { id: 'priority', label: 'Priority', type: 'enum' as const, options: ['low', 'normal', 'high'] },
];

export function SupportInbox() {
  const [model, setModel] = React.useState<FilterGroup>({ kind: 'group', combinator: 'and', children: [] });
  const [selected, setSelected] = React.useState<Ticket | null>(TICKETS[0] ?? null);
  const [draft, setDraft] = React.useState('');
  const msgs = selected !== null ? (MESSAGES[selected.id] ?? []) : [];
  return (
    <div data-ag-part="support-inbox" className="ag-support-inbox" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <section>
        <FilterBar schema={FIELDS} value={model} onValueChange={setModel} resultCount={TICKETS.length} />
        <Table data={TICKETS} columns={COLUMNS} getRowId={(t: Ticket) => t.id}
          selectionMode="single" onRowSelectionChange={(k: Record<string, boolean>) => { const first = Object.keys(k)[0]; setSelected(TICKETS.find((t) => t.id === first) ?? null); }} />
      </section>
      <section aria-label="Conversation">
        {selected !== null ? (
          <>
            <h3>{selected.subject}</h3>
            <ol>
              {msgs.map((m) => (
                <li key={m.id}>
                  <article>
                    <strong>{m.author}</strong> <time dateTime={m.at}>{m.at.slice(0, 16).replace('T', ' ')}</time>
                    <p>{m.body}</p>
                  </article>
                </li>
              ))}
            </ol>
            <form onSubmit={(e) => { e.preventDefault(); setDraft(''); }}>
              <label>
                Reply
                <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} />
              </label>
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <p>Select a ticket to read the conversation.</p>
        )}
      </section>
    </div>
  );
}
