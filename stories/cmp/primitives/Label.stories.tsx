import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Label } from '../../../src/primitives/Label';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'Foundation/Label',
  component: Label,
  tags: ['core'],
  parameters: { ag: { subject: 'Label', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Label htmlFor="f">Name</Label> };
export const States: Story = {
  render: () => (
    <>
      <Label htmlFor="a" required>Required</Label>
      <Label htmlFor="b" disabled>Disabled</Label>
    </>
  ),
};
export const ForcedColors: Story = { render: () => <Label htmlFor="c">Label</Label> };
export const RTL: Story = { render: () => <Label htmlFor="d" dir="rtl">Label</Label> };
