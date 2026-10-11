import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Timeline, type TimelineItem } from './Timeline';

const meta = {
  title: 'surf/timeline',
  parameters: { ag: { subject: 'Timeline', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS: TimelineItem[] = [
  { id: 'd1', timestamp: '2026-10-01T09:00:00Z', title: 'Build started', intent: 'info', meta: 'CI run 4120' },
  { id: 'd2', timestamp: '2026-10-01T09:12:00Z', title: 'Deployed to staging', intent: 'success', description: '3 services' },
  { id: 'd3', timestamp: '2026-10-01T10:40:00Z', title: 'Error rate above 2%', intent: 'warning' },
  { id: 'd4', timestamp: '2026-10-01T10:45:00Z', title: 'Rolled back', intent: 'danger', description: 'Automatic rollback' },
  { id: 'd5', timestamp: '2026-10-01T11:00:00Z', title: 'Incident closed' },
];

export const Vertical: Story = { render: () => <Timeline items={ITEMS} aria-label="Deploys" /> };
/** Falls back to vertical when its container is narrower than 480px. */
export const Horizontal: Story = { render: () => <Timeline items={ITEMS} orientation="horizontal" aria-label="Deploys" /> };
/** Relative times need a fixed `now` so server and client agree. */
export const Relative: Story = {
  render: () => <Timeline items={ITEMS} timeFormat="relative" now={Date.parse('2026-10-01T12:00:00Z')} aria-label="Deploys" />,
};
/** Intent by icon and text: each marker has a visually-hidden intent label. */
export const Intents: Story = {
  render: () => (
    <Timeline
      items={ITEMS.map((it) => ({ ...it, icon: <span>{it.intent === 'danger' ? '!' : '•'}</span> }))}
      timeZone="America/New_York"
      aria-label="Deploys"
    />
  ),
};
