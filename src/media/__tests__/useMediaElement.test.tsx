import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import { useMediaElement, type MediaHandle, type MediaState, type UseMediaElementOptions } from '../useMediaElement';
import { MEDIA_EVENTS, TEXT_TRACK_EVENTS } from '../mediaStore';

/* jsdom's HTMLMediaElement has no real TextTrackList; this one is an
 * EventTarget with indexed tracks, installed on the prototype before mount so
 * the store sees it when it registers its listeners. */
class FakeTextTrackList extends EventTarget {
  [index: number]: Partial<TextTrack> & { id: string };
  length = 0;
  push(t: Partial<TextTrack> & { id: string }) { this[this.length] = t; this.length++; }
  remove() { this.length--; delete this[this.length]; }
}
const trackLists = new WeakMap<HTMLMediaElement, FakeTextTrackList>();
const listOf = (el: HTMLMediaElement) => trackLists.get(el)!;
let ttDescriptor: PropertyDescriptor | undefined;

/* The store publishes timeupdate-class events at ≤snapshotHz (REQ-SURF-131).
 * Each dispatch here advances the clock 1 s so every event publishes — the
 * throttle itself is covered in useMediaElement.throttle.test.tsx. */
let clock = 1_000_000;
let nowSpy: { mockRestore(): void } | null = null;

beforeEach(() => {
  ttDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'textTracks');
  Object.defineProperty(HTMLMediaElement.prototype, 'textTracks', {
    configurable: true,
    get(this: HTMLMediaElement) {
      let l = trackLists.get(this);
      if (!l) { l = new FakeTextTrackList(); trackLists.set(this, l); }
      return l;
    },
  });
  nowSpy = jest.spyOn(Date, 'now').mockImplementation(() => clock);
});
afterEach(() => {
  if (ttDescriptor) Object.defineProperty(HTMLMediaElement.prototype, 'textTracks', ttDescriptor);
  else delete (HTMLMediaElement.prototype as { textTracks?: unknown }).textTracks;
  nowSpy?.mockRestore();
  delete (document as { pictureInPictureElement?: unknown }).pictureInPictureElement;
});

function Harness({ onHandle, options }: { onHandle: (h: MediaHandle) => void; options?: UseMediaElementOptions | undefined }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const h = useMediaElement(ref, options);
  onHandle(h);
  return <div data-ag-media-root=""><video ref={ref} /></div>;
}

function setup(options?: UseMediaElementOptions) {
  let latest: MediaHandle | null = null;
  const utils = render(<Harness options={options} onHandle={(h) => { latest = h; }} />);
  const video = utils.container.querySelector('video')!;
  return { getHandle: () => latest!, video, ...utils };
}

const set = (target: object, prop: string, value: unknown) =>
  Object.defineProperty(target, prop, { value, configurable: true, writable: true });

function fire(target: EventTarget, type: string) {
  clock += 1000;
  act(() => { target.dispatchEvent(new Event(type)); });
}

interface EventCase {
  /** optional arrange step: puts the field into the opposite, non-default value */
  before?: (v: HTMLVideoElement) => void;
  /** element/document properties set to non-default values before dispatch */
  arrange: (v: HTMLVideoElement) => void;
  field: keyof MediaState;
  expected: unknown;
  target?: (v: HTMLVideoElement) => EventTarget;
}

const playing = (v: HTMLVideoElement) => { set(v, 'paused', false); fire(v, 'play'); };
const stalled = (v: HTMLVideoElement) => { fire(v, 'waiting'); };

/* One case per wired event (PRD-SURF §4.6). The matrix is checked against the
 * store's own MEDIA_EVENTS / TEXT_TRACK_EVENTS so a newly wired event without
 * a case fails here. */
