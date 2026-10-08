/* MAT-174 — Material Lab 'Clear' stories: image/video, clear over light/media
   with scrim, clear without backdrop (fallback + dev warning). */
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Surface } from '../Surface';
import { Environment } from '../Environment';
import type { StoryAgParameters } from '../../contracts/testing';

const meta = {
  title: 'Material Lab/Clear',
  component: Surface,
  parameters: {
    ag: { subject: 'Surface', kind: 'lab' } satisfies StoryAgParameters,
  },
} satisfies Meta<typeof Surface>;
export default meta;

type Story = StoryObj<typeof meta>;

export const OverLight: Story = {
  render: () => (
    <Environment backdrop="light">
      <div style={{ padding: 32 }}>
        <Surface layer="chrome" variant="clear" style={{ padding: 16 }}>
          clear over light — scrim dim 0.35 inside ::before
        </Surface>
      </div>
    </Environment>
  ),
};

export const OverMedia: Story = {
  render: () => (
    <Environment backdrop="media" image="/scenes/photo.jpg">
      <div style={{ padding: 32 }}>
        <Surface layer="chrome" variant="clear" style={{ padding: 16 }}>
          clear over media — image backdrop behind
        </Surface>
      </div>
    </Environment>
  ),
};

export const OverVideo: Story = {
  render: () => (
    <Environment backdrop="auto" video="/scenes/video-frame.mp4">
      <div style={{ padding: 32 }}>
        <Surface layer="chrome" variant="clear" style={{ padding: 16 }}>
          clear over video (auto → media)
        </Surface>
      </div>
    </Environment>
  ),
};

export const WithoutBackdrop: Story = {
  render: () => (
    <div style={{ padding: 32 }}>
      <Surface layer="chrome" variant="clear" style={{ padding: 16 }}>
        clear with no declared backdrop — identical filter + fill to regular, dev warning
      </Surface>
    </div>
  ),
};
