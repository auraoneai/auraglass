import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { NumberField } from '../../../src/components/number-field';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Panel, Scene, Section, Stage } from './controls-stage';

const sbMeta = {
  title: 'Flagships/Controls/NumberField',
  component: NumberField,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'NumberField', kind: 'component' } },
} satisfies Meta<typeof NumberField>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

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
