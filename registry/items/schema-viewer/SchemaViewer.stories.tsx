import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SchemaViewer } from './index';
import { SCHEMA } from './fixtures';

const meta = {
  title: 'registry/schema-viewer',
  parameters: { ag: { subject: 'schema-viewer', kind: 'item' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const renderItem = () => <SchemaViewer schema={SCHEMA as unknown as Record<string, unknown>} />;
export const Default: Story = { render: renderItem };
export const RTL: Story = { globals: { dir: 'rtl' }, render: renderItem };
export const ForcedColors: Story = { globals: { forcedColors: 'active' }, render: renderItem };
export const Empty: Story = { render: () => <SchemaViewer schema={{}} /> };
export const ReducedTransparency: Story = { globals: { transparency: 'reduced' }, render: renderItem };
