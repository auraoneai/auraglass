import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Kbd } from '../../../src/components/kbd';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Kbd',
  component: Kbd,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Kbd', kind: 'component' } },
} satisfies Meta<typeof Kbd>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Kbd', id: 'core-kbd--default' } },
  render: () => (
    <Kbd>Esc</Kbd>
  ),
};

export const Sequence: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Kbd', id: 'core-kbd--sequence' } },
  render: () => (
    <Kbd keys={['⌘','Shift','K']} />
  ),
};

