import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '../../../src/components/accordion';
import type { StoryAgParameters } from '../../../src/contracts/testing';

/* Accordion is T2 core (REQ-CMP-22: flagship 18 is Popover), so it is titled under Core (REQ-QUAL-49). It keeps the
   Playground, States and Keyboard stories for the APG script and the L13 spot check. Ids core-accordion--*. */
const sbMeta = {
  title: 'Core/Accordion',
  component: Accordion.Root,
  tags: ['certified', 'core'],
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
/* Three sections so the APG spec can prove roving movement between headers
   (ArrowDown → 2nd → 3rd, ArrowUp → 2nd, End → last, Home → first) without a
   wrap making a no-op key indistinguishable (REQ-CMP-121). */
function ThreeSections() {
  return (
    <Accordion.Root multiple>
      <Accordion.Item value="shipping"><Accordion.Header><Accordion.Trigger>Shipping</Accordion.Trigger></Accordion.Header><Accordion.Content>Ships in two days.</Accordion.Content></Accordion.Item>
      <Accordion.Item value="returns"><Accordion.Header><Accordion.Trigger>Returns</Accordion.Trigger></Accordion.Header><Accordion.Content>Thirty-day returns.</Accordion.Content></Accordion.Item>
      <Accordion.Item value="warranty"><Accordion.Header><Accordion.Trigger>Warranty</Accordion.Trigger></Accordion.Header><Accordion.Content>One-year warranty.</Accordion.Content></Accordion.Item>
    </Accordion.Root>
  );
}
export const Keyboard: Story = { tags: ['apg'], render: () => <ThreeSections /> };
