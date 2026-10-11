import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Table } from './Table';
import type { TableColumnDef } from './types';

type Row = { id: string; name: string; qty: number; status: string };
const DATA: Row[] = Array.from({ length: 40 }, (_, i) => ({
  id: `r${i}`,
  name: `Order ${i}`,
  qty: (i * 7) % 23,
  status: i % 3 === 0 ? 'open' : 'closed',
}));
const COLS: TableColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Name', meta: { headerLabel: 'Name' } },
  { accessorKey: 'qty', header: 'Qty', meta: { headerLabel: 'Quantity', numeric: true } },
  { accessorKey: 'status', header: 'Status', meta: { headerLabel: 'Status' } },
];

const meta = {
  title: 'surf/table',
  parameters: { ag: { subject: 'Table', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const renderBasic = () => (
  <Table data={DATA} columns={COLS} getRowId={(r) => r.id} caption="Orders" />
);
export const Basic: Story = { render: renderBasic };

const renderSelected = () => (
  <Table data={DATA} columns={COLS} getRowId={(r) => r.id} caption="Orders" selectionMode="multiple" />
);
export const Selection: Story = { render: renderSelected };

const renderVirtual = () => (
  <Table
    data={Array.from({ length: 10_000 }, (_, i) => ({ ...DATA[i % DATA.length]!, id: `r${i}` }))}
    columns={COLS}
    getRowId={(r) => r.id}
    caption="10,000 rows"
    virtualize
    maxHeight={420}
  />
);
export const Virtualized: Story = { render: renderVirtual };

const renderResize = () => (
  <Table
    data={DATA}
    columns={COLS}
    getRowId={(r) => r.id}
    caption="Resizable + reorderable"
    enableColumnResizing
    enableColumnReordering
    stickyHeader
  />
);
export const ResizeReorder: Story = { render: renderResize };

// REQ-SURF-73: grid mode with single selection; the last onRowAction is
// echoed into an <output> so the APG spec can assert Enter.
function GridModeDemo() {
  const [action, setAction] = React.useState('');
  return (
    <>
      <Table
        data={DATA.slice(0, 8)}
        columns={COLS}
        getRowId={(r) => r.id}
        caption="Grid mode"
        mode="grid"
        selectionMode="single"
        onRowAction={(r) => setAction(r.id)}
      />
      <output data-testid="row-action">{action}</output>
    </>
  );
}
export const GridMode: Story = { render: () => <GridModeDemo /> };

// REQ-SURF-72: 12 wide columns (3,600px) with start + end pins, inside a
// 480px-wide scroller, for the 2,000px horizontal-scroll pinning spec.
const WIDE_COLS: TableColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Name', size: 300, meta: { headerLabel: 'Name' } },
  ...Array.from({ length: 10 }, (_, i): TableColumnDef<Row> => ({
    id: `c${i}`,
    header: `Column ${i + 1}`,
    size: 300,
    accessorFn: (r) => `${r.name} · ${i + 1}`,
  })),
  { accessorKey: 'status', header: 'Status', size: 300, meta: { headerLabel: 'Status' } },
];
const renderPinned = (dir: 'ltr' | 'rtl') => (
  <div dir={dir} style={{ inlineSize: 480 }}>
    <Table
      data={DATA.slice(0, 12)}
      columns={WIDE_COLS}
      getRowId={(r) => r.id}
      caption="Pinned columns"
      columnPinning={{ left: ['name'], right: ['status'] }}
    />
  </div>
);
export const Pinned: Story = { render: () => renderPinned('ltr') };
// The preview has no direction global, so the story sets dir itself.
export const PinnedRTL: Story = { render: () => renderPinned('rtl') };

// REQ-SURF-74/76: loading state keeps the rows and appends skeleton rows.
const renderLoading = () => (
  <Table data={DATA.slice(0, 3)} columns={COLS} getRowId={(r) => r.id} caption="Loading" loading />
);
export const Loading: Story = { render: renderLoading };

const renderStates = () => (
  <Table data={[]} columns={COLS} getRowId={(r) => r.id} caption="Empty" emptyState={<em>No orders</em>} />
);
export const Empty: Story = { render: renderStates };

export const RTL: Story = { globals: { direction: 'rtl' }, render: renderResize };
export const ForcedColors: Story = { globals: { forcedColors: 'active' }, render: renderBasic };
