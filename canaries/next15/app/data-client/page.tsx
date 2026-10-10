'use client';
// SURF-237 — Next 16 + React 19.3 client page: imports every data/date
// flagship (and the root Timeline/ActivityFeed) so the QUAL harness can assert
// client-manifest membership and zero hydration warnings in-browser.
import {
  Table,
  TreeView,
  FilterBar,
  Chip,
  KeyValueEditor,
  StatCard,
  Sparkline,
  ChartFrame,
} from 'aura-glass/data';
import {
  DateField,
  TimeField,
  DatePicker,
  DateRangePicker,
  Calendar,
  RangeCalendar,
  TimePicker,
} from 'aura-glass/date';
import { Timeline, ActivityFeed } from 'aura-glass';
import { useState } from 'react';

const ROWS = [
  { id: 't-1', subject: 'Reset password', status: 'open' },
  { id: 't-2', subject: 'Invoice question', status: 'pending' },
];
const COLUMNS = [
  { accessorKey: 'subject', header: 'Subject' },
  { accessorKey: 'status', header: 'Status' },
];
/* a type alias (not an interface) so it satisfies TreeItemData's index signature */
type TreeNode = { id: string; label: string; children?: TreeNode[] };
const TREE: TreeNode[] = [
  { id: 'root', label: 'Inbox', children: [{ id: 'leaf', label: 'Triage' }] },
];
const FILTERS = [
  {
    id: 'status',
    label: 'Status',
    type: 'enum' as const,
    options: [
      { value: 'open', label: 'Open' },
      { value: 'pending', label: 'Pending' },
    ],
  },
];

export default function DataClientCanaryPage() {
  const [open, setOpen] = useState(true);
  const [kv, setKv] = useState([{ key: 'team', value: 'support' }]);
  return (
    <main data-ag-canary="surf-data-client">
      <h1>Data + date surfaces, client-rendered</h1>
      <Table data={ROWS} columns={COLUMNS} getRowId={(r) => r.id} />
      <TreeView
        items={TREE}
        getKey={(t) => t.id}
        getChildren={(t) => t.children}
        getTextValue={(t) => t.label}
        aria-label="Inbox tree"
      />
      <FilterBar schema={FILTERS} />
      <Chip selected={open} onSelectedChange={setOpen}>
        Open
      </Chip>
      <KeyValueEditor value={kv} onValueChange={setKv} />
      <StatCard label="Tickets" value={42} />
      <Sparkline data={[3, 5, 2, 8, 6]} aria-label="Ticket trend" />
      <ChartFrame
        title="Volume"
        data={[{ day: "Mon", tickets: 3 }, { day: "Tue", tickets: 5 }]}
        series={[{ key: "tickets", label: "Tickets" }]}
        x={{ key: "day", label: "Day" }}
        children={null}
      />
      <Timeline items={[{ id: 'e1', timestamp: '2026-01-01', title: 'Opened' }]} />
      <ActivityFeed items={[{ id: 'a1', timestamp: '2026-01-01', title: 'Commented', actor: { name: 'Ada' } }]} />
      <DateField aria-label="Date" />
      <TimeField aria-label="Time" />
      <DatePicker aria-label="Pick a date" />
      <DateRangePicker aria-label="Pick a range" />
      <Calendar aria-label="Calendar" />
      <RangeCalendar aria-label="Range calendar" />
      <TimePicker aria-label="Pick a time" />
    </main>
  );
}
