import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from '../../../src/components/heading';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Heading',
  component: Heading,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Heading', kind: 'component' } },
 args: { level: 3 } } satisfies Meta<typeof Heading>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Heading', id: 'core-heading--default' } },
  render: () => (
    <Heading level={2}>Heading</Heading>
  ),
};

export const Levels: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Heading', id: 'core-heading--levels' } },
  render: () => (
    <div>
      <Heading level={1}>H1</Heading><Heading level={2}>H2</Heading><Heading level={3}>H3</Heading>
      <Heading level={4}>H4</Heading><Heading level={5}>H5</Heading><Heading level={6}>H6</Heading>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Heading', id: 'core-heading--sizes' } },
  render: () => (
    <div>
      <Heading level={2} size="display">display</Heading>
      <Heading level={2} size="title-1">title-1</Heading>
      <Heading level={2} size="title-2">title-2</Heading>
      <Heading level={2} size="title-3">title-3</Heading>
      <Heading level={2} size="sm">sm</Heading>
      <Heading level={2} size="xl">xl</Heading>
    </div>
  ),
};

