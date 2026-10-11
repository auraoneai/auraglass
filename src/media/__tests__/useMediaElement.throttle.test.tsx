import { describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import { useMediaElement } from '../useMediaElement';

describe('useMediaElement throttling (REQ-SURF-131)', () => {
  it('60 timeupdate in 1 s → ≤4 renders; seeked publishes immediately', () => {
    jest.useFakeTimers();
    try {
      let renders = 0;
      function H() {
        const ref = React.useRef<HTMLVideoElement>(null);
        useMediaElement(ref); // snapshotHz default 4
        renders++;
        return <video ref={ref} />;
      }
      const { container } = render(<H />);
      const video = container.querySelector('video')!;
      renders = 0;
      for (let i = 0; i < 60; i++) {
        act(() => { video.dispatchEvent(new Event('timeupdate')); });
        jest.advanceTimersByTime(16);
      }
      expect(renders).toBeLessThanOrEqual(4);
      const before = renders;
      act(() => { video.dispatchEvent(new Event('seeked')); });
      expect(renders).toBeGreaterThan(before); // immediate publish
    } finally { jest.useRealTimers(); }
  });
  it('snapshotHz clamps 0→1 and 99→15', () => {
    jest.useFakeTimers();
    try {
      let renders = 0;
      function H({ hz }: { hz: number }) {
        const ref = React.useRef<HTMLVideoElement>(null);
        useMediaElement(ref, { snapshotHz: hz });
        renders++;
        return <video ref={ref} />;
      }
      const { container, rerender } = render(<H hz={0} />);
      const video = container.querySelector('video')!;
      renders = 0;
      for (let i = 0; i < 30; i++) {
        act(() => { video.dispatchEvent(new Event('timeupdate')); });
        jest.advanceTimersByTime(33);
      }
      expect(renders).toBeLessThanOrEqual(2); // ~1/s
      rerender(<H hz={99} />);
      renders = 0;
      for (let i = 0; i < 30; i++) {
        act(() => { video.dispatchEvent(new Event('timeupdate')); });
        jest.advanceTimersByTime(33);
      }
      expect(renders).toBeLessThanOrEqual(16); // clamped at 15/s max
    } finally { jest.useRealTimers(); }
  });
});
