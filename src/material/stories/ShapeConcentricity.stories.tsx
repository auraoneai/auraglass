/* MAT-174 — Material Lab 'Shape & Concentricity' stories: ConcentricFrame
   radius rhythm, capsule, ScrollEdge soft/hard. */
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Surface } from '../Surface';
import { ConcentricFrame } from '../ConcentricFrame';
import { ScrollEdge } from '../ScrollEdge';
import { Environment } from '../Environment';
import type { StoryAgParameters } from '../../contracts/testing';

const meta = {
  title: 'Material Lab/Shape & Concentricity',
  component: ConcentricFrame,
  args: { radius: 'md', inset: '2', children: null },
  parameters: {
    ag: { subject: 'ConcentricFrame', kind: 'lab' } satisfies StoryAgParameters,
  },
} satisfies Meta<typeof ConcentricFrame>;
export default meta;

type Story = StoryObj<typeof meta>;

export const RadiusRhythm: Story = {
  render: () => (
    <Environment backdrop="media">
      <div style={{ padding: 32, display: 'grid', gap: 16 }}>
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((r) => (
          <ConcentricFrame key={r} radius={r} inset="2">
            <Surface layer="chrome" shape="concentric" style={{ padding: 16 }}>
              concentric at radius {r}
            </Surface>
          </ConcentricFrame>
        ))}
      </div>
    </Environment>
  ),
};

export const Capsule: Story = {
  render: () => (
    <Environment backdrop="media">
      <div style={{ padding: 32 }}>
        <Surface layer="chrome" shape="capsule" style={{ padding: '8px 24px', display: 'inline-block' }}>
          capsule chrome
        </Surface>
      </div>
    </Environment>
  ),
};

export const ScrollEdgeSoftHard: Story = {
  render: () => (
    <Environment backdrop="media">
      <div style={{ height: 200, overflow: 'auto', padding: 16, position: 'relative' }}>
        <ScrollEdge edge="top" edgeStyle="soft" />
        {Array.from({ length: 60 }, (_, i) => <p key={i} style={{ margin: 0 }}>dense text line {i + 1}</p>)}
        <ScrollEdge edge="bottom" edgeStyle="hard" />
      </div>
    </Environment>
  ),
};
