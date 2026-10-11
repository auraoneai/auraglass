import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Chip } from './Chip';

const meta = {
  title: 'surf/chip',
  parameters: { ag: { subject: 'Chip', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const renderChips = () => (
  <div style={{ display: 'flex', gap: 8 }}>
    <Chip>Static</Chip>
    <Chip selectable defaultSelected>
      Selectable
    </Chip>
    <Chip intent="success" onRemove={() => {}}>
      Removable
    </Chip>
    <Chip intent="danger" size="sm">
      Small danger
    </Chip>
  </div>
);
export const Basic: Story = { render: renderChips };
export const RTL: Story = { globals: { dir: 'rtl' }, render: renderChips };
export const ForcedColors: Story = { globals: { forcedColors: 'active' }, render: renderChips };
