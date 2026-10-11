import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Sparkline } from './Sparkline';

const meta = {
  title: 'surf/sparkline',
  parameters: { ag: { subject: 'Sparkline', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const renderLine = () => <Sparkline data={[2, 5, 3, 8, 6, 9, 4, 12]} label="Weekly signups" showLastPoint />;
export const Line: Story = { render: renderLine };
export const Area: Story = { render: () => <Sparkline data={[2, 5, 3, 8, 6, 9, 4, 12]} label="Weekly" appearance="area" /> };
export const Bar: Story = { render: () => <Sparkline data={[2, 5, 3, 8, 6, 9, 4, 12]} label="Weekly" appearance="bar" /> };
export const ForcedColors: Story = { globals: { forcedColors: 'active' }, render: renderLine };
