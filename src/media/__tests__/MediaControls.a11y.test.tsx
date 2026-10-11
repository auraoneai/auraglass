import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import * as React from 'react';
import { MediaControls } from '../MediaControls/MediaControls';
import { NowPlayingBar } from '../NowPlayingBar/NowPlayingBar';
import type { MediaTextTrack } from '../mediaStore';

const track = (id: string, kind = 'captions'): MediaTextTrack => ({ id, label: id.toUpperCase(), language: id, kind, mode: 'disabled' });

describe('media a11y (REQ-SURF-138)', () => {
  it('MediaControls default layout passes axe', async () => {
    const { container } = render(
      <MediaControls.Root playing={false} onPlayingChange={() => {}} currentTime={10} duration={100} />,
    );
    expect(container.querySelector('[data-ag-seed]')).toBeNull();
    const results = await axe(container) as { violations: unknown[] };
    expect(results.violations).toEqual([]);
  });
  it('full row with every part passes axe', async () => {
    const { container } = render(
      <MediaControls.Root playing currentTime={10} duration={100} textTracks={[track('en')]}>
        <MediaControls.PlayButton /><MediaControls.Scrubber /><MediaControls.Time /><MediaControls.Volume />
        <MediaControls.Mute /><MediaControls.Rate /><MediaControls.Captions /><MediaControls.PictureInPicture />
        <MediaControls.Fullscreen />
      </MediaControls.Root>,
    );
    const results = await axe(container) as { violations: unknown[] };
    expect(results.violations).toEqual([]);
  });
  it('PlayButton: aria-label is "Play" in both states, aria-pressed = playing, CMP Icon glyph', () => {
    for (const playing of [false, true]) {
      const { container, unmount } = render(<MediaControls.Root playing={playing}><MediaControls.PlayButton /></MediaControls.Root>);
      const btn = container.querySelector('[data-ag-part="media-play"]')!;
      expect(btn.getAttribute('aria-label')).toBe('Play');
      expect(btn.getAttribute('aria-pressed')).toBe(String(playing));
      const svg = btn.querySelector('svg')!;
      expect(svg.getAttribute('aria-hidden')).toBe('true');
      expect(btn.textContent).toBe('');
      unmount();
    }
  });
  it('Mute keeps its label and reports state through aria-pressed', () => {
    for (const muted of [false, true]) {
      const { container, unmount } = render(<MediaControls.Root playing={false} muted={muted}><MediaControls.Mute /></MediaControls.Root>);
      const btn = container.querySelector('[data-ag-part="media-mute"]')!;
      expect(btn.getAttribute('aria-label')).toBe('Mute');
      expect(btn.getAttribute('aria-pressed')).toBe(String(muted));
      expect(btn.querySelector('svg')).not.toBeNull();
      unmount();
    }
  });
  const renderCaptions = (tracks: MediaTextTrack[]) => render(
    <MediaControls.Root playing={false} textTracks={tracks}><MediaControls.PlayButton /><MediaControls.Captions /></MediaControls.Root>,
  ).container;
  it('Captions, 0 tracks: renders nothing', async () => {
    const container = renderCaptions([track('ad', 'descriptions')]);
    expect(container.querySelector('[data-ag-part="media-captions"]')).toBeNull();
    expect(((await axe(container)) as { violations: unknown[] }).violations).toEqual([]);
  });
  it('Captions, 1 track: a toggle (aria-pressed), no menu', async () => {
    const container = renderCaptions([track('en')]);
    const btn = container.querySelector('[data-ag-part="media-captions"]')!;
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    expect(btn.hasAttribute('aria-haspopup')).toBe(false);
    expect(((await axe(container)) as { violations: unknown[] }).violations).toEqual([]);
  });
  it('Captions, 2 tracks: a menu trigger', async () => {
    const container = renderCaptions([track('en'), track('de', 'subtitles')]);
    const btn = container.querySelector('[data-ag-part="media-captions"]')!;
    expect(btn.getAttribute('aria-haspopup')).toBe('menu');
    expect(btn.hasAttribute('aria-pressed')).toBe(false);
    expect(((await axe(container)) as { violations: unknown[] }).violations).toEqual([]);
  });
  it('NowPlayingBar full row passes axe', async () => {
    const { container } = render(
      <NowPlayingBar.Root playing={false} onPlayingChange={() => {}} expandedId="sheet-1">
        <NowPlayingBar.Artwork src="/a.png" />
        <NowPlayingBar.Title>Track</NowPlayingBar.Title>
        <NowPlayingBar.Subtitle>Artist</NowPlayingBar.Subtitle>
        <NowPlayingBar.Actions />
        <NowPlayingBar.Progress />
        <NowPlayingBar.Expand expandedId="sheet-1" expanded={false} />
      </NowPlayingBar.Root>,
    );
    const results = await axe(container) as { violations: unknown[] };
    expect(results.violations).toHaveLength(0);
  });
});
