import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassQueryBuilder } from './GlassQueryBuilder';
import { cn } from '../../lib/utils';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassQueryBuilder> = {
  title: 'Workflows/Glass Query Builder',
  component: GlassQueryBuilder,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'A glass morphism glassquerybuilder component.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        className="glass-flex glass-min-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8"
        style={{ boxSizing: 'border-box' }}
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
  },
  args: {
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof GlassQueryBuilder>;

export const Default: Story = {
  args: {
    fields: [
      { id: 'name', label: 'Name', type: 'text' },
      { id: 'age', label: 'Age', type: 'number' },
      { id: 'status', label: 'Status', type: 'select', options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending', value: 'pending' }
      ] },
      { id: 'department', label: 'Department', type: 'select', options: [
        { label: 'Engineering', value: 'eng' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Sales', value: 'sales' }
      ] }
    ],
    value: {
      combinator: 'AND',
      rules: [
        { field: 'name', op: 'contains', value: 'John' },
        { field: 'status', op: '=', value: 'active' }
      ]
    },
    onChange: fn(),
  },
};

export const ComplexQuery: Story = {
  args: {
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text' },
      { id: 'lastName', label: 'Last Name', type: 'text' },
      { id: 'email', label: 'Email', type: 'text' },
      { id: 'role', label: 'Role', type: 'select', options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Guest', value: 'guest' }
      ] },
      { id: 'createdAt', label: 'Created Date', type: 'text' },
      { id: 'isActive', label: 'Active', type: 'select', options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' }
      ] }
    ],
    value: {
      combinator: 'OR',
      rules: [
        {
          combinator: 'AND',
          rules: [
            { field: 'role', op: '=', value: 'admin' },
            { field: 'isActive', op: '=', value: 'true' }
          ]
        },
        {
          combinator: 'AND',
          rules: [
            { field: 'email', op: 'contains', value: '@company.com' },
            { field: 'createdAt', op: '>', value: '2023-01-01' }
          ]
        }
      ]
    },
    onChange: fn(),
  },
};
