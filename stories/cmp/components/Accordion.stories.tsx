import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '../../../src/components/accordion';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Accordion',
  component: Accordion.Root,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Accordion', kind: 'component' } },
} satisfies Meta<typeof Accordion.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Accordion', id: 'core-accordion--default' } },
  render: () => (
    <Accordion.Root defaultValue={['i1']}>
      <Accordion.Item value="i1">
        <Accordion.Header><Accordion.Trigger>Section</Accordion.Trigger></Accordion.Header>
        <Accordion.Content>Content</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

export const Multiple: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Accordion', id: 'core-accordion--multiple' } },
  render: () => (
    <Accordion.Root multiple defaultValue={['a']}>
      <Accordion.Item value="a"><Accordion.Header><Accordion.Trigger>A</Accordion.Trigger></Accordion.Header><Accordion.Content>a</Accordion.Content></Accordion.Item>
      <Accordion.Item value="b"><Accordion.Header><Accordion.Trigger>B</Accordion.Trigger></Accordion.Header><Accordion.Content>b</Accordion.Content></Accordion.Item>
    </Accordion.Root>
  ),
};

