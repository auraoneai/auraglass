import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Container } from '../../../src/components/container';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Container',
  component: Container,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Container', kind: 'component' } },
} satisfies Meta<typeof Container>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Container', id: 'core-container--default' } },
  render: () => (
    <Container size="md"><div>Contained</div></Container>
  ),
};

export const Sizes: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Container', id: 'core-container--sizes' } },
  render: () => (
    <div>
      <Container size="sm"><div>sm</div></Container>
      <Container size="xl"><div>xl</div></Container>
      <Container size="full"><div>full</div></Container>
    </div>
  ),
};

