import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '../../../src/components/stack';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Stack',
  component: Stack,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Stack', kind: 'component' } },
} satisfies Meta<typeof Stack>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Stack', id: 'core-stack--default' } },
  render: () => (
    <Stack gap={2}>
      <div>One</div><div>Two</div>
    </Stack>
  ),
};

export const Row: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Stack', id: 'core-stack--row' } },
  render: () => (
    <Stack direction="row" gap={2} separator={<span>|</span>}>
      <div>A</div><div>B</div><div>C</div>
    </Stack>
  ),
};

export const Alignments: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Stack', id: 'core-stack--alignments' } },
  render: () => (
    <Stack direction="row" gap={2} align="center" justify="between">
      <div>L</div><div>R</div>
    </Stack>
  ),
};

