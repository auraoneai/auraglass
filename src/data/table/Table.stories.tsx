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

const renderGrid = () => (
  <Table data={DATA.slice(0, 8)} columns={COLS} getRowId={(r) => r.id} caption="Grid mode" mode="grid" />
);
export const GridMode: Story = { render: renderGrid };

const renderStates = () => (
  <Table data={[]} columns={COLS} getRowId={(r) => r.id} caption="Empty" emptyState={<em>No orders</em>} />
);
export const Empty: Story = { render: renderStates };

export const RTL: Story = { globals: { direction: 'rtl' }, render: renderResize };
export const ForcedColors: Story = { globals: { forcedColors: 'active' }, render: renderBasic };
