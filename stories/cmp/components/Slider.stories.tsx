import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Slider } from '../../../src/components/slider';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Panel, Scene, Section, Stage } from './controls-stage';

const sbMeta = {
  title: 'Flagships/Controls/Slider',
  component: Slider.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Slider', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Slider.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const label: React.CSSProperties = {
  fontSize: 'var(--ag-type-label-size)',
  lineHeight: 'var(--ag-type-label-leading)',
  fontWeight: 'var(--ag-type-label-weight)',
};

/* An element builder, not a component: stories call it so Slider.Root stays in the
   story's static element tree (the ref-forwarding check attaches `ref` there). */
function volume() {
  return (
    <Stage>
      <Section title="Slider" note="Opaque thumb on a sunken track; marks and labels sit inside the slider box.">
        <Scene>
          <Panel title="Playback" width={420}>
            <div style={{ display: 'grid', gap: 'var(--ag-space-1)' }}>
              <span style={label}>Volume</span>
              <Slider.Root
                aria-label="Volume"
                defaultValue={40}
                min={0}
                max={100}
                marks={[
                  { value: 0, label: '0' },
                  { value: 50, label: '50' },
                  { value: 100, label: '100' },
                ]}
              />
            </div>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  );
}

/* Usage: one value on a 0–100 track. */
export const Playground: Story = {
  render: () => (
    <Stage>
      <Section title="Slider" note="Drag the thumb or use the arrow keys.">
        <Scene>
          <Panel title="Display" width={420}>
            <div style={{ display: 'grid', gap: 'var(--ag-space-1)' }}>
              <span style={label}>Brightness</span>
              <Slider.Root aria-label="Brightness" defaultValue={70} min={0} max={100} />
            </div>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

/* Enabled, stepped, and disabled tracks. */
export const States: Story = {
  render: () => (
    <Stage>
      <Section title="States" note="Continuous, stepped in fives, and disabled.">
        <Scene>
          <Panel title="Thermostat" width={420}>
            <div style={{ display: 'grid', gap: 'var(--ag-space-4)' }}>
              <div style={{ display: 'grid', gap: 'var(--ag-space-1)' }}>
                <span style={label}>Living room</span>
                <Slider.Root aria-label="Living room" defaultValue={21} min={10} max={30} />
              </div>
              <div style={{ display: 'grid', gap: 'var(--ag-space-1)' }}>
                <span style={label}>Fan speed</span>
                <Slider.Root aria-label="Fan speed" defaultValue={50} min={0} max={100} step={5} />
              </div>
              <div style={{ display: 'grid', gap: 'var(--ag-space-1)' }}>
                <span style={label}>Hallway (schedule locked)</span>
                <Slider.Root aria-label="Hallway" defaultValue={18} min={10} max={30} disabled />
              </div>
            </div>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Default: Story = { render: () => volume() };

/* The story tests/a11y/apg/cmp/slider.apg.spec.ts drives (Arrow ±step, Shift/Page ±largeStep, Home/End, RTL mirror). */
export const Keyboard: Story = { tags: ['apg'], render: () => volume() };

export const Range: Story = {
  render: () => (
    <Stage>
      <Section title="Range" note="Two thumbs on one track.">
        <Scene>
          <Panel title="Price filter" width={420}>
            <div style={{ display: 'grid', gap: 'var(--ag-space-1)' }}>
              <span style={label}>Price range</span>
              <Slider.Root aria-label="Range" defaultValue={[20, 80]} />
            </div>
          </Panel>
        </Scene>
      </Section>
    </Stage>
  ),
};
