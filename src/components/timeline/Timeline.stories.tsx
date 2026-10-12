// Timeline.stories.tsx — SURF story contract (S-41). Flagship #37 (Data).
// `id` keeps the published story ids (surf-timeline--*).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Timeline, type TimelineItem } from './Timeline';

const meta = {
  title: 'Flagships/Data/Timeline',
  id: 'surf-timeline',
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

export const Playground: StoryObj<typeof Timeline> = {
  args: { items: ITEMS, orientation: 'vertical', timeFormat: 'absolute', timeZone: 'UTC', 'aria-label': 'Deploys' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    timeFormat: { control: 'inline-radio', options: ['absolute', 'relative'] },
  },
  render: (args) => <Timeline {...args} now={Date.parse('2026-10-01T12:00:00Z')} />,
};

/* Every intent (neutral, info, success, warning, danger) with and without description and meta. */
export const States: Story = {
  render: () => (
    <Timeline
      aria-label="Intents"
      items={[
        { id: 's1', timestamp: '2026-10-01T09:00:00Z', title: 'Neutral entry' },
        { id: 's2', timestamp: '2026-10-01T09:10:00Z', title: 'Info entry', intent: 'info', meta: 'CI run 4121' },
        { id: 's3', timestamp: '2026-10-01T09:20:00Z', title: 'Success entry', intent: 'success', description: 'All checks passed' },
        { id: 's4', timestamp: '2026-10-01T09:30:00Z', title: 'Warning entry', intent: 'warning', description: 'Latency above target' },
        { id: 's5', timestamp: '2026-10-01T09:40:00Z', title: 'Danger entry', intent: 'danger', description: 'Deploy failed', meta: 'Paged on-call' },
      ]}
    />
  ),
};

/* The timeline adds no tab stops of its own: focus moves through the links in its
   items in document order and the aria-hidden markers are skipped
   (tests/a11y/apg/surf/timeline.apg.spec.ts). */
export const Keyboard: Story = {
  tags: ['apg'],
  render: () => (
    <div>
      <button type="button" data-testid="before-timeline">Before</button>
      <Timeline
        aria-label="Deploys"
        items={ITEMS.slice(0, 3).map((it) => ({ ...it, title: <a href={`#${it.id}`}>{it.title}</a> }))}
      />
      <button type="button" data-testid="after-timeline">After</button>
    </div>
  ),
};
