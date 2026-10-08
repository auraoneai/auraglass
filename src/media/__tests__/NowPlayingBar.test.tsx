import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import { NowPlayingBar } from '../NowPlayingBar/NowPlayingBar';
import type { MediaHandle } from '../useMediaElement';
import { getServerSnapshot } from '../mediaStore';

describe('NowPlayingBar (REQ-SURF-139)', () => {
  it('Progress is role=progressbar, 0–100 int valuenow, no inline width', () => {
    const handle = {
      state: { ...getServerSnapshot(), paused: false, currentTime: 50, duration: 100 },
      toggle: () => {}, seek: () => {}, seekBy: () => {}, setVolume: () => {},
      setMuted: () => {}, setRate: () => {}, play: async () => {}, pause: () => {},
      requestPictureInPicture: () => {}, requestFullscreen: () => {},
    } as MediaHandle;
    const { container } = render(
      <NowPlayingBar.Root media={handle}>
        <NowPlayingBar.Progress />
      </NowPlayingBar.Root>,
    );
    const pb = container.querySelector('[role="progressbar"]')!;
    expect(pb.getAttribute('aria-valuenow')).toBe('50');
    expect(pb.getAttribute('aria-valuemin')).toBe('0');
    expect(pb.getAttribute('aria-valuemax')).toBe('100');
    expect(pb.getAttribute('aria-valuetext')).toContain('50 seconds');
    expect((pb as HTMLElement).style.width).toBe('');
  });
  it('Expand carries aria-expanded + aria-controls; missing expandedId throws in dev', () => {
    const { container } = render(
      <NowPlayingBar.Root playing={false} expandedId="sheet-1">
        <NowPlayingBar.Expand expandedId="sheet-1" expanded={false} />
      </NowPlayingBar.Root>,
    );
    const btn = container.querySelector('[data-ag-part="now-playing-expand"]')!;
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.getAttribute('aria-controls')).toBe('sheet-1');
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(
      <NowPlayingBar.Root playing={false}><NowPlayingBar.Expand expanded={false} /></NowPlayingBar.Root>,
    )).toThrow(/aria-controls/);
    err.mockRestore();
  });
  it('media + playing together → dev error', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(
      <NowPlayingBar.Root media={{} as never} playing={false} />,
    )).toThrow(/either `media` or controlled/);
    err.mockRestore();
  });
  it('controlled play button fires onPlayingChange', () => {
    const onPlaying = jest.fn();
    const { container } = render(
      <NowPlayingBar.Root playing={false} onPlayingChange={onPlaying}>
        <NowPlayingBar.Actions />
      </NowPlayingBar.Root>,
    );
    fireEvent.click(container.querySelector('[data-ag-part="now-playing-play"]')!);
    expect(onPlaying).toHaveBeenCalledWith(true);
  });
});
