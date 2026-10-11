import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { MediaControls } from '../MediaControls/MediaControls';
import { useMediaElement } from '../useMediaElement';

beforeAll(() => {
  (window as { PointerEvent?: unknown }).PointerEvent = window.MouseEvent;
});
afterEach(() => { jest.restoreAllMocks(); });

/* jsdom has no TextTrack/TextTrackList. The stub list is an EventTarget that
 * dispatches 'change' when a track's mode is set, as browsers do. */
interface StubTrack { id: string; kind: string; label: string; language: string; mode: TextTrackMode }
function stubTextTracks(el: HTMLMediaElement, defs: Omit<StubTrack, 'mode'>[]): StubTrack[] {
  const list = new EventTarget() as EventTarget & Record<number, StubTrack> & { length: number };
  const tracks = defs.map((d) => {
    let mode: TextTrackMode = 'disabled';
    const t = { ...d } as StubTrack;
    Object.defineProperty(t, 'mode', {
      get: () => mode,
      set: (m: TextTrackMode) => { mode = m; list.dispatchEvent(new Event('change')); },
      enumerable: true,
    });
    return t;
  });
  tracks.forEach((t, i) => { list[i] = t; });
  list.length = tracks.length;
  Object.defineProperty(el, 'textTracks', { configurable: true, get: () => list });
  return tracks;
}

/** media length in seconds (a media time, not a motion duration) */
const CLIP_SECONDS = 60;
const EN = { id: 'en', kind: 'captions', label: 'English', language: 'en' };
const DE = { id: 'de', kind: 'subtitles', label: 'Deutsch', language: 'de' };
const DESC = { id: 'ad', kind: 'descriptions', label: 'Audio description', language: 'en' };

/** Real useMediaElement over a <video> whose textTracks is the stub. */
function Player({ defs, onTracks }: { defs: Omit<StubTrack, 'mode'>[]; onTracks: (t: StubTrack[]) => void }) {
  const ref = React.useRef<HTMLVideoElement | null>(null);
  const [, force] = React.useReducer((n: number) => n + 1, 0);
  const media = useMediaElement(ref);
  const setRef = React.useCallback((el: HTMLVideoElement | null) => {
    if (el && ref.current !== el) {
      onTracks(stubTextTracks(el, defs));
      ref.current = el;
      force();
    }
  }, [defs, onTracks]);
  return (
    <div data-ag-media-root>
      <video ref={setRef} />
      <MediaControls.Root media={media}>
        <MediaControls.PlayButton />
        <MediaControls.Captions />
      </MediaControls.Root>
    </div>
  );
}

/** A media handle whose state re-snapshots the stub tracks on every mode change. */
function Harness({ defs, onTracks }: { defs: Omit<StubTrack, 'mode'>[]; onTracks: (t: StubTrack[]) => void }) {
  const [tracks] = React.useState(() => {
    const el = document.createElement('video');
    const t = stubTextTracks(el, defs);
    onTracks(t);
    return t;
  });
  const [, bump] = React.useReducer((n: number) => n + 1, 0);
  const snap = tracks.map((t) => ({ id: t.id, label: t.label, language: t.language, kind: t.kind, mode: t.mode }));
  const media = {
    state: { paused: true, ended: false, waiting: false, seeking: false, ready: true, currentTime: 0, duration: CLIP_SECONDS,
      buffered: [], volume: 1, muted: false, playbackRate: 1, pictureInPicture: false, textTracks: snap, error: null, tone: undefined },
    play: async () => {}, pause: () => {}, toggle: () => {}, seek: () => {}, seekBy: () => {}, setVolume: () => {},
    setMuted: () => {}, setRate: () => {}, requestPictureInPicture: () => {}, requestFullscreen: () => {},
    setTextTrackMode: (id: string, mode: TextTrackMode) => {
      const t = tracks.find((x) => x.id === id);
      if (t) { t.mode = mode; bump(); }
    },
  };
  return (
    <MediaControls.Root media={media}>
      <MediaControls.PlayButton />
      <MediaControls.Captions />
    </MediaControls.Root>
  );
}

const captionsButton = () => document.querySelector('[data-ag-part="media-captions"]') as HTMLElement | null;

