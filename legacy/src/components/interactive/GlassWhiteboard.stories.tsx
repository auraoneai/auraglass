import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassWhiteboard } from './GlassWhiteboard';
import { cn } from '../../lib/utils';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassWhiteboard> = {
  title: 'Workflows/Glass Whiteboard',
  component: GlassWhiteboard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasswhiteboard component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    width: {
      control: 'number',
      description: 'Canvas width',
    },
    height: {
      control: 'number',
      description: 'Canvas height',
    },
    backgroundPattern: {
      control: { type: 'select' },
      options: ['none', 'grid', 'dots', 'lines'],
      description: 'Background pattern',
    },
    showToolbar: {
      control: 'boolean',
      description: 'Show toolbar',
    },
  },
  args: {
    className: '',
    width: 600,
    height: 400,
    backgroundPattern: 'grid',
    showToolbar: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassWhiteboard>;

export const Default: Story = {
  args: {
    initialData: [
      {
        id: 'welcome-frame',
        type: 'rectangle',
        startX: 112,
        startY: 82,
        endX: 488,
        endY: 314,
        color: 'var(--glass-black)',
        width: 2,
        opacity: 0.72,
        timestamp: 1,
      },
      {
        id: 'workflow-path',
        tool: 'pen',
        points: [
          { x: 160, y: 230 },
          { x: 240, y: 162 },
          { x: 326, y: 218 },
          { x: 430, y: 132 },
        ],
        color: 'var(--glass-black)',
        width: 4,
        opacity: 0.82,
        timestamp: 2,
      },
    ],
    onDrawingChange: fn(),
    onToolChange: fn(),
  },
};

export const Collaborative: Story = {
  args: {
    collaborative: true,
    userId: 'user123',
    enabledTools: ['pen', 'eraser', 'rectangle', 'text'],
    showMinimap: true,
    onDrawingChange: fn(),
  },
};
