import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ToggleGroup } from '../../../src/components/toggle-group';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/ToggleGroup',
  component: ToggleGroup.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'ToggleGroup', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof ToggleGroup.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  render: () => (
    <ToggleGroup.Root defaultValue={['b']}>
      <ToggleGroup.Item value="b">Bold</ToggleGroup.Item>
      <ToggleGroup.Item value="i">Italic</ToggleGroup.Item>
      <ToggleGroup.Item value="u">Underline</ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup.Root multiple defaultValue={['b', 'i']}>
      <ToggleGroup.Item value="b">Bold</ToggleGroup.Item>
      <ToggleGroup.Item value="i">Italic</ToggleGroup.Item>
      <ToggleGroup.Item value="u">Underline</ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ToggleGroup.Root orientation="vertical">
      <ToggleGroup.Item value="a">A</ToggleGroup.Item>
      <ToggleGroup.Item value="b">B</ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};
