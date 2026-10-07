import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TableWidget } from './TableWidget';

const meta: Meta<typeof TableWidget> = {
  title: 'Workflows/Table Widget',
  component: TableWidget,
  parameters: {
    layout: 'centered',
    previewSurface: 'component',
    docs: {
      description: {
        component: 'Table widget with real rows, actions, and bounded presentation width.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
  },
  args: {
    className: ''
  },
};

export default meta;
type Story = StoryObj<typeof TableWidget>;

const tableData = {
  title: 'Renewal queue',
  subtitle: 'Accounts needing action this week',
  columns: [
    { id: 'account', header: 'Account', accessor: 'account', sortable: true },
    { id: 'owner', header: 'Owner', accessor: 'owner', sortable: true },
    { id: 'status', header: 'Status', accessor: 'status' },
    { id: 'value', header: 'Value', accessor: 'value', align: 'right' as const },
  ],
  rows: [
    { id: '1', account: 'Northstar Bank', owner: 'Maya', status: 'Review', value: '$84k' },
    { id: '2', account: 'Atlas Retail', owner: 'Noah', status: 'Pending', value: '$62k' },
    { id: '3', account: 'Kite Logistics', owner: 'Iris', status: 'Ready', value: '$41k' },
    { id: '4', account: 'Solace Health', owner: 'Ari', status: 'Review', value: '$38k' },
  ],
  summary: {
    total: 4,
    filtered: 4,
    message: 'Showing all priority renewals',
  },
};

export const Default: Story = {
  args: {
    data: tableData,
    maxRows: 4,
    showHeader: true,
    sortable: true,
    hoverable: true,
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-w-[960px]">
      <TableWidget
        {...args}
        data={tableData}
        variant="compact"
        size="sm"
        maxRows={3}
        striped
      />
    </div>
  ),
  args: {
    data: tableData,
  },
};
