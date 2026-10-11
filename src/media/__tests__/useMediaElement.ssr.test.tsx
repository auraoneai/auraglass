/** @jest-environment node */
// REQ-SURF-08 — the server render of useMediaElement exposes exactly the
// pinned server snapshot: every field, compared with toEqual on the state
// object the hook returned during renderToString (no markup round-trip, so
// NaN and undefined survive).
import { describe, expect, it } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { useMediaElement, type MediaState } from '../useMediaElement';
import { getServerSnapshot } from '../mediaStore';

const EXPECTED_SERVER_STATE: MediaState = {
  paused: true,
  ended: false,
  waiting: false,
  seeking: false,
  ready: false,
  currentTime: 0,
  duration: NaN,
  buffered: [],
  volume: 1,
  muted: false,
  playbackRate: 1,
  pictureInPicture: false,
  textTracks: [],
  error: null,
  tone: undefined,
};

describe('useMediaElement SSR (REQ-SURF-08)', () => {
  it('getServerSnapshot is the exact pinned server state', () => {
    expect(getServerSnapshot()).toEqual(EXPECTED_SERVER_STATE);
    // toEqual treats an own `tone: undefined` and a missing key alike; pin the key set too.
    expect(Object.keys(getServerSnapshot()).sort()).toEqual(Object.keys(EXPECTED_SERVER_STATE).sort());
  });

  it('server render of the hook yields the full server snapshot', () => {
    const seen: MediaState[] = [];
    function Probe() {
      const ref = React.useRef<HTMLVideoElement>(null);
      const h = useMediaElement(ref);
      seen.push(h.state);
      return <video ref={ref} />;
    }
    renderToString(<Probe />);
    expect(seen).toEqual([EXPECTED_SERVER_STATE]);
    expect(Object.keys(seen[0]!).sort()).toEqual(Object.keys(EXPECTED_SERVER_STATE).sort());
    // Same object identity as the store's server snapshot (stable for useSyncExternalStore).
    expect(seen[0]).toBe(getServerSnapshot());
  });
});
