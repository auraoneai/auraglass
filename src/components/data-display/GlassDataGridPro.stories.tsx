import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassDataGridPro } from './GlassDataGridPro';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassDataGridPro> = {
  title: 'Data + Visualization/Glass Data Grid Pro',
  component: GlassDataGridPro,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassdatagridpro component.',
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
    density: {
      control: { type: 'select' },
      options: ['compact', 'normal', 'spacious'],
      description: 'Row density',
    },
    grouping: {
      control: 'object',
      description: 'Column grouping configuration',
    },
  },
  args: {
    density: 'normal',
    grouping: [],
    columns: [
      { key: 'name', header: 'Name', width: 200 },
      { key: 'email', header: 'Email', width: 250 },
      { key: 'role', header: 'Role', width: 150 },
    ],
    rows: [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof GlassDataGridPro>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassDataGridPro {...args} />
    </div>
  ),
};
