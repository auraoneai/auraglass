// MediaControls.stories.tsx — states + play (SURF-463); Responsive drives the
// REQ-SURF-135/138 e2e/APG specs (width set on [data-testid="frame"]).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { MediaControls } from './MediaControls/MediaControls';
import type { MediaTextTrack } from './mediaStore';

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
      <MediaControls.Spacer />
      <MediaControls.Volume />
      <MediaControls.Mute />
      <MediaControls.Rate />
      <MediaControls.PictureInPicture />
      <MediaControls.Fullscreen />
    </MediaControls.Root>
  ),
};

const TRACKS: MediaTextTrack[] = [
  { id: 'en', label: 'English', language: 'en', kind: 'captions', mode: 'disabled' },
  { id: 'de', label: 'Deutsch', language: 'de', kind: 'subtitles', mode: 'disabled' },
];

/** Stateful controlled row with every part; specs resize [data-testid="frame"]. */
function ResponsiveDemo() {
  const [playing, setPlaying] = React.useState(false);
  const [time, setTime] = React.useState(92);
  const [volume, setVolume] = React.useState(0.7);
  const [muted, setMuted] = React.useState(false);
  const [rate, setRate] = React.useState(1);
  const [tracks, setTracks] = React.useState(TRACKS);
  return (
    <div data-testid="frame" style={{ inlineSize: '100%' }}>
      <MediaControls.Root
        playing={playing} onPlayingChange={setPlaying}
        currentTime={time} onSeek={setTime} duration={372}
        volume={volume} onVolumeChange={setVolume}
        muted={muted} onMutedChange={setMuted}
        playbackRate={rate} onRateChange={setRate}
        textTracks={tracks}
        onCaptionsChange={(id) => setTracks((ts) => ts.map((t) => ({ ...t, mode: t.id === id ? 'showing' : 'disabled' })))}
      >
        <MediaControls.PlayButton />
        <MediaControls.Scrubber />
        <MediaControls.Time />
        <MediaControls.Volume />
        <MediaControls.Rate />
        <MediaControls.Captions />
        <MediaControls.PictureInPicture />
        <MediaControls.Fullscreen />
      </MediaControls.Root>
    </div>
  );
}
export const Responsive: Story = { render: () => <ResponsiveDemo /> };
