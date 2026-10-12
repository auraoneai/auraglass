import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '../../../src/components/accordion';
import type { StoryAgParameters } from '../../../src/contracts/testing';

/* Accordion is flagship #18 (ComponentMeta.flagship), so it is titled under Flagships with the REQUIRED_FLAGSHIP_STORIES
   (Playground, States, Keyboard). Ids flagships-overlays-accordion--*. */
const sbMeta = {
  title: 'Flagships/Overlays/Accordion',
  component: Accordion.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Accordion', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Accordion.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

function TwoSections() {
  return (
    <Accordion.Root multiple defaultValue={['a']}>
      <Accordion.Item value="a"><Accordion.Header><Accordion.Trigger>A</Accordion.Trigger></Accordion.Header><Accordion.Content>a</Accordion.Content></Accordion.Item>
      <Accordion.Item value="b"><Accordion.Header><Accordion.Trigger>B</Accordion.Trigger></Accordion.Header><Accordion.Content>b</Accordion.Content></Accordion.Item>
    </Accordion.Root>
  );
}

/* Usage: a short FAQ, one section open. */
export const Playground: Story = {
  render: () => (
    <Accordion.Root defaultValue={['billing']}>
      <Accordion.Item value="billing">
        <Accordion.Header><Accordion.Trigger>When am I billed?</Accordion.Trigger></Accordion.Header>
        <Accordion.Content>On the first day of each billing cycle, in your workspace currency.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="refunds">
        <Accordion.Header><Accordion.Trigger>Can I get a refund?</Accordion.Trigger></Accordion.Header>
        <Accordion.Content>Annual plans are refundable within 30 days of purchase.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="seats">
        <Accordion.Header><Accordion.Trigger>How do seats work?</Accordion.Trigger></Accordion.Header>
        <Accordion.Content>Every active member uses one seat; guests are free.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

/* Open, closed and disabled sections in one accordion. */
export const States: Story = {
  render: () => (
    <Accordion.Root multiple defaultValue={['open']}>
      <Accordion.Item value="open">
        <Accordion.Header><Accordion.Trigger>Open section</Accordion.Trigger></Accordion.Header>
        <Accordion.Content>Expanded: the trigger reports aria-expanded="true".</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="closed">
        <Accordion.Header><Accordion.Trigger>Closed section</Accordion.Trigger></Accordion.Header>
        <Accordion.Content>Collapsed until its trigger is pressed.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="locked" disabled>
        <Accordion.Header><Accordion.Trigger>Disabled section</Accordion.Trigger></Accordion.Header>
        <Accordion.Content>Unavailable on the current plan.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

export const Default: Story = {
  render: () => (
    <Accordion.Root defaultValue={['i1']}>
      <Accordion.Item value="i1">
        <Accordion.Header><Accordion.Trigger>Section</Accordion.Trigger></Accordion.Header>
        <Accordion.Content>Content</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

export const Multiple: Story = { render: () => <TwoSections /> };

export const HeadingLevel: Story = {
  render: () => (
    <Accordion.Root defaultValue={['i1']}>
      <Accordion.Item value="i1">
        <Accordion.Header headingLevel={4}><Accordion.Trigger>Section</Accordion.Trigger></Accordion.Header>
        <Accordion.Content>Content</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

/* The story tests/a11y/apg/cmp/accordion.apg.spec.ts drives: Tab to triggers, Enter/Space toggle, Arrow/Home/End move. */
export const Keyboard: Story = { tags: ['apg'], render: () => <TwoSections /> };
