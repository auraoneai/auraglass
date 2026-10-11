import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Rating } from '../../../src/components/rating';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Rating',
  component: Rating,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Rating', kind: 'component' } },
} satisfies Meta<typeof Rating>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Rating', id: 'core-rating--default' } },
  render: () => (
    <Rating defaultValue={3} />
  ),
};

export const ReadOnly: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Rating', id: 'core-rating--read-only' } },
  render: () => (
    <Rating value={4} readOnly />
  ),
};

export const Half: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Rating', id: 'core-rating--half' } },
  render: () => (
    <Rating defaultValue={2.5} allowHalf />
  ),
};

