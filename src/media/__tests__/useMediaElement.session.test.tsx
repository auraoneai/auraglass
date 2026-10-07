import { describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import { useMediaElement } from '../useMediaElement';

describe('useMediaElement Media Session (REQ-SURF-132)', () => {
  it('sets metadata + 5 handlers when stubbed; clears on unmount', () => {
    const handlers = new Map<string, unknown>();
    const bag: { meta: unknown } = { meta: undefined };
    const ms = {
      set metadata(v: unknown) { bag.meta = v; },
      get metadata() { return bag.meta; },
      setActionHandler(a: string, h: unknown) { handlers.set(a, h); },
    };
    const nav: { mediaSession?: MediaSession | undefined } = navigator as never;
    const had = 'mediaSession' in nav;
    nav.mediaSession = ms as unknown as MediaSession;
    (globalThis as { MediaMetadata?: unknown }).MediaMetadata = class { constructor(public init: unknown) {} };
    function H() {
      const ref = React.useRef<HTMLVideoElement>(null);
      useMediaElement(ref, { mediaSession: { title: 'Track', artist: 'Aura' } });
      return <video ref={ref} />;
    }
    try {
      const { unmount } = render(<H />);
      expect((bag.meta as { init?: { title?: string } }).init?.title ?? (bag.meta as { title?: string })?.title).toBe('Track');
      for (const a of ['play', 'pause', 'seekbackward', 'seekforward', 'seekto']) {
        expect(typeof handlers.get(a)).toBe('function');
      }
      act(() => { (handlers.get('seekbackward') as () => void)(); });
      unmount();
      for (const a of ['play', 'pause', 'seekbackward', 'seekforward', 'seekto']) {
        expect(handlers.get(a)).toBeNull();
      }
    } finally {
      if (!had) nav.mediaSession = undefined;
    }
  });
  it('mediaSession: false touches nothing', () => {
    const nav: { mediaSession?: MediaSession | undefined } = navigator as never;
    const spy = { setActionHandler: jest.fn(), metadata: null };
    nav.mediaSession = spy as unknown as MediaSession;
    (globalThis as { MediaMetadata?: unknown }).MediaMetadata = class {};
    function H() {
      const ref = React.useRef<HTMLVideoElement>(null);
      useMediaElement(ref);
      return <video ref={ref} />;
    }
    render(<H />);
    expect(spy.setActionHandler).not.toHaveBeenCalled();
    nav.mediaSession = undefined;
  });
});
