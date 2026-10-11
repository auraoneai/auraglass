/** @jest-environment jsdom */
// SURF-519 / REQ-SURF-175 (REQ-FIN-88, AC-FIN-88) — media registry items,
// rendered against the REAL library sources: media-video-player,
// media-audio-player, media-gallery, media-now-playing, backdrop-hero and the
// 5.1 media-transcript. Schema valid, public imports only, no network or
// transcription calls; transcript click-to-seek, aria-current tracking,
// TextTrack input and the motion/hover-gated scroll-into-view.
//
// Resolution: items import the public specifiers. The root jest.config.js
// maps none of them yet (REQ-FIN-09 / contract C-4, FIN-A); until it does,
// each specifier is aliased here to its src/contracts/entries.ts source via
// jest.requireActual — the real module, the same mapping the root mapper makes.
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import * as fs from 'node:fs';
import * as path from 'node:path';

jest.mock('aura-glass', () => jest.requireActual('../../../src/index'), { virtual: true });
jest.mock('aura-glass/media', () => jest.requireActual('../../../src/media/index'), { virtual: true });
jest.mock('aura-glass/backdrops', () => jest.requireActual('../../../src/backdrops/index'), { virtual: true });
jest.mock('aura-glass/theme', () => jest.requireActual('../../../src/theme/public'), { virtual: true });

import { MediaVideoPlayer } from '../../../registry/items/media-video-player/index';
import { MediaAudioPlayer } from '../../../registry/items/media-audio-player/index';
import { MediaGallery } from '../../../registry/items/media-gallery/index';
import { MediaNowPlaying } from '../../../registry/items/media-now-playing/index';
import { BackdropHero } from '../../../registry/items/backdrop-hero/index';
import { MediaTranscript, cuesFromTrack, type TranscriptCue } from '../../../registry/items/media-transcript/index';
import { TRANSCRIPT_CUES } from '../../../registry/items/media-transcript/fixtures';
import { AuraGlassProvider } from '../../../src/theme/public';
import type { MediaHandle } from '../../../src/media/index';

const ITEMS = ['media-video-player', 'media-audio-player', 'media-gallery', 'media-now-playing', 'backdrop-hero', 'media-transcript'];

type Motion = 'full' | 'calm' | 'none';
const withMotion = (motion: Motion) => ({ children }: { children: React.ReactNode }) =>
  <AuraGlassProvider storage={null} motion={motion}>{children}</AuraGlassProvider>;

/** A MediaHandle stand-in for the transcript's two touch points (state.currentTime, seek). */
const handleAt = (currentTime: number, seek = jest.fn()) =>
  ({ seek, state: { currentTime } } as unknown as MediaHandle);

let scrollSpy: jest.Mock;
beforeEach(() => {
  scrollSpy = jest.fn();
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, writable: true, value: scrollSpy });
});
afterEach(() => {
  cleanup();
  delete (HTMLElement.prototype as { scrollIntoView?: unknown }).scrollIntoView;
});

