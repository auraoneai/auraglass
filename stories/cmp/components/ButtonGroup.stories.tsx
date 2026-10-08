import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ButtonGroup } from '../../../src/components/button-group';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/ButtonGroup',
  component: ButtonGroup,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'ButtonGroup', kind: 'component' } satisfies StoryAgParameters },
  args: { 'aria-label': 'Actions' },
} satisfies Meta<typeof ButtonGroup>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <button type="button">One</button>
      <button type="button">Two</button>
      <button type="button">Three</button>
    </ButtonGroup>
  ),
};

export const Detached: Story = {
  args: { 'aria-label': 'Actions' },
  render: (args) => (
    <ButtonGroup {...args} attached={false}>
      <button type="button">One</button>
      <button type="button">Two</button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  args: { 'aria-label': 'Actions' },
  render: (args) => (
    <ButtonGroup {...args} orientation="vertical">
      <button type="button">One</button>
      <button type="button">Two</button>
    </ButtonGroup>
  ),
};
