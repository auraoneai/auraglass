/** @jest-environment jsdom */
// REQ-SURF-10 — pseudo-locale render: every SURF component with a labels or
// messages surface, rendered with every label overridden by the pseudo-locale
// marker, must show the marker and zero English defaults. Components whose
// only strings are caller children (Tabs, TabBar, Timeline, …) or Intl-driven
// (the date fields, via their `locale` prop) have no labels surface to pin.
import { describe, expect, it } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import { createElement as h } from 'react';
import { Pagination } from '../../src/components/pagination/Pagination';
import { Breadcrumbs } from '../../src/components/breadcrumbs/Breadcrumbs';
import { Command } from '../../src/components/command-palette/Command';
import { Message } from '../../src/ai/message/Message';
import { Thread } from '../../src/ai/thread/Thread';
import { Composer } from '../../src/ai/composer/Composer';
import { ToolCall } from '../../src/ai/tool/ToolCall';
import { Reasoning } from '../../src/ai/reasoning/Reasoning';
import { AppShell, ResizablePanels } from '../../src/app-shell';
import { AppShellSidebarToggle } from '../../src/app-shell/AppShell.SidebarToggle';
import { StatCard } from '../../src/data/stat-card/StatCard';
import { Chip } from '../../src/data/chip/Chip';
import { KeyValueEditor } from '../../src/data/key-value-editor/KeyValueEditor';
import { ChartFrame } from '../../src/data/chart-frame/ChartFrame';
import { Table } from '../../src/data/table/Table';
import { TreeView } from '../../src/data/tree-view/TreeView';
import { FilterBar } from '../../src/data/filter-bar/FilterBar';
import { emptyGroup, makeRule, type FilterField } from '../../src/data/filter-bar/filter-model';
import { applyModel } from '../../src/data/filter-bar/filter-model-ops';

const PL = '«Lörem»'; // pseudo-locale marker — must appear, English defaults must not

const FILTER_SCHEMA: FilterField[] = [
  { id: 'status', label: PL, type: 'enum', options: [{ value: 'open', label: PL }] },
];
const FILTER_SEED = applyModel(emptyGroup(), (m) => {
  m.addRule(makeRule(FILTER_SCHEMA[0]!, 'is', 'open'));
});