describe('media registry items (SURF-519)', () => {
  it('every item has a schema-valid registry-item.json', () => {
    for (const item of ITEMS) {
      const p = path.join('registry/items', item, 'registry-item.json');
      expect(fs.existsSync(p)).toBe(true);
      const j = JSON.parse(fs.readFileSync(p, 'utf8')) as Record<string, unknown>;
      expect(j['name']).toBe(item);
      expect((j['dependencies'] as string[])).toContain('aura-glass');
      expect((j['registryDependencies'] as string[])).toContain('auraglass');
    }
  });
  it('items import only the public aura-glass specifiers', () => {
    for (const item of ITEMS) {
      const src = fs.readFileSync(path.join('registry/items', item, 'index.tsx'), 'utf8');
      for (const m of src.matchAll(/from '([^']+)'/g)) {
        const spec = m[1]!;
        if (spec.startsWith('.') || spec === 'react') continue;
        expect(spec.startsWith('aura-glass')).toBe(true);
        expect(spec).not.toMatch(/aura-glass\/(components|foundation|compat|three)/);
      }
    }
  });
  it('items make no network or transcription calls', () => {
    for (const item of ITEMS) {
      const src = fs.readFileSync(path.join('registry/items', item, 'index.tsx'), 'utf8');
      expect(src).not.toMatch(/fetch\(|XMLHttpRequest|navigator\.mediaDevices|SpeechRecognition|WebSocket/);
    }
  });
  it('media-audio-player renders a captions track element', () => {
    const html = renderToString(<MediaAudioPlayer src="/podcast.mp3" captions={[{ src: '/podcast.vtt', srclang: 'en', label: 'English' }] as never} aria-label="Episode 12" />);
    expect(html).toContain('kind="captions"');
    expect(html).toContain('<audio');
  });
  it('media-video-player renders video + a captions track', () => {
    const html = renderToString(<MediaVideoPlayer src="/film.mp4" poster="/film.jpg" captions={[{ src: '/film.vtt', srclang: 'en', label: 'English' }] as never} />);
    expect(html).toContain('<video');
    expect(html).toContain('kind="captions"');
  });
  it('media-now-playing renders artwork + title + progress', () => {
    const html = renderToString(<MediaNowPlaying src="/track.mp3" title="Refraction" subtitle="AuraOne Sounds" artworkSrc="/art.jpg" />);
    expect(html).toContain('Refraction');
    expect(html).toContain('AuraOne Sounds');
  });
  it('backdrop-hero renders server-side (no use client)', () => {
    const src = fs.readFileSync('registry/items/backdrop-hero/index.tsx', 'utf8');
    expect(src).not.toMatch(/^'use client'/m);
    const html = renderToString(<BackdropHero preset={'aurora' as never} title="Glass everywhere" lede="Ship the material" />);
    expect(html).toContain('Glass everywhere');
  });
});

describe('media-gallery (REQ-SURF-175)', () => {
  it('lays the thumbnails out in the CMP Grid', () => {
    const { container } = render(<MediaGallery items={[{ id: 'a', src: '/a.jpg', alt: 'Alpha' }, { id: 'b', src: '/b.jpg', alt: 'Beta' }]} />,
      { wrapper: withMotion('full') });
    const grid = container.querySelector('[data-ag-part="media-gallery"] > .ag-grid');
    expect(grid).not.toBeNull();
    expect(grid!.querySelectorAll('img')).toHaveLength(2);
    expect(screen.getByAltText('Alpha')).toBeTruthy();
    expect(screen.getByAltText('Beta')).toBeTruthy();
  });
});