const MEDIA_CASES: Record<(typeof MEDIA_EVENTS)[number], EventCase> = {
  play: { arrange: (v) => set(v, 'paused', false), field: 'paused', expected: false },
  playing: { before: (v) => { playing(v); stalled(v); }, arrange: () => {}, field: 'waiting', expected: false },
  pause: { before: playing, arrange: (v) => set(v, 'paused', true), field: 'paused', expected: true },
  ended: { arrange: (v) => set(v, 'ended', true), field: 'ended', expected: true },
  waiting: { arrange: () => {}, field: 'waiting', expected: true },
  seeking: { arrange: (v) => set(v, 'seeking', true), field: 'seeking', expected: true },
  seeked: { arrange: (v) => set(v, 'currentTime', 42), field: 'currentTime', expected: 42 },
  timeupdate: { arrange: (v) => set(v, 'currentTime', 12.5), field: 'currentTime', expected: 12.5 },
  durationchange: { arrange: (v) => set(v, 'duration', 120), field: 'duration', expected: 120 },
  progress: {
    arrange: (v) => set(v, 'buffered', { length: 2, start: (i: number) => [0, 40][i], end: (i: number) => [30, 55][i] }),
    field: 'buffered', expected: [[0, 30], [40, 55]],
  },
  volumechange: { arrange: (v) => set(v, 'volume', 0.3), field: 'volume', expected: 0.3 },
  ratechange: { arrange: (v) => set(v, 'playbackRate', 2), field: 'playbackRate', expected: 2 },
  error: { arrange: (v) => set(v, 'error', { code: 3, message: 'decode' }), field: 'error', expected: { code: 3, message: 'decode' } },
  loadedmetadata: { arrange: (v) => set(v, 'duration', 61), field: 'duration', expected: 61 },
  loadeddata: { arrange: (v) => set(v, 'readyState', 2), field: 'ready', expected: true },
  canplay: { before: stalled, arrange: (v) => set(v, 'readyState', 3), field: 'waiting', expected: false },
  canplaythrough: { arrange: (v) => set(v, 'readyState', 4), field: 'ready', expected: true },
  emptied: {
    before: (v) => { set(v, 'readyState', 4); fire(v, 'canplaythrough'); },
    arrange: (v) => set(v, 'readyState', 0), field: 'ready', expected: false,
  },
  enterpictureinpicture: { arrange: (v) => set(document, 'pictureInPictureElement', v), field: 'pictureInPicture', expected: true },
  leavepictureinpicture: {
    before: (v) => { set(document, 'pictureInPictureElement', v); fire(v, 'enterpictureinpicture'); },
    arrange: () => set(document, 'pictureInPictureElement', null), field: 'pictureInPicture', expected: false,
  },
};

const track = { id: 'en', label: 'English', language: 'en', kind: 'captions' as TextTrackKind, mode: 'disabled' as TextTrackMode };
const TRACK_CASES: Record<(typeof TEXT_TRACK_EVENTS)[number], EventCase> = {
  addtrack: {
    arrange: (v) => listOf(v).push({ ...track }), target: listOf,
    field: 'textTracks', expected: [track],
  },
  removetrack: {
    before: (v) => { listOf(v).push({ ...track }); fire(listOf(v), 'addtrack'); },
    arrange: (v) => listOf(v).remove(), target: listOf, field: 'textTracks', expected: [],
  },
  change: {
    before: (v) => { listOf(v).push({ ...track }); fire(listOf(v), 'addtrack'); },
    arrange: (v) => { listOf(v)[0]!.mode = 'showing'; }, target: listOf,
    field: 'textTracks', expected: [{ ...track, mode: 'showing' }],
  },
};

