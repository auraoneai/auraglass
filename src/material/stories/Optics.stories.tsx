/* MAT-174 — Material/Optics: one story per §5.4 optic. */
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Surface } from '../Surface';
import { Environment } from '../Environment';
import type { StoryAgParameters } from '../../contracts/testing';

const meta = {
  title: 'Material/Optics',
  component: Surface,
  parameters: {
    ag: { subject: 'Surface', kind: 'lab' } satisfies StoryAgParameters,
  },
} satisfies Meta<typeof Surface>;
export default meta;

type Story = StoryObj<typeof meta>;

const Box = ({ children }: { children: React.ReactNode }) => (
  <Environment backdrop="media">
    <div style={{ padding: 32, display: 'flex', gap: 16, flexWrap: 'wrap' }}>{children}</div>
  </Environment>
);

export const BlurLadder: Story = {
  render: () => (
    <Box>
      {(['thin', 'regular', 'thick'] as const).map((t) => (
        <Surface key={t} layer="chrome" thickness={t} style={{ padding: 16 }}>
          {t} — 12/20/32px
        </Surface>
      ))}
    </Box>
  ),
};

export const Grain: Story = {
  render: () => (
    <Box>
      <Surface layer="chrome" style={{ padding: 16 }}>grain on (0.02–0.04)</Surface>
      <div data-ag-tier="lightweight">
        <Surface layer="chrome" style={{ padding: 16 }}>grain off (lightweight)</Surface>
      </div>
    </Box>
  ),
};

export const Rim: Story = {
  render: () => (
    <Box>
      <Surface layer="chrome" thickness="thick" style={{ padding: 16 }}>
        rim band — conic edge light from --ag-light-angle
      </Surface>
    </Box>
  ),
};

export const LightAngleSweep: Story = {
  render: () => (
    <Box>
      {[0, 120, 240, 300].map((deg) => (
        <div key={deg} style={{ ['--ag-light-angle' as never]: `${deg}deg` }}>
          <Surface layer="chrome" style={{ padding: 16 }}>light {deg}deg</Surface>
        </div>
      ))}
    </Box>
  ),
};

export const Specular: Story = {
  render: () => (
    <Box>
      {[0, 0.25, 0.5, 1].map((s) => (
        <div key={s} style={{ ['--ag-specular' as never]: s }}>
          <Surface layer="chrome" style={{ padding: 16 }}>specular {s}</Surface>
        </div>
      ))}
    </Box>
  ),
};

export const Prominent: Story = {
  render: () => (
    <Box>
      <Surface layer="chrome" style={{ padding: 16 }}>regular</Surface>
      <Surface layer="chrome" prominent style={{ padding: 16 }}>prominent (accent ≤ 0.18)</Surface>
    </Box>
  ),
};

export const Interaction: Story = {
  render: () => (
    <Box>
      <Surface layer="chrome" interactive style={{ padding: 16 }}>
        hover + press — light response only
      </Surface>
    </Box>
  ),
};

export const LayerStack: Story = {
  render: () => (
    <Box>
      <Surface layer="chrome" style={{ padding: 16, position: 'relative' }}>
        chrome
        <Surface layer="overlay" thickness="thick" style={{ padding: 16, position: 'absolute', top: 8, left: 8 }}>
          overlay — thick + heavy shadow
        </Surface>
      </Surface>
    </Box>
  ),
};
