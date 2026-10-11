import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { VisuallyHidden } from '../../../src/primitives/VisuallyHidden';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'Foundation/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['core'],
  parameters: { ag: { subject: 'VisuallyHidden', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof VisuallyHidden>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <VisuallyHidden>document</VisuallyHidden>,
};
export const States: Story = {
  render: () => <VisuallyHidden focusable><a href="#main">Skip to content</a></VisuallyHidden>,
};
export const ForcedColors: Story = {
  render: () => <button>Save<VisuallyHidden> file</VisuallyHidden></button>,
};
export const RTL: Story = {
  render: () => <button dir="rtl">Save<VisuallyHidden> document</VisuallyHidden></button>,
};
