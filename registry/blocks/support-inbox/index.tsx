/* support-inbox (REQ-SURF-171, DX-080): list/detail — Table of tickets
   filtered by the FilterBar model (status/priority rules evaluated against
   the ticket fields), and a Thread detail pane. Every input is wired to
   state: selecting a row switches the thread, Send appends the reply. */
'use client';
import * as React from 'react';
import { FilterBar, Table, type FilterGroup, type FilterRule } from 'aura-glass/data';
import { Thread, Message, type AgMessage } from 'aura-glass/ai';
import { MESSAGES, TICKETS, type Msg, type Ticket } from './fixtures';

const COLUMNS = [
  { accessorKey: 'id', header: 'Ticket' },
  { accessorKey: 'subject', header: 'Subject' },
  { accessorKey: 'requester', header: 'Requester' },
  { accessorKey: 'priority', header: 'Priority' },
  { accessorKey: 'status', header: 'Status' },
];

const FIELDS = [
  { id: 'status', label: 'Status', type: 'enum' as const, options: [{ value: 'open', label: 'Open' }, { value: 'pending', label: 'Pending' }, { value: 'closed', label: 'Closed' }] },
  { id: 'priority', label: 'Priority', type: 'enum' as const, options: [{ value: 'low', label: 'Low' }, { value: 'normal', label: 'Normal' }, { value: 'high', label: 'High' }] },
];

const EMPTY_FILTER: FilterGroup = { kind: 'group', id: 'root', combinator: 'and', children: [] };

/** One enum rule against a ticket. A rule without a value does not filter yet. */
function matchesRule(t: Ticket, rule: FilterRule): boolean {
  if (rule.fieldId !== 'status' && rule.fieldId !== 'priority') return true;
  const v = rule.value;
  if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) return true;
  const values = Array.isArray(v) ? v : [String(v)];
  const hit = values.includes(t[rule.fieldId]);
  return rule.operator === 'is-not' ? !hit : hit;
}

function matchesGroup(t: Ticket, g: FilterGroup): boolean {
  if (g.children.length === 0) return true;
  const results = g.children.map((c) => (c.kind === 'group' ? matchesGroup(t, c) : matchesRule(t, c)));
  return g.combinator === 'or' ? results.some(Boolean) : results.every(Boolean);
}

/** Tickets visible under a FilterBar model (status/priority, and/or groups). */
export function filterTickets(tickets: readonly Ticket[], model: FilterGroup): Ticket[] {
  return tickets.filter((t) => matchesGroup(t, model));
}

const toAgMessage = (m: Msg): AgMessage => ({
  id: m.id,
  role: m.author === 'Support' ? 'assistant' : 'user',
  parts: [{ type: 'text', text: m.body }],
  metadata: { createdAt: m.at },
});

export interface SupportInboxProps {
  /** Initial FilterBar model (uncontrolled). */
  defaultFilter?: FilterGroup;
}

export function SupportInbox({ defaultFilter = EMPTY_FILTER }: SupportInboxProps = {}) {
  const [model, setModel] = React.useState<FilterGroup>(defaultFilter);
  const rows = React.useMemo(() => filterTickets(TICKETS, model), [model]);
  const [selectedId, setSelectedId] = React.useState<string | null>(TICKETS[0]?.id ?? null);
  const selected = rows.find((t) => t.id === selectedId) ?? null;
  const [threads, setThreads] = React.useState<Record<string, Msg[]>>(MESSAGES);
  const [draft, setDraft] = React.useState('');
  const msgs = React.useMemo(() => (selected !== null ? (threads[selected.id] ?? []) : []), [selected, threads]);
  const agMessages = React.useMemo(() => msgs.map(toAgMessage), [msgs]);
  const authorOf = React.useMemo(() => new Map(msgs.map((m) => [m.id, m.author])), [msgs]);

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = draft.trim();
    if (selected === null || body === '') return;
    setThreads((prev) => {
      const list = prev[selected.id] ?? [];
      // Deterministic id/timestamp: derived from the thread, not the clock.
      const last = list[list.length - 1]?.at ?? selected.updated;
      const reply: Msg = { id: `${selected.id}-r${list.length + 1}`, author: 'Support', body, at: last };
      return { ...prev, [selected.id]: [...list, reply] };
    });
    setDraft('');
  };

  return (
    <div data-ag-part="support-inbox" className="ag-support-inbox" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <section aria-label="Tickets">
        <FilterBar schema={FIELDS} value={model} onValueChange={setModel} resultCount={rows.length} />
        <Table data={rows} columns={COLUMNS} getRowId={(t: Ticket) => t.id}
          selectionMode="single" onRowSelectionChange={(k: Record<string, boolean>) => { const first = Object.keys(k).find((id) => k[id]); setSelectedId(first ?? null); }} />
      </section>
      <section aria-label="Conversation">
        {selected !== null ? (
          <>
            <h3>{selected.subject}</h3>
            <Thread.Root messages={agMessages} label={`Conversation: ${selected.subject}`}>
              <Thread.Items
                render={(m) => (
                  <Message message={m} author={authorOf.get(m.id)}>
                    <Message.Content>
                      <Message.Parts message={m} />
                    </Message.Content>
                  </Message>
                )}
              />
            </Thread.Root>
            <form onSubmit={send}>
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
