import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassFormTable } from './GlassFormTable';
import { cn } from '../../lib/utils';
import { fn } from '@storybook/test';

interface User {
  name: string;
  email: string;
  role: string;
}

interface SimpleUser {
  firstName: string;
  lastName: string;
}

const meta: Meta<typeof GlassFormTable<User>> = {
  title: 'Components/Input/GlassFormTable',
  component: GlassFormTable,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassformtable component.',
      },
    },
  },
  argTypes: {},
  args: {},
};

export default meta;
type Story = StoryObj<typeof GlassFormTable<User>>;

export const Default: Story = {
  args: {
    columns: [
      { key: 'name' as keyof User, header: 'Name' },
      { key: 'email' as keyof User, header: 'Email' },
      { key: 'role' as keyof User, header: 'Role' }
    ],
    rows: [
      { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
      { name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
    ],
    onChange: fn(),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassFormTable {...args} />
    </div>
  ),
  args: {
    columns: [
      { key: 'name' as keyof User, header: 'Name' },
      { key: 'email' as keyof User, header: 'Email' }
    ],
    rows: [
      { name: 'Alice Johnson', email: 'alice@example.com', role: 'User' }
    ],
    onChange: fn(),
  },
};
