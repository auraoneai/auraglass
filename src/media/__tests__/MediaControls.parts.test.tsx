import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import { MediaControls } from '../MediaControls/MediaControls';

describe('MediaControls parts (REQ-SURF-134/135)', () => {
  it('Root is a toolbar with aria-label and data-state', () => {
    const { container } = render(<MediaControls.Root playing={false} onPlayingChange={() => {}} />);
    const root = container.querySelector('[role="toolbar"]')!;
    expect(root.getAttribute('aria-label')).toBe('Media controls');
    expect(root.getAttribute('data-ag-part')).toBe('media-controls');
    expect(root.getAttribute('data-state')).toBe('paused');
  });
  it('every part renders its data-ag-part marker', () => {
    const { container } = render(
      <MediaControls.Root playing={false} onPlayingChange={() => {}}>
        <MediaControls.PlayButton />
        <MediaControls.Scrubber />
        <MediaControls.Time />
        <MediaControls.Volume />
        <MediaControls.Mute />
        <MediaControls.Rate />
        <MediaControls.Captions />
        <MediaControls.PictureInPicture />
        <MediaControls.Fullscreen />
        <MediaControls.Spacer />
      </MediaControls.Root>,
    );
    for (const part of ['media-play', 'media-scrubber', 'media-time', 'media-volume', 'media-mute',
      'media-rate', 'media-pip', 'media-fullscreen', 'media-spacer']) {
      expect(container.querySelector(`[data-ag-part="${part}"]`)).toBeTruthy();
    }
    // Captions renders nothing with 0 tracks
    expect(container.querySelector('[data-ag-part="media-captions"]')).toBeNull();
  });
  it('media + playing together → dev error', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(
      <MediaControls.Root media={{} as never} playing={false} />,
    )).toThrow(/either `media` or controlled/);
    err.mockRestore();
  });
  it('default children = PlayButton, Scrubber, Time, Volume', () => {
    const { container } = render(<MediaControls.Root playing />);
    for (const part of ['media-play', 'media-scrubber', 'media-time', 'media-volume']) {
      expect(container.querySelector(`[data-ag-part="${part}"]`)).toBeTruthy();
    }
  });
});
