import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassCommandPalette } from './GlassCommandPalette';

const meta: Meta<typeof GlassCommandPalette> = {
  title: 'Effects + Advanced/Glass Command Palette',
  component: GlassCommandPalette,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasscommandpalette component.',
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the palette is open',
    },
    placeholder: {
      control: 'text',
      description: 'Search placeholder text',
    },
  },
  args: {
    open: true,
    placeholder: 'Search commands...',
  },
};

export default meta;
type Story = StoryObj<typeof GlassCommandPalette>;

export const Default: Story = {
  args: {
    items: [
      {
        id: '1',
        label: 'New File',
        description: 'Create a new file',
        action: () => console.log('New File'),
        category: 'File',
        shortcut: 'Ctrl+N',
      },
      {
        id: '2',
        label: 'Open File',
        description: 'Open an existing file',
        action: () => console.log('Open File'),
        category: 'File',
        shortcut: 'Ctrl+O',
      },
      {
        id: '3',
        label: 'Save',
        description: 'Save current file',
        action: () => console.log('Save'),
        category: 'File',
        shortcut: 'Ctrl+S',
      },
      {
        id: '4',
        label: 'Search',
        description: 'Search in files',
        action: () => console.log('Search'),
        category: 'Navigation',
        shortcut: 'Ctrl+F',
      },
      {
        id: '5',
        label: 'Settings',
        description: 'Open settings',
        action: () => console.log('Settings'),
        category: 'Application',
        shortcut: 'Ctrl+,',
      },
    ],
  },
};

export const WithGroups: Story = {
  args: {
    groups: [
      {
        id: 'file',
        label: 'File Operations',
        items: [
          {
            id: 'new',
            label: 'New File',
            description: 'Create a new file',
            action: () => console.log('New File'),
            shortcut: 'Ctrl+N',
          },
          {
            id: 'open',
            label: 'Open File',
            description: 'Open an existing file',
            action: () => console.log('Open File'),
            shortcut: 'Ctrl+O',
          },
        ],
      },
      {
        id: 'edit',
        label: 'Edit',
        items: [
          {
            id: 'copy',
            label: 'Copy',
            description: 'Copy selection',
            action: () => console.log('Copy'),
            shortcut: 'Ctrl+C',
          },
          {
            id: 'paste',
            label: 'Paste',
            description: 'Paste from clipboard',
            action: () => console.log('Paste'),
            shortcut: 'Ctrl+V',
          },
        ],
      },
    ],
  },
};
