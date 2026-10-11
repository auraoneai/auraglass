import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TreeSelect } from './index';
import { FILES } from './fixtures';

const meta = {
  title: 'registry/tree-select',
  parameters: { ag: { subject: 'tree-select', kind: 'item' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const renderItem = () => <TreeSelect items={FILES} label="Folder" />;
export const Default: Story = { render: renderItem };
export const RTL: Story = { globals: { dir: 'rtl' }, render: renderItem };
export const ForcedColors: Story = { globals: { forcedColors: 'active' }, render: renderItem };
export const Empty: Story = { render: () => <TreeSelect items={[]} label="Folder" /> };
export const ReducedTransparency: Story = { globals: { transparency: 'reduced' }, render: renderItem };
