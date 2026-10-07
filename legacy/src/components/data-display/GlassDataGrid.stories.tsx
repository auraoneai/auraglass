import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassDataGrid } from './GlassDataGrid';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassDataGrid> = {
  title: 'Data + Visualization/Glass Data Grid',
  component: GlassDataGrid,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassdatagrid component.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        className="glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5"
        style={{ width: "min(900px, calc(100vw - 64px))", overflowX: "auto" }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    sortable: {
      control: 'boolean',
      description: 'Enable column sorting',
    },
    height: {
      control: 'text',
      description: 'Grid height',
    },
    enableRowDragging: {
      control: 'boolean',
      description: 'Enable row dragging',
    },
  },
  args: {
    className: '',
    sortable: true,
    height: '400px',
    enableRowDragging: false,
    data: [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
    ],
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'role', label: 'Role', sortable: false },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof GlassDataGrid>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassDataGrid {...args} />
    </div>
  ),
};
