import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassFileExplorer } from './GlassFileExplorer';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassFileExplorer> = {
  title: 'Effects + Advanced/Glass File Explorer',
  component: GlassFileExplorer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassfileexplorer component.',
      },
    },
  },
  argTypes: {
    currentPath: {
      control: 'text',
      description: 'Current directory path',
    },
    files: {
      control: 'object',
      description: 'Array of file items',
    },
    viewMode: {
      control: 'select',
      options: ['list', 'grid'],
      description: 'Display mode for files',
    },
    showToolbar: {
      control: 'boolean',
      description: 'Whether to show toolbar',
    },
    showBreadcrumb: {
      control: 'boolean',
      description: 'Whether to show breadcrumb',
    },
    showSearch: {
      control: 'boolean',
      description: 'Whether to show search',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'minimal'],
      description: 'Component variant',
    },
  },
  args: {
    currentPath: '/home/user',
    files: [
      {
        id: '1',
        name: 'Documents',
        type: 'folder',
        size: 0,
        modifiedAt: new Date(),
        createdAt: new Date(),
        path: '/home/user/Documents',
      },
      {
        id: '2',
        name: 'image.jpg',
        type: 'file',
        size: 2048000,
        modifiedAt: new Date(),
        createdAt: new Date(),
        extension: 'jpg',
        mimeType: 'image/jpeg',
        path: '/home/user/image.jpg',
      },
      {
        id: '3',
        name: 'script.js',
        type: 'file',
        size: 1024,
        modifiedAt: new Date(),
        createdAt: new Date(),
        extension: 'js',
        mimeType: 'application/javascript',
        path: '/home/user/script.js',
      },
    ],
    viewMode: 'list',
    showToolbar: true,
    showBreadcrumb: true,
    showSearch: true,
    variant: 'default',
    onNavigate: fn(),
    onFileSelect: fn(),
    onFileOpen: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GlassFileExplorer>;

export const Default: Story = {
  args: {
    currentPath: '/home/user',
    files: [
      {
        id: '1',
        name: 'Documents',
        type: 'folder',
        size: 0,
        modifiedAt: new Date(),
        createdAt: new Date(),
        path: '/home/user/Documents',
      },
      {
        id: '2',
        name: 'Pictures',
        type: 'folder',
        size: 0,
        modifiedAt: new Date(),
        createdAt: new Date(),
        path: '/home/user/Pictures',
      },
      {
        id: '3',
        name: 'readme.txt',
        type: 'file',
        size: 1024,
        modifiedAt: new Date(),
        createdAt: new Date(),
        extension: 'txt',
        mimeType: 'text/plain',
        path: '/home/user/readme.txt',
      },
    ],
    onNavigate: fn(),
    onFileSelect: fn(),
    onFileOpen: fn(),
  },
};

export const Variants: Story = {
  args: {
    currentPath: '/projects',
    files: [
      {
        id: '1',
        name: 'src',
        type: 'folder',
        size: 0,
        modifiedAt: new Date(),
        createdAt: new Date(),
        path: '/projects/src',
      },
      {
        id: '2',
        name: 'package.json',
        type: 'file',
        size: 2048,
        modifiedAt: new Date(),
        createdAt: new Date(),
        extension: 'json',
        mimeType: 'application/json',
        path: '/projects/package.json',
      },
      {
        id: '3',
        name: 'index.js',
        type: 'file',
        size: 512,
        modifiedAt: new Date(),
        createdAt: new Date(),
        extension: 'js',
        mimeType: 'application/javascript',
        path: '/projects/index.js',
      },
    ],
    viewMode: 'grid',
    variant: 'compact',
    onNavigate: fn(),
    onFileSelect: fn(),
    onFileOpen: fn(),
  },
};
