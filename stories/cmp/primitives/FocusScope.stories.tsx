import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { FocusScope } from '../../../src/primitives/FocusScope';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'Foundation/FocusScope',
  component: FocusScope,
  tags: ['core'],
  parameters: { ag: { subject: 'FocusScope', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof FocusScope>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FocusScope trapped loop>
      <button>First</button><button>Second</button>
    </FocusScope>
  ),
};
export const States: Story = {
  render: () => (
    <FocusScope autoFocus>
      <button>Auto-focused</button>
    </FocusScope>
  ),
};
export const ForcedColors: Story = {
  render: () => (
    <FocusScope><button>Scoped</button></FocusScope>
  ),
};
export const RTL: Story = {
  render: () => (
    <FocusScope><button dir="rtl">Scoped</button></FocusScope>
  ),
};
