import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { NumberField } from '../../../src/components/number-field';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/NumberField',
  component: NumberField,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'NumberField', kind: 'component' } },
} satisfies Meta<typeof NumberField>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  render: () => (
    <NumberField label="Quantity" defaultValue={2} min={0} max={10} description="Between 0 and 10." />
  ),
};

export const Invalid: Story = {
  render: () => <NumberField label="Seats" defaultValue={99} max={10} error="Too many" />,
};

export const Scrub: Story = {
  render: () => <NumberField label="Offset" defaultValue={5} min={-10} max={10} scrub />,
};
