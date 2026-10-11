import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import { MediaControls } from '../MediaControls/MediaControls';
import type { MediaHandle } from '../useMediaElement';
import { getServerSnapshot } from '../mediaStore';

/** media length in seconds (a media time, not a motion duration) */
const CLIP_SECONDS = 200;

describe('MediaControls controlled vs headless (REQ-SURF-134)', () => {
  it('controlled and media-driven roots emit identical DOM', () => {
    const handle = {
      state: { ...getServerSnapshot(), paused: true, currentTime: 10, duration: CLIP_SECONDS, volume: 0.5 },
      toggle: () => {}, seek: () => {}, seekBy: () => {}, setVolume: () => {},
      setMuted: () => {}, setRate: () => {}, play: async () => {}, pause: () => {},
      requestPictureInPicture: () => {}, requestFullscreen: () => {}, setTextTrackMode: () => {},
    } as MediaHandle;
    const a = render(
      <MediaControls.Root media={handle}>
        <MediaControls.PlayButton /><MediaControls.Time /><MediaControls.Mute />
      </MediaControls.Root>,
    ).container.innerHTML;
    const b = render(
      <MediaControls.Root playing={false} currentTime={10} duration={CLIP_SECONDS} volume={0.5}>
        <MediaControls.PlayButton /><MediaControls.Time /><MediaControls.Mute />
      </MediaControls.Root>,
    ).container.innerHTML;
    expect(a).toBe(b);
  });
  it('controlled PlayButton calls onPlayingChange(true)', () => {
    const onPlaying = jest.fn();
    const { container } = render(
      <MediaControls.Root playing={false} onPlayingChange={onPlaying} />,
    );
    fireEvent.click(container.querySelector('[data-ag-part="media-play"]')!);
    expect(onPlaying).toHaveBeenCalledWith(true);
  });
});
