import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { StatCard } from './StatCard';

const meta = {
  title: 'surf/stat-card',
  parameters: { ag: { subject: 'StatCard', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const renderCard = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
    <StatCard label="Revenue" value={128430} delta={0.125} trendDirection="up-is-good" sparkline={[3, 5, 4, 8, 9]} />
    <StatCard label="Errors" value={42} delta={0.06} trendDirection="down-is-good" description="Last 24h" />
    <StatCard label="Visitors" value={9302} delta={0} trendDirection="neutral" href="/analytics" />
  </div>
);
export const Basic: Story = { render: renderCard };
export const Loading: Story = { render: () => <StatCard label="Revenue" value={0} loading /> };
export const ForcedColors: Story = { globals: { forcedColors: 'active' }, render: renderCard };
