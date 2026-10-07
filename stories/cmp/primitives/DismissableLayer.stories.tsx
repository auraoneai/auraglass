import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { DismissableLayer } from '../../../src/primitives/DismissableLayer';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'Foundation/DismissableLayer',
  component: DismissableLayer,
  tags: ['core'],
  parameters: { ag: { subject: 'DismissableLayer', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof DismissableLayer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DismissableLayer onDismiss={() => {}}>
      <div style={{ padding: 8 }}>Layer content</div>
    </DismissableLayer>
  ),
};
export const States: Story = {
  render: () => (
    <DismissableLayer disabled onDismiss={() => {}}>
      <div style={{ padding: 8 }}>Disabled layer</div>
    </DismissableLayer>
  ),
};
export const ForcedColors: Story = {
  render: () => (
    <DismissableLayer onDismiss={() => {}}>
      <div style={{ padding: 8 }}>Layer</div>
    </DismissableLayer>
  ),
};
export const RTL: Story = {
  render: () => (
    <DismissableLayer onDismiss={() => {}}>
      <div style={{ padding: 8 }} dir="rtl">Layer</div>
    </DismissableLayer>
  ),
};
