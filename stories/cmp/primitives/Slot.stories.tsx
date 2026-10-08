import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Slot } from '../../../src/primitives/Slot';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'Foundation/Slot',
  component: Slot,
  tags: ['core'],
  parameters: { ag: { subject: 'Slot', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Slot>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Slot className="from-slot" style={{ color: 'red' }}><button data-ag-part="root" className="from-child" style={{ fontWeight: 700 }}>Slotted</button></Slot>,
};
export const States: Story = {
  render: () => <Slot><button data-ag-part="root" data-state="on" aria-pressed="true">Pressed</button></Slot>,
};
export const ForcedColors: Story = {
  render: () => <Slot><button data-ag-part="root">Slotted</button></Slot>,
};
export const RTL: Story = {
  render: () => <Slot><button data-ag-part="root" dir="rtl">Slotted</button></Slot>,
};
