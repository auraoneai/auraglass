import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Thread } from '../Thread';
import type { ThreadHandle } from '../Thread';
import type { AgMessage, AgPart } from '../../types';

const msgs = (n: number, from = 0): AgMessage[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `m-${i + from}`,
    role: (i + from) % 2 ? 'assistant' : 'user',
    parts: [{ type: 'text' as const, text: `message ${i + from}` }],
  }));

const ROW = 100;
const VIEW = 400;

/**
 * jsdom has no layout. Give the log a scroll model (scrollTop backed by a
 * field, scrollHeight = rows × 100 + extra, clientHeight 400) and give every
 * article a box at its DOM index × 100 − scrollTop, relative to a log at y=0.
 */
function layout(log: HTMLElement, opts: { extra?: () => number } = {}) {
  let top = 0;
  const writes: number[] = [];
  const height = () => log.querySelectorAll('article').length * ROW + (opts.extra?.() ?? 0);
  Object.defineProperty(log, 'scrollHeight', { configurable: true, get: height });
  Object.defineProperty(log, 'clientHeight', { configurable: true, get: () => VIEW });
  Object.defineProperty(log, 'scrollTop', {
    configurable: true,
    get: () => top,
    set: (v: number) => { top = Math.max(0, Math.min(v, Math.max(0, height() - VIEW))); writes.push(top); },
  });
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const rect = (y: number, h: number) => ({ x: 0, y, top: y, bottom: y + h, left: 0, right: 400, width: 400, height: h, toJSON: () => ({}) }) as DOMRect;
    if (this === log) return rect(0, VIEW);
    if (this.tagName === 'ARTICLE' && log.contains(this)) {
      const idx = [...log.querySelectorAll('article')].indexOf(this as HTMLElement);
      return rect(idx * ROW - top, ROW);
    }
    return rect(0, 0);
  });
  return { writes, height };
}

/** Scroll the log to `to` the way a user would (assignment + scroll event). */
function userScroll(log: HTMLElement, to: number) {
  log.scrollTop = to;
  fireEvent.scroll(log);
}

const frame = async () => {
  await act(async () => { await Promise.resolve(); jest.advanceTimersByTime(17); });
};