describe('media-transcript (REQ-SURF-175)', () => {
  const cueButton = (text: string) => screen.getByRole('button', { name: new RegExp(text) });
  const current = () => document.querySelector('[data-ag-part="media-transcript"] li[aria-current="true"]');

  it('clicking a cue seeks the media to the cue start', () => {
    const seek = jest.fn();
    render(<MediaTranscript cues={TRANSCRIPT_CUES} media={handleAt(0, seek)} />, { wrapper: withMotion('full') });
    fireEvent.click(cueButton('Great to be here'));
    expect(seek).toHaveBeenCalledTimes(1);
    expect(seek).toHaveBeenCalledWith(TRANSCRIPT_CUES[1]!.start);
  });

  it('aria-current moves to the cue under the new currentTime on rerender', () => {
    const { rerender } = render(<MediaTranscript cues={TRANSCRIPT_CUES} media={handleAt(1)} />, { wrapper: withMotion('full') });
    expect(current()?.textContent).toContain('Welcome back');
    rerender(<MediaTranscript cues={TRANSCRIPT_CUES} media={handleAt(6)} />);
    expect(current()?.textContent).toContain('Today: glass.');
    expect(document.querySelectorAll('li[aria-current="true"]')).toHaveLength(1);
  });

  it('`end` is exclusive: at a boundary only the next cue is current', () => {
    render(<MediaTranscript cues={TRANSCRIPT_CUES} media={handleAt(2)} />, { wrapper: withMotion('full') });
    expect(current()?.textContent).toContain('Great to be here');
  });

  it('at motion full the newly active cue is scrolled into view once (block: nearest)', () => {
    const { rerender } = render(<MediaTranscript cues={TRANSCRIPT_CUES} media={handleAt(1)} />, { wrapper: withMotion('full') });
    expect(scrollSpy).toHaveBeenCalledTimes(0); // mount never scrolls the page
    rerender(<MediaTranscript cues={TRANSCRIPT_CUES} media={handleAt(3)} />);
    expect(scrollSpy).toHaveBeenCalledTimes(1);
    expect(scrollSpy).toHaveBeenCalledWith({ block: 'nearest' });
    expect(scrollSpy.mock.instances[0]).toBe(current());
  });

  it('never scrolls while the pointer is over the list', () => {
    const { rerender } = render(<MediaTranscript cues={TRANSCRIPT_CUES} media={handleAt(1)} />, { wrapper: withMotion('full') });
    fireEvent.pointerEnter(screen.getByRole('list', { name: 'Transcript' }));
    rerender(<MediaTranscript cues={TRANSCRIPT_CUES} media={handleAt(3)} />);
    rerender(<MediaTranscript cues={TRANSCRIPT_CUES} media={handleAt(6)} />);
    expect(scrollSpy).toHaveBeenCalledTimes(0);
  });

  it('never scrolls while focus is inside the list', () => {
    const { rerender } = render(<MediaTranscript cues={TRANSCRIPT_CUES} media={handleAt(1)} />, { wrapper: withMotion('full') });
    act(() => { cueButton('Welcome back').focus(); });
    rerender(<MediaTranscript cues={TRANSCRIPT_CUES} media={handleAt(3)} />);
    expect(scrollSpy).toHaveBeenCalledTimes(0);
  });

  it.each<Motion>(['calm', 'none'])('never scrolls at motion %s', (motion) => {
    const { rerender } = render(<MediaTranscript cues={TRANSCRIPT_CUES} media={handleAt(1)} />, { wrapper: withMotion(motion) });
    rerender(<MediaTranscript cues={TRANSCRIPT_CUES} media={handleAt(3)} />);
    expect(current()?.textContent).toContain('Great to be here');
    expect(scrollSpy).toHaveBeenCalledTimes(0);
  });

  it('accepts a TextTrack: its TextTrackCueList is mapped to {start,end,text}', () => {
    const vttCues = [
      { startTime: 0, endTime: 1.5, text: 'First line' },
      { startTime: 1.5, endTime: 4, text: 'Second line' },
    ];
    const cueList = Object.assign([...vttCues], { getCueById: () => null });
    const listeners = new Set<() => void>();
    const track = {
      kind: 'captions', mode: 'hidden', cues: cueList,
      addEventListener: (_t: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_t: string, fn: () => void) => listeners.delete(fn),
    } as unknown as TextTrack;
    const mapped: TranscriptCue[] = cuesFromTrack(track);
    expect(mapped).toEqual([{ start: 0, end: 1.5, text: 'First line' }, { start: 1.5, end: 4, text: 'Second line' }]);
    const seek = jest.fn();
    render(<MediaTranscript cues={track} media={handleAt(2, seek)} />, { wrapper: withMotion('full') });
    expect(current()?.textContent).toContain('Second line');
    fireEvent.click(cueButton('First line'));
    expect(seek).toHaveBeenCalledWith(0);
    // A cuechange re-reads the live list.
    expect(listeners.size).toBe(1);
    cueList.push({ startTime: 4, endTime: 6, text: 'Third line' });
    act(() => { for (const fn of listeners) fn(); });
    expect(screen.getByRole('button', { name: /Third line/ })).toBeTruthy();
  });

  it('without a MediaHandle the list is static (no current cue, cues disabled)', () => {
    render(<MediaTranscript cues={TRANSCRIPT_CUES} />, { wrapper: withMotion('full') });
    expect(current()).toBeNull();
    expect((cueButton('Welcome back') as HTMLButtonElement).disabled).toBe(true);
  });
});
