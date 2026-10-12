import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ToggleGroup } from '../../../src/components/toggle-group';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Panel, Scene, Section, Stage } from './controls-stage';

const sbMeta = {
  title: 'Flagships/Controls/ToggleGroup',
  component: ToggleGroup.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'ToggleGroup', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof ToggleGroup.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* ToggleGroup is a content control: a sunken well on a content-raised panel;
   the pressed item is an opaque raised platter. */
function TextStyle() {
  return (
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
  );
}

/* Usage: a two-option view switch. */
export const Playground: Story = {
  render: () => (
    <Stage>
      <Section title="Toggle group" note="Arrow keys move focus; Enter or Space presses the focused item.">
        <Scene>
          <Panel title="Layout" width={400}>
            <ToggleGroup.Root defaultValue={['list']} aria-label="Layout">
              <ToggleGroup.Item value="list">List</ToggleGroup.Item>
              <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
            </ToggleGroup.Root>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

/* Pressed, unpressed, a disabled item and a disabled group. */
export const States: Story = {
  render: () => (
    <Stage>
      <Section title="States" note="The pressed item is raised; disabled items keep their place but take no input.">
        <Scene>
          <Panel title="Chart range" width={400}>
            <div style={{ display: 'grid', gap: 'var(--ag-space-5)' }}>
              <ToggleGroup.Root defaultValue={['week']} aria-label="Range">
                <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
                <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
                <ToggleGroup.Item value="year" disabled>Year</ToggleGroup.Item>
              </ToggleGroup.Root>
              <ToggleGroup.Root defaultValue={['day']} aria-label="Comparison range" disabled>
                <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
                <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Default: Story = { render: () => <TextStyle /> };

/* The story tests/a11y/apg/cmp/toggle-group.apg.spec.ts drives (roving focus with loop, Home/End, Enter/Space). */
export const Keyboard: Story = { tags: ['apg'], render: () => <TextStyle /> };

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
