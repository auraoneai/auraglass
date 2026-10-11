import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Slider } from '../../../src/components/slider';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Panel, Scene, Section, Stage } from './controls-stage';

const sbMeta = {
  title: 'Flagships/Controls/Slider',
  component: Slider.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Slider', kind: 'component' } },
} satisfies Meta<typeof Slider.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const label: React.CSSProperties = {
  fontSize: 'var(--ag-type-label-size)',
  lineHeight: 'var(--ag-type-label-leading)',
  fontWeight: 'var(--ag-type-label-weight)',
};

export const Default: Story = {
  render: () => (
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
  ),
};

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
