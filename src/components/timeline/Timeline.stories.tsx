// Timeline.stories.tsx — SURF story contract (S-41).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Timeline, type TimelineItem } from './Timeline';

const meta: Meta = {
  title: 'surf/timeline',
  component: Timeline,
  parameters: { ag: { subject: 'Timeline', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

const items: TimelineItem[] = [
  { id: '1', timestamp: '2026-10-01T09:00:00Z', title: 'Release cut', description: 'Branch release/5.0 created.', intent: 'info', meta: 'by Ada' },
  { id: '2', timestamp: '2026-10-02T15:30:00Z', title: 'Shipped', intent: 'success' },
];

export const Default: Story = { render: () => <Timeline items={items} aria-label="Release history" /> };
export const Horizontal: Story = { render: () => <Timeline items={items} orientation="horizontal" aria-label="Release history" /> };
