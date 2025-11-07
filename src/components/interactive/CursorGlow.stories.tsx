import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CursorGlow } from './CursorGlow';
import { createGlassStyle } from '../../core/mixins/glassMixins';

const meta: Meta<typeof CursorGlow> = {
  title: 'Components/Interactive/CursorGlow',
  component: CursorGlow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Pointer-following glow overlay. Pointer-events: none. Respects reduced motion.',
      },
    },
  },
  argTypes: {
    size: { control: { type: 'range', min: 120, max: 600, step: 10 } },
    intensity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.02 } },
    color: { control: 'color', type: 'string', table: { type: { summary: 'string' } } },
  },
  args: {
    size: 320,
    intensity: 0.6,
    opacity: 0.18,
    color: 'var(--glass-white)',
  },
};

export default meta;
type Story = StoryObj<typeof CursorGlow>;

export const Default: Story = {
  render: (args) => (
    <div style={{ position: 'relative', minHeight: '70vh', background: 'linear-gradient(120deg,#0f172a,#1e293b)', overflow: 'hidden' }}>
      <CursorGlow {...args} />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
          <h3 style={{ margin: 0, fontWeight: 600 }}>Cursor Glow</h3>
          <p style={{ opacity: 0.75 }}>Move your cursor around to see the glow.</p>
        </div>
      </div>
    </div>
  ),
};
