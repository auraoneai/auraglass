import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ToggleGroup } from '../../../src/components/toggle-group';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Panel, Scene, Section, Stage } from './controls-stage';

const sbMeta = {
  title: 'Flagships/Controls/ToggleGroup',
  component: ToggleGroup.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'ToggleGroup', kind: 'component' } },
} satisfies Meta<typeof ToggleGroup.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* ToggleGroup is a content control: a sunken well on a content-raised panel;
   the pressed item is an opaque raised platter. */
export const Default: Story = {
  render: () => (
    <Stage>
      <Section title="Toggle group" note="Single selection: the pressed item lifts out of the well.">
        <Scene>
          <Panel title="Text style" width={400}>
            <ToggleGroup.Root defaultValue={['b']} aria-label="Text style">
              <ToggleGroup.Item value="b">Bold</ToggleGroup.Item>
              <ToggleGroup.Item value="i">Italic</ToggleGroup.Item>
              <ToggleGroup.Item value="u">Underline</ToggleGroup.Item>
            </ToggleGroup.Root>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Stage>
      <Section title="Multiple" note="Any combination can be pressed.">
        <Scene>
          <Panel title="Text style" width={400}>
            <ToggleGroup.Root multiple defaultValue={['b', 'i']} aria-label="Text style">
              <ToggleGroup.Item value="b">Bold</ToggleGroup.Item>
              <ToggleGroup.Item value="i">Italic</ToggleGroup.Item>
              <ToggleGroup.Item value="u">Underline</ToggleGroup.Item>
            </ToggleGroup.Root>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Stage>
      <Section title="Vertical" note="Start-aligned items in a rounded well.">
        <Scene>
          <Panel title="Alignment" width={320}>
            <ToggleGroup.Root orientation="vertical" defaultValue={['left']} aria-label="Alignment">
              <ToggleGroup.Item value="left">Align left</ToggleGroup.Item>
              <ToggleGroup.Item value="center">Align centre</ToggleGroup.Item>
              <ToggleGroup.Item value="right">Align right</ToggleGroup.Item>
            </ToggleGroup.Root>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};
