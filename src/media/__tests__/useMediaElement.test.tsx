import { describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import { useMediaElement, type MediaHandle } from '../useMediaElement';

function Harness({ onHandle }: { onHandle: (h: MediaHandle) => void }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const h = useMediaElement(ref);
  onHandle(h);
  return <div data-ag-media-root=""><video ref={ref} /></div>;
}

function setup() {
  let latest: MediaHandle | null = null;
  const utils = render(<Harness onHandle={(h) => { latest = h; }} />);
  const video = utils.container.querySelector('video')!;
  return { getHandle: () => latest!, video, ...utils };
}

describe('useMediaElement (REQ-SURF-130/18)', () => {
  it('each wired event updates its MediaState field', () => {
    const { getHandle, video } = setup();
    act(() => { video.dispatchEvent(new Event('volumechange')); });
    expect(getHandle().state.volume).toBe(video.volume);
    act(() => { video.dispatchEvent(new Event('ended')); });
    expect(getHandle().state.ended).toBe(video.ended);
    act(() => { video.dispatchEvent(new Event('durationchange')); });
    expect(getHandle().state.duration).toBe(video.duration);
    act(() => { video.dispatchEvent(new Event('ratechange')); });
    expect(getHandle().state.playbackRate).toBe(video.playbackRate);
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
  it('listeners aborted on unmount — every registration carries an AbortSignal', () => {
    const signals: AbortSignal[] = [];
    const orig = HTMLMediaElement.prototype.addEventListener;
    jest.spyOn(HTMLMediaElement.prototype, 'addEventListener').mockImplementation(function (
      this: HTMLMediaElement, type: string, l: EventListenerOrEventListenerObject, opts?: unknown,
    ) {
      if (opts && typeof opts === 'object' && 'signal' in opts) signals.push((opts as { signal: AbortSignal }).signal);
      return orig.call(this, type, l, opts as never);
    });
    const { unmount } = setup();
    expect(signals.length).toBeGreaterThan(0);
    unmount();
    for (const s of signals) expect(s.aborted).toBe(true);
  });
});
