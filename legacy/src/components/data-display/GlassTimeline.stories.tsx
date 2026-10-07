import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassTimeline } from './GlassTimeline';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassTimeline> = {
  title: 'Data + Visualization/Glass Timeline',
  component: GlassTimeline,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'component',
    docs: {
      description: {
        component: 'A glass morphism glasstimeline component.',
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
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof GlassTimeline>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <main style={{ minHeight: '100dvh', boxSizing: 'border-box', display: 'grid', placeItems: 'center', padding: 'clamp(16px, 5vw, 56px)' }}>
        <div style={{ width: 'min(680px, 100%)', minWidth: 0 }}><Story /></div>
      </main>
    ),
  ],
  args: {
    items: [
      {
        id: '1',
        title: 'Project Started',
        subtitle: 'Initial setup completed',
        time: '2 hours ago'
      },
      {
        id: '2',
        title: 'First Milestone',
        subtitle: 'Core features implemented',
        time: '1 hour ago'
      },
      {
        id: '3',
        title: 'Testing Phase',
        subtitle: 'Bug fixes and optimizations',
        time: '30 min ago'
      }
    ],
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassTimeline {...args} />
    </div>
  ),
  args: {
    items: [
      {
        id: '1',
        title: 'User Login',
        time: '5 min ago'
      },
      {
        id: '2',
        title: 'Data Sync',
        time: '2 min ago'
      }
    ],
  },
};
