import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassMenubar } from './GlassMenubar';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassMenubar> = {
  title: 'Components/Navigation/GlassMenubar',
  component: GlassMenubar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassmenubar component.',
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of menu items',
    },
    orientation: {
      control: { type: 'select', options: ['horizontal', 'vertical'] },
      description: 'Menubar orientation',
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
      description: 'Size variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether menubar is disabled',
    },
  },
  args: {
    items: [
      {
        id: 'file',
        label: 'File',
        children: [
          { id: 'new', label: 'New', shortcut: 'Ctrl+N' },
          { id: 'open', label: 'Open', shortcut: 'Ctrl+O' },
          { id: 'separator1', label: '', separator: true },
          { id: 'save', label: 'Save', shortcut: 'Ctrl+S' },
        ]
      },
      {
        id: 'edit',
        label: 'Edit',
        children: [
          { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z' },
          { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y' },
          { id: 'separator2', label: '', separator: true },
          { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X' },
          { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C' },
          { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V' },
        ]
      }
    ],
    orientation: 'horizontal',
    size: 'md',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassMenubar>;

export const Default: Story = {
  args: {
    items: [
      {
        id: 'file',
        label: 'File',
        children: [
          { id: 'new', label: 'New', shortcut: 'Ctrl+N' },
          { id: 'open', label: 'Open', shortcut: 'Ctrl+O' },
          { id: 'save', label: 'Save', shortcut: 'Ctrl+S' },
        ]
      },
      {
        id: 'edit',
        label: 'Edit',
        children: [
          { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z' },
          { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C' },
          { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V' },
        ]
      }
    ],
  },
};

export const Vertical: Story = {
  args: {
    ...Default.args,
    orientation: 'vertical',
  },
};

export const DifferentSizes: Story = {
  render: (args) => (
    <div className="glass-gap-4">
      <div>
        <h3 className="glass-text-sm glass-font-semibold glass-mb-2">Small</h3>
        <GlassMenubar {...args} size="sm" />
      </div>
      <div>
        <h3 className="glass-text-sm glass-font-semibold glass-mb-2">Medium</h3>
        <GlassMenubar {...args} size="md" />
      </div>
      <div>
        <h3 className="glass-text-sm glass-font-semibold glass-mb-2">Large</h3>
        <GlassMenubar {...args} size="lg" />
      </div>
    </div>
  ),
  args: {
    items: [
      { id: 'file', label: 'File' },
      { id: 'edit', label: 'Edit' },
      { id: 'view', label: 'View' },
    ],
  },
};

export const WithCheckboxes: Story = {
  args: {
    items: [
      {
        id: 'view',
        label: 'View',
        children: [
          { id: 'show-toolbar', label: 'Show Toolbar', type: 'checkbox', checked: true },
          { id: 'show-sidebar', label: 'Show Sidebar', type: 'checkbox', checked: false },
          { id: 'separator1', label: '', separator: true },
          { id: 'fullscreen', label: 'Fullscreen', shortcut: 'F11' },
        ]
      }
    ],
  },
};
