import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SupportInbox } from './index';

const meta = {
  title: 'registry/support-inbox',
  parameters: { ag: { subject: 'support-inbox', kind: 'block' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const renderBlock = () => <SupportInbox />;
export const Default: Story = { render: renderBlock };
export const Empty: Story = { render: () => <SupportInbox /> };
export const RTL: Story = { globals: { dir: 'rtl' }, render: renderBlock };
export const ForcedColors: Story = { globals: { forcedColors: 'active' }, render: renderBlock };
export const ReducedTransparency: Story = { globals: { transparency: 'reduced' }, render: renderBlock };
