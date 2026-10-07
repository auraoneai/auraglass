import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassFileTree } from './GlassFileTree';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassFileTree> = {
  title: 'Effects + Advanced/Glass File Tree',
  component: GlassFileTree,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassfiletree component.',
      },
    },
  },
  argTypes: {
    nodes: {
      control: 'object',
      description: 'Array of tree nodes',
    },
    showIcons: {
      control: 'boolean',
      description: 'Whether to show file/folder icons',
    },
    showSize: {
      control: 'boolean',
      description: 'Whether to show file sizes',
    },
    showModified: {
      control: 'boolean',
      description: 'Whether to show modification dates',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'minimal'],
      description: 'Component variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Component size',
    },
  },
  args: {
    nodes: [
      {
        id: '1',
        name: 'src',
        type: 'folder',
        path: '/src',
        level: 0,
        canExpand: true,
        isExpanded: true,
        children: [
          {
            id: '2',
            name: 'components',
            type: 'folder',
            path: '/src/components',
            level: 1,
            canExpand: true,
            isExpanded: false,
            children: [
              {
                id: '3',
                name: 'Button.tsx',
                type: 'file',
                path: '/src/components/Button.tsx',
                size: 2048,
                modifiedAt: new Date(),
                extension: 'tsx',
                level: 2,
              },
              {
                id: '4',
                name: 'Input.tsx',
                type: 'file',
                path: '/src/components/Input.tsx',
                size: 1536,
                modifiedAt: new Date(),
                extension: 'tsx',
                level: 2,
              },
            ],
          },
          {
            id: '5',
            name: 'utils.ts',
            type: 'file',
            path: '/src/utils.ts',
            size: 1024,
            modifiedAt: new Date(),
            extension: 'ts',
            level: 1,
          },
        ],
      },
      {
        id: '6',
        name: 'package.json',
        type: 'file',
        path: '/package.json',
        size: 512,
        modifiedAt: new Date(),
        extension: 'json',
        level: 0,
      },
    ],
    showIcons: true,
    showSize: true,
    showModified: false,
    variant: 'default',
    size: 'md',
    onNodeSelect: fn(),
    onNodeToggle: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GlassFileTree>;

export const Default: Story = {
  args: {
    nodes: [
      {
        id: '1',
        name: 'src',
        type: 'folder',
        path: '/src',
        level: 0,
        canExpand: true,
        isExpanded: true,
        children: [
          {
            id: '2',
            name: 'App.tsx',
            type: 'file',
            path: '/src/App.tsx',
            size: 1024,
            modifiedAt: new Date(),
            extension: 'tsx',
            level: 1,
          },
          {
            id: '3',
            name: 'index.tsx',
            type: 'file',
            path: '/src/index.tsx',
            size: 512,
            modifiedAt: new Date(),
            extension: 'tsx',
            level: 1,
          },
        ],
      },
      {
        id: '4',
        name: 'README.md',
        type: 'file',
        path: '/README.md',
        size: 2048,
        modifiedAt: new Date(),
        extension: 'md',
        level: 0,
      },
    ],
    onNodeSelect: fn(),
    onNodeToggle: fn(),
  },
};

export const Variants: Story = {
  args: {
    nodes: [
      {
        id: '1',
        name: 'public',
        type: 'folder',
        path: '/public',
        level: 0,
        canExpand: true,
        isExpanded: false,
      },
      {
        id: '2',
        name: 'assets',
        type: 'folder',
        path: '/assets',
        level: 0,
        canExpand: true,
        isExpanded: false,
      },
      {
        id: '3',
        name: 'config.js',
        type: 'file',
        path: '/config.js',
        size: 768,
        modifiedAt: new Date(),
        extension: 'js',
        level: 0,
      },
    ],
    variant: 'compact',
    showSize: false,
    onNodeSelect: fn(),
    onNodeToggle: fn(),
  },
};
