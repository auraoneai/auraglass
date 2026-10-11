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

describe('NowPlayingBar Root (REQ-SURF-139 remainder)', () => {
  it('default render without expandedId does not throw and renders no Expand', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    let container!: HTMLElement;
    expect(() => { ({ container } = render(<NowPlayingBar.Root playing={false} />)); }).not.toThrow();
    expect(err).not.toHaveBeenCalled();
    err.mockRestore();
    const root = container.querySelector('[data-ag-part="now-playing"]')!;
    expect(root).not.toBeNull();
    expect(root.querySelector('[data-ag-part="now-playing-expand"]')).toBeNull();
    expect(root.querySelector('[data-ag-part="now-playing-play"]')).not.toBeNull();
    expect(root.querySelector('[role="progressbar"]')).not.toBeNull();
  });
  it('default children render Expand when expandedId is set', () => {
    const { container } = render(<NowPlayingBar.Root playing={false} expandedId="np-sheet" expanded={false} />);
    const btn = container.querySelector('[data-ag-part="now-playing-expand"]')!;
    expect(btn).not.toBeNull();
    expect(btn.getAttribute('aria-controls')).toBe('np-sheet');
  });
  it('controlled progress 0.4 writes --_ag-media-progress = 0.4000 on the root (no inline width)', () => {
    const { container, rerender } = render(<NowPlayingBar.Root playing={false} progress={0.4} />);
    const root = container.querySelector('[data-ag-part="now-playing"]') as HTMLElement;
    expect(root.style.getPropertyValue('--_ag-media-progress')).toBe('0.4000');
    expect(container.querySelector('[role="progressbar"]')!.getAttribute('aria-valuenow')).toBe('40');
    rerender(<NowPlayingBar.Root playing={false} progress={1 / 3} />);
    expect(root.style.getPropertyValue('--_ag-media-progress')).toBe('0.3333');
    rerender(<NowPlayingBar.Root playing={false} progress={1.7} />);
    expect(root.style.getPropertyValue('--_ag-media-progress')).toBe('1.0000');
    const fill = container.querySelector('[data-ag-part="now-playing-progress-fill"]') as HTMLElement;
    expect(fill.style.width).toBe('');
    rerender(<NowPlayingBar.Root playing={false} />);
    expect(root.style.getPropertyValue('--_ag-media-progress')).toBe('');
  });
  it('media-driven progress writes the same var from the handle state', () => {
    // media length in seconds (a media time, not a motion duration)
    const state = { ...getServerSnapshot(), paused: false, currentTime: 30 };
    state.duration = 120;
    const handle = {
      state,
      toggle: () => {}, seek: () => {}, seekBy: () => {}, setVolume: () => {},
      setMuted: () => {}, setRate: () => {}, play: async () => {}, pause: () => {},
      requestPictureInPicture: () => {}, requestFullscreen: () => {},
    } as MediaHandle;
    const { container } = render(<NowPlayingBar.Root media={handle} />);
    const root = container.querySelector('[data-ag-part="now-playing"]') as HTMLElement;
    expect(root.style.getPropertyValue('--_ag-media-progress')).toBe('0.2500');
  });
  it('fixed → data-ag-now-playing-fixed; clear → data-ag-backdrop="media"; regular declares no backdrop', () => {
    const { container, rerender } = render(<NowPlayingBar.Root playing={false} fixed variant="clear" />);
    const root = container.querySelector('[data-ag-part="now-playing"]')!;
    expect(root.hasAttribute('data-ag-now-playing-fixed')).toBe(true);
    expect(root.getAttribute('data-ag-backdrop')).toBe('media');
    expect(root.getAttribute('data-ag-variant')).toBe('clear');
    rerender(<NowPlayingBar.Root playing={false} />);
    expect(root.hasAttribute('data-ag-now-playing-fixed')).toBe(false);
    expect(root.hasAttribute('data-ag-backdrop')).toBe(false);
    expect(root.getAttribute('data-ag-variant')).toBe('regular');
  });
  it('Artwork is a decorative <img alt=""> without an extra aria-hidden', () => {
    const { container } = render(
      <NowPlayingBar.Root playing={false} artwork="https://example.test/a.png"><NowPlayingBar.Artwork /></NowPlayingBar.Root>,
    );
    const img = container.querySelector('img')!;
    expect(img.getAttribute('alt')).toBe('');
    expect(img.hasAttribute('aria-hidden')).toBe(false);
    expect(img.hasAttribute('crossorigin')).toBe(false);
  });
});
