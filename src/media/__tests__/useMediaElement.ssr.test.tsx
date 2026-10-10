/** @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { useMediaElement } from '../useMediaElement';
import { getServerSnapshot } from '../mediaStore';

function H() {
  const ref = React.useRef<HTMLVideoElement>(null);
  const h = useMediaElement(ref);
  return <div data-state={JSON.stringify(h.state)}><video ref={ref} /></div>;
}

describe('useMediaElement SSR (REQ-SURF-08)', () => {
  it('getServerSnapshot is the exact pinned server state', () => {
    expect(getServerSnapshot()).toEqual({
      paused: true, ended: false, waiting: false, seeking: false, ready: false,
      currentTime: 0, duration: NaN, buffered: [], volume: 1, muted: false,
      playbackRate: 1, pictureInPicture: false, textTracks: [], error: null,
      tone: undefined,
    });
  });
  it('server render yields the exact server snapshot', () => {
    const html = renderToString(<H />);
    const m = html.match(/data-state="([^"]+)"/);
    const state = JSON.parse((m?.[1] ?? '').replace(/&quot;/g, '"'));
    // NaN serializes to null through JSON — compare structurally.
    expect({ ...state, duration: Number.isNaN(getServerSnapshot().duration) && state.duration === null ? NaN : state.duration }).toEqual(getServerSnapshot());
  });
});
