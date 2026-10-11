// REQ-SURF-108 (motion-aware jump) and REQ-SURF-110 (virtualized handle).
// The resolved motion preference is fixed per test; the real VirtualList runs
// against a jsdom box model (log 400px, rows 96px = the Thread estimate).
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import type { AgMessage } from '../../types';

let mockMotion: 'full' | 'calm' | 'none' = 'full';

jest.mock('../../../theme', () => {
  const actual = jest.requireActual('../../../theme') as Record<string, unknown>;
  return { ...actual, useResolvedPreferences: () => ({ motion: mockMotion, allowContinuous: false }) };
});

import { Thread } from '../Thread';
import type { ThreadHandle } from '../Thread';

const msgs = (n: number): AgMessage[] =>
  Array.from({ length: n }, (_, i) => ({ id: `m-${i}`, role: i % 2 ? 'assistant' : 'user', parts: [{ type: 'text' as const, text: `m ${i}` }] }));

const VIEW = 400;
const EST = 96;

/** Box model for the virtualizer: the role=log scroller is 400px tall, rows 96px. */
function virtualLayout() {
  jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
    if (this.getAttribute('role') === 'log') return VIEW;
    return this.dataset.index !== undefined ? EST : 0;
  });
  jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(() => 400);
}

function scrollModel(log: HTMLElement) {
  let top = 0;
  Object.defineProperty(log, 'scrollHeight', { configurable: true, get: () => 4000 });
  Object.defineProperty(log, 'clientHeight', { configurable: true, get: () => 400 });
  Object.defineProperty(log, 'scrollTop', { configurable: true, get: () => top, set: (v: number) => { top = v; } });
  const scrollTo = jest.fn((o: ScrollToOptions) => { top = (o.top ?? top) - 400; });
  (log as unknown as { scrollTo: typeof scrollTo }).scrollTo = scrollTo;
  return scrollTo;
}

beforeEach(() => {
  jest.useFakeTimers({ doNotFake: ['queueMicrotask', 'nextTick'] });
});
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Thread handle and motion', () => {
  it('REQ-SURF-110: virtualized scrollToMessage goes through VirtualList.scrollToKey (log scrolled to the row offset per block); 0 scrollIntoView', () => {
    (Element.prototype as unknown as { scrollIntoView?: () => void }).scrollIntoView ??= () => {};
    const spy = jest.spyOn(Element.prototype, 'scrollIntoView');
    virtualLayout();
    const ref = React.createRef<ThreadHandle>();
    render(<Thread ref={ref} messages={msgs(30)} virtualizeAfter={10} />);
    const log = screen.getByRole('log');
    Object.defineProperty(log, 'scrollHeight', { configurable: true, get: () => 30 * EST + 2 });
    Object.defineProperty(log, 'clientHeight', { configurable: true, get: () => VIEW });
    const scrollTo = jest.fn();
    (log as unknown as { scrollTo: typeof scrollTo }).scrollTo = scrollTo;
    act(() => { ref.current!.scrollToMessage('m-20'); });
    act(() => { ref.current!.scrollToMessage('m-21', { block: 'center' }); });
    act(() => { ref.current!.scrollToMessage('m-22', { block: 'end' }); });
    act(() => { ref.current!.scrollToMessage('m-23', { block: 'nearest' }); });
    const tops = scrollTo.mock.calls.map((c) => (c[0] as ScrollToOptions).top);
    expect(tops).toEqual([
      20 * EST,                       // start
      21 * EST - (VIEW - EST) / 2,    // center
      23 * EST - VIEW,                // end
      24 * EST - VIEW,                // nearest → auto (row below the view → end)
    ]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('REQ-SURF-110: non-virtualized scrollToMessage never goes through the virtualizer', () => {
    const ref = React.createRef<ThreadHandle>();
    render(<Thread ref={ref} messages={msgs(5)} />);
    const log = screen.getByRole('log');
    const scrollTo = jest.fn();
    (log as unknown as { scrollTo: typeof scrollTo }).scrollTo = scrollTo;
    act(() => { ref.current!.scrollToMessage('m-2'); });
    expect(scrollTo).not.toHaveBeenCalled();
    expect(document.querySelectorAll('[data-index]').length).toBe(0);
  });

  it.each([
    ['full', 'smooth'],
    ['calm', 'auto'],
    ['none', 'auto'],
  ] as const)('REQ-SURF-108: motion=%s → jump behaviour %s', async (m, behavior) => {
    mockMotion = m;
    const { rerender } = render(<Thread messages={msgs(7)} />);
    const log = screen.getByRole('log');
    const scrollTo = scrollModel(log);
    log.scrollTop = 0;
    fireEvent.scroll(log);
    rerender(<Thread messages={msgs(8)} />);
    fireEvent.click(screen.getByRole('button', { name: '1 new message' }));
    await act(async () => { jest.advanceTimersByTime(17); });
    if (behavior === 'smooth') {
      expect(scrollTo).toHaveBeenCalledWith({ top: 4000, behavior: 'smooth' });
    } else {
      expect(scrollTo).not.toHaveBeenCalled();
      expect(log.scrollTop).toBe(4000);
    }
  });

  it('REQ-SURF-108: scroll events during a smooth jump do not unpin; user input cancels the jump', async () => {
    mockMotion = 'full';
    const ref = React.createRef<ThreadHandle>();
    const { rerender } = render(<Thread ref={ref} messages={msgs(7)} />);
    const log = screen.getByRole('log');
    scrollModel(log);
    log.scrollTop = 0;
    fireEvent.scroll(log);
    rerender(<Thread ref={ref} messages={msgs(8)} />);
    fireEvent.click(screen.getByRole('button', { name: '1 new message' }));
    await act(async () => { jest.advanceTimersByTime(17); });
    log.scrollTop = 1500; // mid-animation
    fireEvent.scroll(log);
    expect(ref.current!.isPinned()).toBe(true);
    fireEvent.wheel(log);
    log.scrollTop = 1200;
    fireEvent.scroll(log);
    expect(ref.current!.isPinned()).toBe(false);
  });
});
