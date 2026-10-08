import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SegmentedControl } from '../../../src/components/segmented-control';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/SegmentedControl',
  component: SegmentedControl.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'SegmentedControl', kind: 'component' } },
  args: { 'aria-label': 'View mode' },
} satisfies Meta<typeof SegmentedControl.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  args: { 'aria-label': 'View mode' },
  render: (args) => (
    <SegmentedControl.Root {...args} defaultValue="grid">
      <SegmentedControl.Item value="list">List</SegmentedControl.Item>
      <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
    </SegmentedControl.Root>
  ),
};

export const Overview: Story = {
  render: (args) => (
    <SegmentedControl.Root {...args} defaultValue="grid">
      <SegmentedControl.Item value="list">List</SegmentedControl.Item>
      <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
      <SegmentedControl.Item value="map">Map</SegmentedControl.Item>
    </SegmentedControl.Root>
  ),
};

export const Sizes: Story = {
  args: { 'aria-label': 'size' },
  render: () => (
    <div style={{ display: 'grid', gap: '12px' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <SegmentedControl.Root key={s} aria-label={`size ${s}`} size={s} defaultValue="a">
          <SegmentedControl.Item value="a">One</SegmentedControl.Item>
          <SegmentedControl.Item value="b">Two</SegmentedControl.Item>
        </SegmentedControl.Root>
      ))}
    </div>
  ),
};

export const ManyItems: Story = {
  args: { 'aria-label': 'Filters' },
  render: () => (
    <div style={{ maxWidth: '390px' }}>
      <SegmentedControl.Root aria-label="Filters" defaultValue="1">
        {['1', '2', '3', '4', '5', '6'].map((v, i) => (
          <SegmentedControl.Item key={v} value={v} title={`Filter ${i + 1}`}>
            {`Filter ${i + 1}`}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
    </div>
  ),
};