describe('MediaControls Captions (REQ-SURF-134/138, jsdom TextTrack stub)', () => {
  it('0 captions|subtitles tracks → no Captions part', () => {
    let tracks: StubTrack[] = [];
    render(<Harness defs={[DESC]} onTracks={(t) => { tracks = t; }} />);
    expect(tracks).toHaveLength(1);
    expect(captionsButton()).toBeNull();
  });
  it('1 track: click Captions → track.mode "showing", second click → "disabled"', () => {
    let tracks: StubTrack[] = [];
    render(<Harness defs={[EN, DESC]} onTracks={(t) => { tracks = t; }} />);
    const btn = captionsButton()!;
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    expect(btn.getAttribute('aria-label')).toBe('Captions');
    fireEvent.click(btn);
    expect(tracks[0]!.mode).toBe('showing');
    expect(captionsButton()!.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(captionsButton()!);
    expect(tracks[0]!.mode).toBe('disabled');
    expect(tracks[1]!.mode).toBe('disabled'); // descriptions track untouched
  });
  it('the C shortcut does the same', () => {
    let tracks: StubTrack[] = [];
    render(<Harness defs={[EN]} onTracks={(t) => { tracks = t; }} />);
    const play = document.querySelector('[data-ag-part="media-play"]') as HTMLElement;
    act(() => { play.focus(); });
    fireEvent.keyDown(play, { key: 'c' });
    expect(tracks[0]!.mode).toBe('showing');
    fireEvent.keyDown(play, { key: 'C' });
    expect(tracks[0]!.mode).toBe('disabled');
  });
  it('2 tracks → a CMP Menu trigger listing Off + both tracks; choosing one shows only it', async () => {
    let tracks: StubTrack[] = [];
    render(<Harness defs={[EN, DE]} onTracks={(t) => { tracks = t; }} />);
    const trigger = captionsButton()!;
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.hasAttribute('aria-pressed')).toBe(false);
    fireEvent.click(trigger);
    await act(async () => {});
    const items = [...document.querySelectorAll('[role="menuitemradio"]')];
    expect(items.map((i) => i.textContent)).toEqual(['Off', 'English', 'Deutsch']);
    expect(items[0]!.getAttribute('aria-checked')).toBe('true');
    fireEvent.click(items[2]!);
    expect(tracks.map((t) => t.mode)).toEqual(['disabled', 'showing']);
    // C now toggles the chosen track off, then back on
    const play = document.querySelector('[data-ag-part="media-play"]') as HTMLElement;
    act(() => { play.focus(); });
    fireEvent.keyDown(play, { key: 'c' });
    expect(tracks.map((t) => t.mode)).toEqual(['disabled', 'disabled']);
    fireEvent.keyDown(play, { key: 'c' });
    expect(tracks.map((t) => t.mode)).toEqual(['disabled', 'showing']);
  });
  it('controlled: onCaptionsChange(id) / (null)', () => {
    const onCaptions = jest.fn();
    const { rerender } = render(
      <MediaControls.Root playing={false} onCaptionsChange={onCaptions}
        textTracks={[{ id: 'en', label: 'English', language: 'en', kind: 'captions', mode: 'disabled' }]}>
        <MediaControls.Captions />
      </MediaControls.Root>,
    );
    fireEvent.click(captionsButton()!);
    expect(onCaptions).toHaveBeenLastCalledWith('en');
    rerender(
      <MediaControls.Root playing={false} onCaptionsChange={onCaptions}
        textTracks={[{ id: 'en', label: 'English', language: 'en', kind: 'captions', mode: 'showing' }]}>
        <MediaControls.Captions />
      </MediaControls.Root>,
    );
    fireEvent.click(captionsButton()!);
    expect(onCaptions).toHaveBeenLastCalledWith(null);
  });
  it('with the real useMediaElement handle: setTextTrackMode flips the element track', () => {
    let tracks: StubTrack[] = [];
    render(<Player defs={[EN]} onTracks={(t) => { tracks = t; }} />);
    // the store snapshots textTracks when it is created for the element
    expect(captionsButton()).not.toBeNull();
    fireEvent.click(captionsButton()!);
    expect(tracks[0]!.mode).toBe('showing');
  });
});