beforeEach(() => {
  jest.useFakeTimers({ doNotFake: ['queueMicrotask', 'nextTick'] });
});
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Thread', () => {
  it('log semantics: role=log, aria-label, aria-relevant, tabIndex', () => {
    render(<Thread messages={msgs(3)} label="Support" />);
    const log = screen.getByRole('log');
    expect(log.getAttribute('aria-label')).toBe('Support');
    expect(log.getAttribute('aria-relevant')).toBe('additions');
    expect(log.getAttribute('tabindex')).toBe('0');
    expect(log.getAttribute('aria-live')).toBeNull();
    expect(document.querySelectorAll('[role="log"]').length).toBe(1);
  });

  it('REQ-SURF-107: composed Root > Viewport > Items yields exactly one role=log holding the messages', () => {
    render(
      <Thread.Root messages={msgs(3)} label="Support">
        <Thread.Viewport>
          <Thread.Items />
        </Thread.Viewport>
      </Thread.Root>,
    );
    const logs = document.querySelectorAll('[role="log"]');
    expect(logs.length).toBe(1);
    const log = logs[0] as HTMLElement;
    expect(log.getAttribute('data-ag-part')).toBe('log');
    expect(log.getAttribute('aria-label')).toBe('Support');
    expect(log.querySelectorAll('article[data-ag-part="message"]').length).toBe(3);
    expect(log.querySelector('[data-ag-part="top-sentinel"]')).not.toBeNull();
    expect(log.querySelector('[data-ag-part="bottom-sentinel"]')).not.toBeNull();
  });

  it('REQ-SURF-107: default Root renders the same anatomy as the composed form', () => {
    const a = render(<Thread messages={msgs(2)} />);
    const defaultHtml = a.container.innerHTML;
    a.unmount();
    const b = render(
      <Thread.Root messages={msgs(2)}>
        <Thread.Viewport><Thread.Items /></Thread.Viewport>
      </Thread.Root>,
    );
    expect(b.container.innerHTML).toBe(defaultHtml);
  });

  it('REQ-SURF-107: RenderersProvider renderer is applied at 150 messages (virtualized)', () => {
    const many: AgMessage[] = Array.from({ length: 150 }, (_, i) => ({
      id: `d-${i}`,
      role: 'assistant',
      parts: [{ type: 'data-x', data: { n: i } } as AgPart],
    }));
    const renderers = { 'data-x': (p: AgPart) => <span data-testid="data-x">{String((p as { data: { n: number } }).data.n)}</span> };
    // Box model for the virtualizer: a 400px log, 96px rows.
    jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
      if (this.getAttribute('role') === 'log') return VIEW;
      return this.dataset.index !== undefined ? 96 : 0;
    });
    jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(() => 400);
    render(
      <Thread.RenderersProvider renderers={renderers}>
        <Thread messages={many} virtualizeAfter={100} />
      </Thread.RenderersProvider>,
    );
    expect(document.querySelector('[data-ag-part="thread"]')?.hasAttribute('data-virtualized')).toBe(true);
    const out = screen.getAllByTestId('data-x');
    expect(out.length).toBeGreaterThan(0);
    expect(out.length).toBeLessThan(150);
  });

  it('REQ-SURF-109: virtualized thread has one scroll container (VirtualList adds no overflow)', () => {
    const style = document.createElement('style');
    style.textContent = readFileSync(join(__dirname, '../../ai.css'), 'utf8').replace(/@layer[^{]*\{([\s\S]*)\}\s*$/m, '$1');
    document.head.appendChild(style);
    try {
      const { container } = render(<Thread messages={msgs(150)} virtualizeAfter={100} />);
      const scrollers = [...container.querySelectorAll<HTMLElement>('*')].filter((el) => {
        const cs = getComputedStyle(el);
        return ['auto', 'scroll'].includes(cs.overflowY) || ['auto', 'scroll'].includes(cs.overflow);
      });
      expect(scrollers).toEqual([screen.getByRole('log')]);
    } finally {
      style.remove();
    }
  });

  it('renders one article per message below virtualizeAfter, each with id ag-msg-<id>', () => {
    render(<Thread messages={msgs(4)} />);
    const articles = document.querySelectorAll('[data-ag-part="message"]');
    expect(articles.length).toBe(4);
    expect([...articles].map((a) => a.id)).toEqual(['ag-msg-m-0', 'ag-msg-m-1', 'ag-msg-m-2', 'ag-msg-m-3']);
  });

  it('REQ-FIN-110 → REQ-FIN-85: the only live node Thread renders is the log (pill shown, empty state shown)', () => {
    const live = (root: ParentNode) =>
      [...root.querySelectorAll('*')]
        .filter((el) => (el.hasAttribute('aria-live') && el.getAttribute('aria-live') !== 'off')
          || ['alert', 'status', 'log'].includes(el.getAttribute('role') ?? ''))
        .map((el) => el.getAttribute('data-ag-part'));
    const { rerender, container } = render(<Thread messages={msgs(7)} />);
    const log = screen.getByRole('log');
    layout(log);
    userScroll(log, 0);
    rerender(<Thread messages={msgs(8)} />);
    expect(screen.getByRole('button', { name: '1 new message' })).toBeTruthy();
    expect(live(container)).toEqual(['log']);
    rerender(<Thread messages={[]} />);
    expect(live(container)).toEqual(['log']);
  });

  it('shows empty state when no messages', () => {
    render(<Thread messages={[]} />);
    expect(screen.getByText('No messages yet')).toBeTruthy();
  });

  it('REQ-SURF-108: growing the last message text while pinned assigns scrollTop = scrollHeight once per frame', async () => {
    let grow = 0;
    const streaming = (text: string): AgMessage[] => [
      ...msgs(6),
      { id: 's', role: 'assistant', parts: [{ type: 'text', text }], metadata: { status: 'streaming' } },
    ];
    const { rerender } = render(<Thread messages={streaming('a')} />);
    const log = screen.getByRole('log');
    const { writes, height } = layout(log, { extra: () => grow });
    userScroll(log, height());
    await frame();
    writes.length = 0;
    // Three token deltas inside one frame: the message count does not change.
    for (const t of ['a b', 'a b c', 'a b c d']) {
      grow += 40;
      rerender(<Thread messages={streaming(t)} />);
      await act(async () => { await Promise.resolve(); });
    }
    expect(writes).toEqual([]);
    await frame();
    expect(writes.length).toBe(1);
    expect(log.scrollTop).toBe(log.scrollHeight - log.clientHeight);
    expect(log.scrollHeight - log.scrollTop - log.clientHeight).toBe(0);
  });

  it('REQ-SURF-108: content growth while unpinned does not move scrollTop', async () => {
    let grow = 0;
    const streaming = (text: string): AgMessage[] => [
      ...msgs(8),
      { id: 's', role: 'assistant', parts: [{ type: 'text', text }], metadata: { status: 'streaming' } },
    ];
    const { rerender, container } = render(<Thread messages={streaming('a')} />);
    const log = screen.getByRole('log');
    const { writes } = layout(log, { extra: () => grow });
    userScroll(log, 100);
    writes.length = 0;
    grow += 400;
    rerender(<Thread messages={streaming('a b c d e')} />);
    await frame();
    expect(writes).toEqual([]);
    expect(log.scrollTop).toBe(100);
    expect(container.querySelector('[data-ag-part="jump-to-latest"]')).toBeNull();
  });

  it('REQ-SURF-108: jump pill appears after arrival while unpinned; name is its visible text; activation re-pins', async () => {
    const ref = React.createRef<ThreadHandle>();
    const { rerender } = render(<Thread ref={ref} messages={msgs(7)} />);
    const log = screen.getByRole('log');
    layout(log);
    userScroll(log, 0);
    expect(ref.current!.isPinned()).toBe(false);
    rerender(<Thread ref={ref} messages={msgs(8)} />);
    const pill = screen.getByRole('button', { name: '1 new message' });
    expect(pill.hasAttribute('aria-label')).toBe(false);
    expect(pill.textContent).toBe('1 new message');
    fireEvent.click(pill);
    await frame();
    expect(ref.current!.isPinned()).toBe(true);
    expect(log.scrollTop).toBe(log.scrollHeight - VIEW);
    expect(document.querySelector('[data-ag-part="jump-to-latest"]')).toBeNull();
    expect(document.activeElement).toBe(log);
  });

  it('REQ-SURF-108: user send re-pins an unpinned thread (no jump pill)', async () => {
    const ref = React.createRef<ThreadHandle>();
    const { rerender } = render(<Thread ref={ref} messages={msgs(8)} />);
    const log = screen.getByRole('log');
    layout(log);
    userScroll(log, 0);
    expect(ref.current!.isPinned()).toBe(false);
    const next = [...msgs(8), { id: 'u', role: 'user' as const, parts: [{ type: 'text' as const, text: 'hi' }] }];
    rerender(<Thread ref={ref} messages={next} />);
    expect(ref.current!.isPinned()).toBe(true);
    expect(document.querySelector('[data-ag-part="jump-to-latest"]')).toBeNull();
    await frame();
    expect(log.scrollTop).toBe(log.scrollHeight - VIEW);
  });

  it('REQ-SURF-109: prepending history while unpinned keeps the first visible message offset', async () => {
    const { rerender } = render(<Thread messages={msgs(10, 10)} />);
    const log = screen.getByRole('log');
    layout(log);
    userScroll(log, 250); // m-12 is first visible, 50px above the log top
    const before = document.getElementById('ag-msg-m-12')!.getBoundingClientRect().top;
    expect(before).toBe(-50);
    rerender(<Thread messages={[...msgs(5, 5), ...msgs(10, 10)]} />);
    expect(log.scrollTop).toBe(750);
    expect(document.getElementById('ag-msg-m-12')!.getBoundingClientRect().top).toBe(before);
    expect(document.querySelector('[data-ag-part="jump-to-latest"]')).toBeNull();
  });

  it('REQ-SURF-109: onReachTop fires once per sentinel entry (isIntersecting false→true edge)', () => {
    let cb: IntersectionObserverCallback = () => {};
    const observed: Element[] = [];
    class IO {
      constructor(c: IntersectionObserverCallback) { cb = c; }
      observe(el: Element) { observed.push(el); }
      disconnect() {}
      unobserve() {}
      takeRecords() { return []; }
    }
    const original = (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;
    (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = IO;
    try {
      const onReachTop = jest.fn();
      render(<Thread messages={msgs(4)} onReachTop={onReachTop} />);
      expect(observed[0]?.getAttribute('data-ag-part')).toBe('top-sentinel');
      const fire = (isIntersecting: boolean) =>
        act(() => { cb([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver); });
      fire(true);
      fire(true);
      fire(true);
      expect(onReachTop).toHaveBeenCalledTimes(1);
      fire(false);
      expect(onReachTop).toHaveBeenCalledTimes(1);
      fire(true);
      expect(onReachTop).toHaveBeenCalledTimes(2);
    } finally {
      (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = original;
    }
  });

  it('REQ-SURF-110: non-virtualized scrollToMessage sets log.scrollTop from rect deltas; honours block; 0 scrollIntoView', () => {
    (Element.prototype as unknown as { scrollIntoView?: () => void }).scrollIntoView ??= () => {};
    const spy = jest.spyOn(Element.prototype, 'scrollIntoView');
    const ref = React.createRef<ThreadHandle>();
    render(<Thread ref={ref} messages={msgs(20)} />);
    const log = screen.getByRole('log');
    layout(log);
    log.scrollTop = 0;
    act(() => { ref.current!.scrollToMessage('m-5'); });
    expect(log.scrollTop).toBe(500);
    act(() => { ref.current!.scrollToMessage('m-10', { block: 'center' }); });
    expect(log.scrollTop).toBe(1000 - (VIEW - ROW) / 2);
    act(() => { ref.current!.scrollToMessage('m-12', { block: 'end' }); });
    expect(log.scrollTop).toBe(1300 - VIEW);
    act(() => { ref.current!.scrollToMessage('m-10', { block: 'nearest' }); });
    expect(log.scrollTop).toBe(1300 - VIEW); // already fully visible
    act(() => { ref.current!.scrollToMessage('missing'); });
    expect(log.scrollTop).toBe(1300 - VIEW);
    expect(spy).not.toHaveBeenCalled();
  });
});
