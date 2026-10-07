import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AnalyticsDashboard } from './index';

const meta = {
  title: 'registry/analytics-dashboard',
  parameters: { ag: { subject: 'analytics-dashboard', kind: 'block' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const renderBlock = () => <AnalyticsDashboard />;
export const Default: Story = { render: renderBlock };
export const RTL: Story = { globals: { dir: 'rtl' }, render: renderBlock };
export const ReducedTransparency: Story = { globals: { transparency: 'reduced' }, render: renderBlock };
export const Empty: Story = { render: renderBlock };
export const ForcedColors: Story = { globals: { forcedColors: 'active' }, render: renderBlock };
