import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { act, render } from '@testing-library/react';

// Announcer double: every announce() call is recorded; the rest of the theme
// module (usePreference, …) is the real implementation.
const mockAnnounce = jest.fn<(message: string, opts?: { politeness?: 'polite' | 'assertive' }) => void>();
jest.mock('../../../theme', () => {
  const actual = jest.requireActual<Record<string, unknown>>('../../../theme');
  return { ...actual, useAnnouncer: () => ({ announce: mockAnnounce, clear: () => undefined }) };
});

import {
  ANNOUNCE_MAX_CHARS,
  ANNOUNCE_TRUNCATION_SUFFIX,
  StreamingText,
  type StreamingTextHandle,
} from '../StreamingText';

// Manual animation-frame clock: frames run only when the test says so, with
// an explicit timestamp, so coalescing and the 1,000 ms gate are deterministic.
let frames = new Map<number, FrameRequestCallback>();
let nextFrame = 1;
const runFrame = (now: number) => {
  const due = [...frames.values()];
  frames = new Map();
  act(() => { for (const cb of due) cb(now); });
};

beforeEach(() => {
  mockAnnounce.mockClear();
  frames = new Map();
  nextFrame = 1;
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    const id = nextFrame++;
    frames.set(id, cb);
    return id;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => { frames.delete(id); });
});
afterEach(() => { jest.restoreAllMocks(); });

const textOf = (c: HTMLElement) => c.querySelector('[data-ag-part="text"]')!.textContent;

describe('StreamingText coalescing (REQ-SURF-113)', () => {
  it('1,000 same-frame setText calls make exactly one commit', () => {
    const onRender = jest.fn();
    const handle = React.createRef<StreamingTextHandle>();
    const { container } = render(
      <React.Profiler id="st" onRender={onRender}>
        <StreamingText ref={handle} text="" streaming announce="off" />
      </React.Profiler>,
    );
    onRender.mockClear();
    act(() => {
      for (let i = 1; i <= 1000; i += 1) handle.current!.setText(`token ${i}`);
    });
    expect(onRender).toHaveBeenCalledTimes(0);
    expect(frames.size).toBe(1);
    runFrame(16);
    expect(onRender).toHaveBeenCalledTimes(1);
    expect(textOf(container)).toBe('token 1000');
  });

  it('append coalesces chunks onto the current text in one commit', () => {
    const onRender = jest.fn();
    const handle = React.createRef<StreamingTextHandle>();
    const { container } = render(
      <React.Profiler id="st" onRender={onRender}>
        <StreamingText ref={handle} text="Hello" streaming announce="off" />
      </React.Profiler>,
    );
    onRender.mockClear();
    act(() => { for (const c of [',', ' ', 'wor', 'ld']) handle.current!.append(c); });
    runFrame(16);
    expect(onRender).toHaveBeenCalledTimes(1);
    expect(textOf(container)).toBe('Hello, world');
  });

  it('a new text prop takes over from earlier handle writes', () => {
    const handle = React.createRef<StreamingTextHandle>();
    const { container, rerender } = render(<StreamingText ref={handle} text="a" streaming announce="off" />);
    act(() => handle.current!.setText('from handle'));
    runFrame(16);
    expect(textOf(container)).toBe('from handle');
    rerender(<StreamingText ref={handle} text="from prop" streaming announce="off" />);
    expect(textOf(container)).toBe('from prop');
    // A pending handle write scheduled before the prop change is dropped.
    act(() => handle.current!.setText('stale'));
    rerender(<StreamingText ref={handle} text="newer prop" streaming announce="off" />);
    runFrame(32);
    expect(textOf(container)).toBe('newer prop');
  });

  it('unmount cancels the pending frame', () => {
    const handle = React.createRef<StreamingTextHandle>();
    const { unmount } = render(<StreamingText ref={handle} text="" streaming announce="off" />);
    act(() => handle.current!.setText('x'));
    expect(frames.size).toBe(1);
    unmount();
    expect(frames.size).toBe(0);
  });
});

