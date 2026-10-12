import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { NumberField } from '../../../src/components/number-field';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Panel, Scene, Section, Stage } from './controls-stage';

const sbMeta = {
  title: 'Flagships/Controls/NumberField',
  component: NumberField,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'NumberField', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof NumberField>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* Usage: a labelled quantity with steppers. */
export const Playground: Story = {
  render: () => (
    <Stage>
      <Section title="Number field" note="Type a value or use the steppers; figures are tabular.">
        <Scene>
          <Panel title="Team plan" width={400}>
            <NumberField label="Seats" defaultValue={5} min={1} max={50} description="Billed per seat each month." />
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

/* Enabled, disabled, read-only and invalid. */
export const States: Story = {
  render: () => (
    <Stage>
      <Section title="States" note="Disabled and read-only remove the steppers from the tab order; invalid adds the danger rim and message.">
        <Scene>
          <Panel title="Capacity" width={400}>
            <div style={{ display: 'grid', gap: 'var(--ag-space-4)' }}>
              <NumberField label="Replicas" defaultValue={3} min={1} max={12} />
              <NumberField label="Regions" defaultValue={2} disabled />
              <NumberField label="Zones per region" defaultValue={3} readOnly />
              <NumberField label="Max connections" defaultValue={0} min={1} error="Allow at least one connection." />
            </div>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Default: Story = {
  render: () => (
    <Stage>
      <Section title="Number field" note="Sunken shell with hairline-divided steppers and tabular figures.">
        <Scene>
          <Panel title="Print order" width={400}>
            <NumberField label="Quantity" defaultValue={2} min={0} max={10} description="Between 0 and 10." />
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Stage>
      <Section title="Invalid" note="Danger rim plus the error message.">
        <Scene>
          <Panel title="Workshop" width={400}>
            <NumberField label="Seats" defaultValue={99} max={10} error="Only 10 seats are left." />
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Scrub: Story = {
  render: () => (
    <Stage>
      <Section title="Scrub" note="Drag the label horizontally to change the value.">
        <Scene>
          <Panel title="Exposure" width={400}>
            <NumberField label="Offset" defaultValue={5} min={-10} max={10} scrub />
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

/* The story tests/a11y/apg/cmp/number-field.apg.spec.ts drives: every step key (±1, Shift ±10, Alt ±0.1, PageUp)
   is asserted against an exact value, so the range leaves room for each increment around the starting value. */
export const Keyboard: Story = {
  tags: ['apg'],
  render: () => (
    <Stage>
      <Section title="Keyboard" note="Arrow keys step by 1, Shift by 10, Alt by 0.1; Page Up and Page Down step by 10.">
        <Scene>
          <Panel title="Exposure" width={400}>
            <NumberField label="Offset" defaultValue={2} min={-100} max={100} />
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};
