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
  parameters: { ag: { tier: 'standard', subject: 'RadioGroup', kind: 'component' } },
} satisfies Meta<typeof RadioGroup.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  render: () => (
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
  ),
};

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