describe('StreamingText semantics (REQ-SURF-113)', () => {
  it('aria-busy is present only while streaming; caret is aria-hidden', () => {
    const { container, rerender } = render(<StreamingText text="abc" streaming announce="off" />);
    const root = container.querySelector('[data-ag-part="streaming-text"]')!;
    expect(root.getAttribute('aria-busy')).toBe('true');
    expect(container.querySelector('[data-ag-part="caret"]')?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('[data-ag-part="text"]')?.getAttribute('aria-live')).toBe('off');
    rerender(<StreamingText text="abc" streaming={false} announce="off" />);
    expect(root.hasAttribute('aria-busy')).toBe(false);
    expect(container.querySelector('[data-ag-part="caret"]')).toBeNull();
    rerender(<StreamingText text="abcd" streaming announce="off" />);
    expect(root.getAttribute('aria-busy')).toBe('true');
  });
});

describe('StreamingText announcements (REQ-SURF-113)', () => {
  it("'complete' announces once at the end, truncated to 600 chars plus the suffix", () => {
    const long = 'word '.repeat(300); // 1,500 chars
    const { rerender } = render(<StreamingText text="word " streaming />);
    rerender(<StreamingText text={long} streaming />);
    expect(mockAnnounce).not.toHaveBeenCalled();
    rerender(<StreamingText text={long} streaming={false} />);
    rerender(<StreamingText text={long} streaming={false} />);
    expect(mockAnnounce).toHaveBeenCalledTimes(1);
    const spoken = mockAnnounce.mock.calls[0]![0];
    expect(spoken.length).toBeLessThanOrEqual(ANNOUNCE_MAX_CHARS + ANNOUNCE_TRUNCATION_SUFFIX.length);
    expect(spoken.endsWith(ANNOUNCE_TRUNCATION_SUFFIX)).toBe(true);
    expect(spoken.startsWith('word word')).toBe(true);
    expect(mockAnnounce.mock.calls[0]![1]).toBeUndefined(); // polite (default lane)
  });

  it("'complete' does not truncate a short answer", () => {
    const { rerender } = render(<StreamingText text="Short" streaming />);
    rerender(<StreamingText text="Short answer." streaming={false} />);
    expect(mockAnnounce.mock.calls).toEqual([['Short answer.']]);
  });

  it("handle-written text is what 'complete' announces", () => {
    const handle = React.createRef<StreamingTextHandle>();
    const { rerender } = render(<StreamingText ref={handle} text="" streaming />);
    act(() => handle.current!.setText('Streamed through the handle.'));
    runFrame(16);
    rerender(<StreamingText ref={handle} text="" streaming={false} />);
    expect(mockAnnounce.mock.calls).toEqual([['Streamed through the handle.']]);
  });

  it("'sentences' batches completed sentences at least 1,000 ms apart", () => {
    const { rerender } = render(<StreamingText text="One. Tw" streaming announce="sentences" />);
    runFrame(100);
    expect(mockAnnounce.mock.calls).toEqual([['One.']]);

    rerender(<StreamingText text="One. Two. Three. Fo" streaming announce="sentences" />);
    runFrame(600);
    runFrame(1099);
    expect(mockAnnounce).toHaveBeenCalledTimes(1); // gate: < 1,000 ms since the last batch
    runFrame(1100);
    expect(mockAnnounce.mock.calls[1]).toEqual(['Two. Three.']);

    rerender(<StreamingText text="One. Two. Three. Four." streaming={false} announce="sentences" />);
    expect(mockAnnounce.mock.calls[2]).toEqual(['Four.']);
    expect(mockAnnounce).toHaveBeenCalledTimes(3);
  });

  it("'off' never announces", () => {
    const { rerender } = render(<StreamingText text="A. B. " streaming announce="off" />);
    runFrame(5000);
    rerender(<StreamingText text="A. B. C." streaming={false} announce="off" />);
    expect(mockAnnounce).not.toHaveBeenCalled();
  });
});