describe('useMediaElement (REQ-SURF-130/18)', () => {
  it('the case matrix covers exactly the wired events', () => {
    expect(Object.keys(MEDIA_CASES).sort()).toEqual([...MEDIA_EVENTS].sort());
    expect(Object.keys(TRACK_CASES).sort()).toEqual([...TEXT_TRACK_EVENTS].sort());
    for (const ev of ['leavepictureinpicture', 'loadeddata', 'playing', 'canplaythrough']) {
      expect(MEDIA_EVENTS).toContain(ev);
    }
  });

  it.each([
    ...Object.entries(MEDIA_CASES).map(([ev, c]) => [ev, c] as const),
    ...Object.entries(TRACK_CASES).map(([ev, c]) => [ev, c] as const),
  ])('%s moves its MediaState field to the non-default value', (ev, c) => {
    const { getHandle, video } = setup();
    c.before?.(video);
    expect(getHandle().state[c.field]).not.toEqual(c.expected);
    c.arrange(video);
    fire(c.target ? c.target(video) : video, ev);
    expect(getHandle().state[c.field]).toEqual(c.expected);
  });

  it('waiting stays true across timeupdate until playing', () => {
    const { getHandle, video } = setup();
    playing(video);
    fire(video, 'waiting');
    fire(video, 'timeupdate');
    expect(getHandle().state.waiting).toBe(true);
    fire(video, 'playing');
    expect(getHandle().state.waiting).toBe(false);
  });

  it('seek/setVolume/setMuted/setRate write to the element', () => {
    const { getHandle, video } = setup();
    act(() => { getHandle().seek(12); });
    expect(video.currentTime).toBe(12);
    act(() => { getHandle().setVolume(0.5); });
    expect(video.volume).toBe(0.5);
    act(() => { getHandle().setMuted(true); });
    expect(video.muted).toBe(true);
    act(() => { getHandle().setRate(1.5); });
    expect(video.playbackRate).toBe(1.5);
  });

  it('autoplay blocked → state.error code 0 autoplay-blocked, no throw', async () => {
    const { getHandle, video } = setup();
    Object.defineProperty(video, 'play', { value: () => Promise.reject(new DOMException('no', 'NotAllowedError')) });
    await act(async () => { await getHandle().play(); });
    expect(getHandle().state.error).toEqual({ code: 0, message: 'autoplay-blocked' });
  });
});

describe('useMediaElement listener ownership (REQ-SURF-133)', () => {
  /* Records every addEventListener on media elements and TextTrackLists —
   * signalled or not — so an unsignalled registration is counted, not missed. */
  function recordRegistrations() {
    const regs: { type: string; signal: AbortSignal | undefined }[] = [];
    const spy = (proto: EventTarget) => {
      const orig = proto.addEventListener;
      return jest.spyOn(proto, 'addEventListener').mockImplementation(function (
        this: EventTarget, type: string, l: EventListenerOrEventListenerObject | null, opts?: boolean | AddEventListenerOptions,
      ) {
        if (this instanceof HTMLMediaElement || this instanceof FakeTextTrackList) {
          regs.push({ type, signal: typeof opts === 'object' ? opts.signal : undefined });
        }
        return orig.call(this, type, l, opts);
      });
    };
    const spies = [spy(HTMLMediaElement.prototype), spy(FakeTextTrackList.prototype)];
    return { regs, restore: () => { for (const s of spies) s.mockRestore(); } };
  }

  it.each<[string, UseMediaElementOptions]>([
    ['default options', {}],
    ['sampleTone: true (pending loadeddata sampler)', { sampleTone: true }],
  ])('%s: 0 unsignalled registrations; all aborted on unmount', (_label, options) => {
    /* React DOM attaches its own (unsignalled) non-delegated media listeners
     * to every <video> it renders, so the hook is bound to an element React
     * does not manage: every registration recorded below is the hook's. */
    const root = document.createElement('div');
    root.setAttribute('data-ag-media-root', '');
    const video = document.createElement('video');
    root.appendChild(video);
    document.body.appendChild(root);
    const ref = { current: video };
    function Bound() { useMediaElement(ref, options); return null; }
    const { regs, restore } = recordRegistrations();
    try {
      const { unmount } = render(<Bound />);
      const types = regs.map((r) => r.type);
      for (const ev of MEDIA_EVENTS) expect(types).toContain(ev);
      for (const ev of TEXT_TRACK_EVENTS) expect(types).toContain(ev);
      if (options.sampleTone) {
        expect(types.filter((t) => t === 'loadeddata')).toHaveLength(2); // store + sampler
      }
      expect(regs.filter((r) => !r.signal)).toEqual([]);
      const signals = new Set(regs.map((r) => r.signal));
      expect(signals.size).toBe(1); // one AbortController per element
      unmount();
      for (const s of signals) expect(s!.aborted).toBe(true);
    } finally { restore(); root.remove(); }
  });
});
