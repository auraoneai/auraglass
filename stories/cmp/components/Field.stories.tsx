import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Field } from '../../../src/components/field';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/Field',
  component: Field.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Field', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Field.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Display name</Field.Label>
      <Field.Control render={<input />} />
      <Field.Description>Shown on your profile.</Field.Description>
    </Field.Root>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field.Root invalid>
      <Field.Label>Email</Field.Label>
      <Field.Control render={<input />} />
      <Field.Description>We never share it.</Field.Description>
      <Field.Error match={true}>Enter a valid email.</Field.Error>
    </Field.Root>
  ),
};
