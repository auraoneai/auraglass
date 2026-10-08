import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Slider } from '../../../src/components/slider';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/Slider',
  component: Slider.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Slider', kind: 'component' } },
} satisfies Meta<typeof Slider.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  render: () => (
    <Slider.Root
      aria-label="Volume"
      defaultValue={40}
      min={0}
      max={100}
      marks={[
        { value: 0, label: '0' },
        { value: 50, label: '50' },
        { value: 100, label: '100' },
      ]}
    />
  ),
};

export const Range: Story = {
  render: () => <Slider.Root aria-label="Range" defaultValue={[20, 80]} />,
};
