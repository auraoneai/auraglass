import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SegmentedControl } from '../../../src/components/segmented-control';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Scene, Section, Stage } from './controls-stage';

const sbMeta = {
  title: 'Flagships/Controls/SegmentedControl',
  component: SegmentedControl.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'SegmentedControl', kind: 'component' } },
  args: { 'aria-label': 'View mode', name: 'view' },
} satisfies Meta<typeof SegmentedControl.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* SegmentedControl is chrome: a glass capsule track over the scene with an
   opaque raised thumb on the selected segment. */
export const Default: Story = {
  args: { 'aria-label': 'View mode', name: 'view' },
  render: (args) => (
    <Stage>
      <Section title="Segmented control" note="Glass capsule track; the selected segment is an opaque raised thumb.">
        <Scene align="flex-start">
          <SegmentedControl.Root {...args} defaultValue="grid">
            <SegmentedControl.Item value="list">List</SegmentedControl.Item>
            <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
          </SegmentedControl.Root>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Overview: Story = {
  render: (args) => (
    <Stage>
      <Section title="View switcher" note="Three segments at the md control height.">
        <Scene align="flex-start">
          <SegmentedControl.Root {...args} defaultValue="grid">
            <SegmentedControl.Item value="list">List</SegmentedControl.Item>
            <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
            <SegmentedControl.Item value="map">Map</SegmentedControl.Item>
          </SegmentedControl.Root>
        </Scene>
      </Section>
    </Stage>
  ),
};

export const Sizes: Story = {
  args: { 'aria-label': 'size', name: 'size' },
  render: () => (
    <Stage>
      <Section title="Sizes" note="sm / md / lg track on the shared control-height tokens.">
        <Scene>
          <div style={{ display: 'grid', gap: 'var(--ag-space-4)', justifyItems: 'start' }}>
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <SegmentedControl.Root key={s} aria-label={`Range ${s}`} name={`size-${s}`} size={s} defaultValue="day">
                <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
                <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
                <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
              </SegmentedControl.Root>
            ))}
          </div>
        </Scene>
      </Section>
    </Stage>
  ),
};

const FILTERS = ['All', 'Favourites', 'Shared', 'Recent', 'Videos', 'Archived'];

export const ManyItems: Story = {
  args: { 'aria-label': 'Filters', name: 'filters' },
  render: () => (
    <Stage>
      <Section title="Constrained width" note="Labels ellipsise when the track is narrower than its segments.">
        <Scene align="flex-start">
          <div style={{ maxWidth: '390px' }}>
            <SegmentedControl.Root aria-label="Filters" name="filters" defaultValue="All">
              {FILTERS.map((f) => (
                <SegmentedControl.Item key={f} value={f} title={f}>
                  {f}
                </SegmentedControl.Item>
              ))}
            </SegmentedControl.Root>
          </div>
        </Scene>
      </Section>
    </Stage>
  ),
};
