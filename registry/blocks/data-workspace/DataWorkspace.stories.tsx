import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { DataWorkspace } from './index';

const meta = {
  title: 'registry/data-workspace',
  parameters: { ag: { subject: 'data-workspace', kind: 'block' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const renderBlock = () => <DataWorkspace />;
export const Default: Story = { render: renderBlock };
export const RTL: Story = { globals: { dir: 'rtl' }, render: renderBlock };
export const ForcedColors: Story = { globals: { forcedColors: 'active' }, render: renderBlock };
export const Empty: Story = { render: renderBlock };
export const ReducedTransparency: Story = { globals: { transparency: 'reduced' }, render: renderBlock };
