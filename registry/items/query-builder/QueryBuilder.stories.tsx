import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { QueryBuilder } from './index';
import { FIELDS } from './fixtures';

const meta = {
  title: 'registry/query-builder',
  parameters: { ag: { subject: 'query-builder', kind: 'item' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const renderItem = () => <QueryBuilder schema={FIELDS} />;
export const Default: Story = { render: renderItem };
export const Empty: Story = { render: () => <QueryBuilder schema={[]} /> };
export const RTL: Story = { globals: { dir: 'rtl' }, render: renderItem };
export const ForcedColors: Story = { globals: { forcedColors: 'active' }, render: renderItem };
export const ReducedTransparency: Story = { globals: { transparency: 'reduced' }, render: renderItem };
