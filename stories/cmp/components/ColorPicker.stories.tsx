import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ColorPicker } from '../../../src/components/color-picker';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/ColorPicker',
  component: ColorPicker.Root,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'ColorPicker', kind: 'component' } },
} satisfies Meta<typeof ColorPicker.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'ColorPicker', id: 'core-color-picker--default' } },
  render: () => (
    <ColorPicker.Root defaultOpen defaultValue="#3b82f6">
      <ColorPicker.Trigger />
      <ColorPicker.Content>
        <ColorPicker.Area />
        <ColorPicker.Hue />
      </ColorPicker.Content>
    </ColorPicker.Root>
  ),
};