const FIXTURES: ReadonlyArray<readonly [string, React.ReactElement, string[]]> = [
  [
    'pagination',
    h(Pagination.Root as never, { count: 40, page: 2, pageSize: 10, labels: { previous: PL, next: PL, pagination: PL } }),
    ['Previous page', 'Next page', 'Pagination'],
  ],
  [
    'breadcrumbs',
    h(
      Breadcrumbs.Root as never,
      { labels: { breadcrumb: PL, showMore: () => PL }, maxItems: 3 },
      h(Breadcrumbs.Item as never, {}, h(Breadcrumbs.Link as never, { href: '#' }, PL)),
      h(Breadcrumbs.Item as never, {}, h(Breadcrumbs.Link as never, { href: '#' }, PL)),
      h(Breadcrumbs.Item as never, {}, h(Breadcrumbs.Link as never, { href: '#' }, PL)),
      h(Breadcrumbs.Item as never, {}, h(Breadcrumbs.Current as never, {}, PL)),
    ),
    ['Breadcrumb', 'Show ', ' more'],
  ],
  [
    'message',
    (() => { const msg = { id: 'm', role: 'assistant', parts: [{ type: 'text', text: PL }] } as never; return h(Message as never, { message: msg, labels: { assistant: PL } }); })(),
    // message role is a data attribute; the localizable default is 'Assistant'.
    ['Assistant'],
  ],
  [
    'appshell',
    h(
      AppShell.Root as never,
      {},
      h(AppShell.SkipLink as never, {}, PL),
      h(AppShellSidebarToggle as never, { labels: { expand: PL, collapse: PL } }),
      h(AppShell.Main as never, {}, PL),
    ),
    ['Skip to content', 'Collapse sidebar', 'Expand sidebar', 'Open sidebar', 'Close sidebar'],
  ],
  [
    'statcard',
    h(StatCard as never, { label: PL, value: 42, delta: 0, trendDirection: 'up-is-good', labels: { up: PL, down: PL, unchanged: PL } }),
    ['Unchanged'],
  ],
  [
    'chip',
    h(Chip as never, { label: PL, onRemove: () => undefined, labels: { remove: PL } }, PL),
    ['Remove'],
  ],
  [
    'keyvalueeditor',
    h(KeyValueEditor as never, { defaultValue: [{ key: 'a', value: 'b' }], labels: { key: PL, value: PL, remove: PL, add: PL, duplicate: PL } }),
    ['>Key<', '>Value<', 'Remove', '>Add<', 'Duplicate key'],
  ],
  [
    'chartframe',
    h(ChartFrame as never, { title: PL, data: [{ m: 'Jan', a: 3 }], series: [{ key: 'a', label: 'A' }], x: { key: 'm', label: 'Month' }, labels: { showTable: PL, hideTable: PL, legend: PL, lastSeries: PL }, children: null }),
    ['Show data table', 'Hide data table'],
  ],
  [
    'table',
    h(Table as never, { data: [], columns: [{ accessorKey: 'name', header: PL }], getRowId: (r: { id: string }) => r.id, caption: PL, messages: { empty: PL, loading: PL, selectAll: PL, sortBy: PL, sortedAsc: PL, sortedDesc: PL, sortCleared: PL, resize: PL, columnActions: PL } }),
    ['No rows', 'Loading rows'],
  ],
  [
    'treeview',
    h(TreeView as never, { items: [{ id: 'src', label: PL, children: [{ id: 'a', label: PL }] }], getKey: (n: { id: string }) => n.id, getTextValue: (n: { label: string }) => n.label, 'aria-label': PL, selectionMode: 'single', labels: { expand: PL, collapse: PL } }),
    ['Expand', 'Collapse'],
  ],
  [
    'filterbar',
    h(FilterBar as never, { schema: FILTER_SCHEMA, defaultValue: FILTER_SEED, resultCount: 128, labels: { filters: PL, clearAll: PL, addFilter: PL, results: `{n} ${PL}`, removeFilter: PL, quickFilters: PL, filtersCount: PL, more: PL, fewer: PL } }),
    ['Add filter', 'Clear all', 'Filters', 'results'],
  ],
  [
    'thread',
    h(Thread as never, { messages: [], labels: { empty: PL, conversation: PL, newMessages: () => PL } }),
    ['No messages yet', 'Conversation'],
  ],
  [
    'composer',
    h(Composer as never, { onSubmit: () => undefined, labels: { input: PL, submit: PL, stop: PL, attach: PL, moreActions: PL } }),
    ['Send'],
  ],
  [
    'toolcall',
    h(ToolCall as never, { part: { type: 'tool-x', toolCallId: '1', state: 'approval-requested', approval: { id: 'a' }, input: {} }, labels: { needsApproval: PL, approve: PL, deny: PL, waitingForApproval: PL, approvalNeeded: PL } }),
    ['Needs approval'],
  ],
  [
    'reasoning',
    h(Reasoning as never, { text: PL, state: 'done', durationMs: 4200, labels: { thinking: PL, thoughtFor: () => PL } }),
    ['Thought for', 'Thinking'],
  ],
  [
    'resizablepanels',
    h(ResizablePanels.Root as never, { labels: { resize: PL } }, h(ResizablePanels.Panel as never, { id: 'left' }, PL), h(ResizablePanels.Handle as never), h(ResizablePanels.Panel as never, { id: 'right' }, PL)),
    ['Resize'],
  ],
  [
    'command',
    h(Command.Root as never, {}, h(Command.Input as never, { placeholder: PL }), h(Command.List as never), h(Command.Empty as never, {}, PL)),
    ['No results.'],
  ],
];

describe('SURF pseudo-locale (REQ-SURF-10)', () => {
  it.each(FIXTURES)('%s: overrides render, 0 English defaults', (_name, el, banned) => {
    const html = renderToString(el);
    const found = banned.filter((b) => html.includes(b));
    expect({ found }).toEqual({ found: [] });
    expect(html).toContain(PL);
  });
  it('pagination shows the override', () => {
    const html = renderToString(h(Pagination.Root as never, { count: 40, page: 1, pageSize: 10, labels: { previous: PL, next: PL } }));
    expect(html).toContain(PL);
  });
});
