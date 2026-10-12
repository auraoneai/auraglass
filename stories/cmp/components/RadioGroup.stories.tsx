import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { RadioGroup } from '../../../src/components/radio-group';
import { Card } from '../../../src/components/card';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Panel, Scene, Section, Stage } from './controls-stage';

const sbMeta = {
  title: 'Flagships/Controls/RadioGroup',
  component: RadioGroup.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'RadioGroup', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof RadioGroup.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* An element builder, not a component: stories call it so RadioGroup.Root stays in the
   story's static element tree (the ref-forwarding check attaches `ref` there). */
function billingCycle() {
  return (
    <Stage>
      <Section title="Radio group" note="One choice from a short list; the ring is drawn for every option.">
        <Scene>
          <Panel title="Billing cycle" width={400}>
            <RadioGroup.Root defaultValue="a" aria-label="plan">
              <RadioGroup.Item value="a">Annual</RadioGroup.Item>
              <RadioGroup.Item value="b">Monthly</RadioGroup.Item>
            </RadioGroup.Root>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  );
}

/* Usage: one choice from three. */
export const Playground: Story = {
  render: () => (
    <Stage>
      <Section title="Radio group" note="Arrow keys move the selection; the group is one tab stop.">
        <Scene>
          <Panel title="Delivery speed" width={400}>
            <RadioGroup.Root defaultValue="standard" aria-label="Delivery speed">
              <RadioGroup.Item value="standard">Standard (3–5 days)</RadioGroup.Item>
              <RadioGroup.Item value="express">Express (next day)</RadioGroup.Item>
              <RadioGroup.Item value="pickup">Store pickup</RadioGroup.Item>
            </RadioGroup.Root>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

/* Selected, unselected, a disabled option, and a disabled group. */
export const States: Story = {
  render: () => (
    <Stage>
      <Section title="States" note="A disabled option is skipped by the arrow keys; a disabled group leaves the tab order.">
        <Scene>
          <Panel title="Data residency" width={400}>
            <div style={{ display: 'grid', gap: 'var(--ag-space-5)' }}>
              <RadioGroup.Root defaultValue="eu" aria-label="Primary region">
                <RadioGroup.Item value="eu">Europe</RadioGroup.Item>
                <RadioGroup.Item value="us">United States</RadioGroup.Item>
                <RadioGroup.Item value="ap" disabled>Asia Pacific (waitlist)</RadioGroup.Item>
              </RadioGroup.Root>
              <RadioGroup.Root defaultValue="eu" aria-label="Backup region" disabled>
                <RadioGroup.Item value="eu">Europe</RadioGroup.Item>
                <RadioGroup.Item value="us">United States</RadioGroup.Item>
              </RadioGroup.Root>
            </div>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Default: Story = { render: () => billingCycle() };

/* The story tests/a11y/apg/cmp/radio-group.apg.spec.ts drives (one tab stop; arrows move and select with wrap). */
export const Keyboard: Story = { tags: ['apg'], render: () => billingCycle() };

function Choice({ name, price, detail }: { name: string; price: string; detail: string }) {
  return (
    <span style={{ display: 'grid', gap: 'var(--ag-space-1)' }}>
      <span style={{ fontWeight: 'var(--ag-type-label-weight)' }}>{name}</span>
      <span
        style={{
          fontSize: 'var(--ag-type-title-3-size)',
          lineHeight: 'var(--ag-type-title-3-leading)',
          fontWeight: 'var(--ag-type-title-3-weight)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {price}
      </span>
      <span style={{ color: 'var(--ag-color-on-surface-muted)', fontSize: 'var(--ag-type-caption-size)', lineHeight: 'var(--ag-type-caption-leading)' }}>
        {detail}
      </span>
    </span>
  );
}

/* REQ-CMP-56: ChoiceCards — the Item's render swaps in a Card root so the
   card IS the radio (no nested focusable, no nested glass). The content is
   passed as the Item's children: children on the render element replace the
   Item's indicator and label parts, which left the cards with no radio ring. */
export const ChoiceCards: Story = {
  render: () => (
    <Stage>
      <Section title="Choice cards" note="Content-raised cards over the scene; the selected card adds an accent rim, not colour alone.">
        <Scene>
          <div style={{ inlineSize: 'min(100%, 560px)' }}>
            <RadioGroup.Root defaultValue="a" aria-label="plan" className="ag-radio-group--cards">
              <RadioGroup.Item value="a" render={<Card />}>
                <Choice name="Annual" price="$96 / year" detail="Two months free" />
              </RadioGroup.Item>
              <RadioGroup.Item value="b" render={<Card />}>
                <Choice name="Monthly" price="$10 / month" detail="Cancel any time" />
              </RadioGroup.Item>
            </RadioGroup.Root>
          </div>
        </Scene>
      </Section>
    </Stage>
  ),
};
