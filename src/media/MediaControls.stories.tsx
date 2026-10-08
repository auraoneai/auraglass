// MediaControls.stories.tsx — states + play (SURF-463).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { MediaControls } from './MediaControls/MediaControls';

const meta = {
  title: 'Media/MediaControls',
  parameters: { ag: { subject: 'MediaControls', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Paused: Story = { render: () => <MediaControls.Root playing={false} duration={125} currentTime={12} /> };
export const Playing: Story = { render: () => <MediaControls.Root playing duration={125} currentTime={64} /> };
export const Waiting: Story = { render: () => <MediaControls.Root playing duration={NaN} /> };
export const Compact: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <MediaControls.Root playing={false} duration={95} currentTime={10}>
        <MediaControls.PlayButton />
        <MediaControls.Scrubber />
        <MediaControls.Time showDuration={false} />
      </MediaControls.Root>
    </div>
  ),
};
export const Full: Story = {
  render: () => (
    <MediaControls.Root playing={false} duration={372} currentTime={120} volume={0.7}>
      <MediaControls.PlayButton />
      <MediaControls.Scrubber />
      <MediaControls.Time />
      <MediaControls.Volume />
      <MediaControls.Mute />
      <MediaControls.Rate />
      <MediaControls.PictureInPicture />
      <MediaControls.Fullscreen />
    </MediaControls.Root>
  ),
};
