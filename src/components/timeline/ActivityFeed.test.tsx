/** @jest-environment jsdom */
// REQ-SURF-97: ActivityFeed — CMP Avatar per actor, day groups with a
// configurable heading level, CMP Button "Load more", autoLoad's single
// IntersectionObserver (disconnected on unmount), and prepend announcements
// batched to one per 2 s window ("3 new activities"); appends announce
// nothing.
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { ActivityFeed, type ActivityItem } from './ActivityFeed';
import { ANNOUNCE_WINDOW_MS, countPrepended } from './ActivityFeed.Interactive';

const item = (id: string, day = '2026-10-02', name = `User ${id}`): ActivityItem => ({
  id,
  timestamp: `${day}T10:00:00Z`,
  title: `Event ${id}`,
  actor: { name },
});
const BASE = [item('c'), item('b', '2026-10-01'), item('a', '2026-10-01')];
const status = (c: HTMLElement) => c.querySelector('[role="status"]')!.textContent;

describe('ActivityFeed (SURF-187, REQ-SURF-97)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders a CMP Avatar per actor next to the visible name', () => {
    const items = [{ ...item('x'), actor: { name: 'Ada Lovelace', avatarUrl: 'https://example.test/ada.png' } }, item('y', '2026-10-02', 'Grace Hopper')];
    const { container } = render(<ActivityFeed items={items} />);
    const actors = container.querySelectorAll('[data-ag-part="activity-actor"]');
    expect(actors).toHaveLength(2);
    const avatar0 = actors[0]!.querySelector('.ag-avatar')!;
    expect(avatar0.getAttribute('data-ag-part')).toBe('root');
    expect(avatar0.getAttribute('aria-hidden')).toBe('true');
    expect(avatar0.querySelector('img[data-ag-part="image"]')!.getAttribute('src')).toBe('https://example.test/ada.png');
    expect(actors[0]!.textContent).toContain('Ada Lovelace');
    // no avatarUrl: initials fallback, still decorative
    const avatar1 = actors[1]!.querySelector('.ag-avatar')!;
    expect(avatar1.querySelector('[data-ag-part="fallback"]')!.textContent).toBe('GH');
    expect(avatar1.getAttribute('aria-hidden')).toBe('true');
  });

  it('groups by day with <h3> headings by default and a configurable level', () => {
    const { container, rerender } = render(<ActivityFeed items={BASE} groupBy="day" locale="en-US" />);
    const headings = container.querySelectorAll('[data-ag-part="activity-day-heading"]');
    expect([...headings].map((h) => [h.tagName, h.textContent])).toEqual([['H3', 'Oct 2, 2026'], ['H3', 'Oct 1, 2026']]);
    rerender(<ActivityFeed items={BASE} groupBy="day" headingLevel={4} />);
    expect(container.querySelectorAll('h4[data-ag-part="activity-day-heading"]')).toHaveLength(2);
  });

  it('Load more is a CMP Button: fires onLoadMore, loading disables it and shows the loading label', () => {
    const on = jest.fn();
    const { container, rerender } = render(<ActivityFeed items={BASE} hasMore onLoadMore={on} />);
    const btn = container.querySelector('[data-ag-part="activity-load-more"]') as HTMLButtonElement;
    expect(btn.classList.contains('ag-button')).toBe(true);
    expect(btn.textContent).toBe('Load more');
    fireEvent.click(btn);
    expect(on).toHaveBeenCalledTimes(1);
    rerender(<ActivityFeed items={BASE} hasMore loading onLoadMore={on} />);
    const busy = container.querySelector('[data-ag-part="activity-load-more"]') as HTMLButtonElement;
    expect(busy.textContent).toBe('Loading');
    expect(busy.disabled || busy.getAttribute('aria-disabled') === 'true').toBe(true);
    rerender(<ActivityFeed items={BASE} hasMore={false} onLoadMore={on} />);
    expect(container.querySelector('[data-ag-part="activity-load-more"]')).toBeNull();
  });

  it('prepends: 3 items in two rerenders within 2 s -> exactly one "3 new activities"', async () => {
    const { container, rerender } = render(<ActivityFeed items={BASE} />);
    const region = container.querySelector('[role="status"]')!;
    const seen: string[] = [];
    const mo = new MutationObserver(() => { if (region.textContent) seen.push(region.textContent); });
    mo.observe(region, { childList: true, characterData: true, subtree: true });
    // MutationObserver callbacks are microtasks (not faked): flush after each step.
    const flush = () => Promise.resolve();

    rerender(<ActivityFeed items={[item('d'), ...BASE]} />);
    act(() => { jest.advanceTimersByTime(800); });
    await flush();
    rerender(<ActivityFeed items={[item('f'), item('e'), item('d'), ...BASE]} />);
    act(() => { jest.advanceTimersByTime(ANNOUNCE_WINDOW_MS - 800 - 1); });
    await flush();
    expect(status(container)).toBe('');
    act(() => { jest.advanceTimersByTime(1); });
    await flush();
    expect(status(container)).toBe('3 new activities');
    act(() => { jest.advanceTimersByTime(10_000); });
    await flush();
    mo.disconnect();
    expect(seen).toEqual(['3 new activities']);
  });

  it('a prepend after the window starts a new window; one item uses the singular label', () => {
    const { container, rerender } = render(<ActivityFeed items={BASE} />);
    rerender(<ActivityFeed items={[item('d'), ...BASE]} />);
    act(() => { jest.advanceTimersByTime(ANNOUNCE_WINDOW_MS); });
    expect(status(container)).toBe('1 new activity');
    rerender(<ActivityFeed items={[item('f'), item('e'), item('d'), ...BASE]} />);
    act(() => { jest.advanceTimersByTime(ANNOUNCE_WINDOW_MS); });
    expect(status(container)).toBe('2 new activities');
  });

  it('labels: newItem / newItems override the announcement text', () => {
    const labels = { newItem: 'neue Aktivität', newItems: 'neue Aktivitäten' };
    const { container, rerender } = render(<ActivityFeed items={BASE} labels={labels} />);
    rerender(<ActivityFeed items={[item('e'), item('d'), ...BASE]} labels={labels} />);
    act(() => { jest.advanceTimersByTime(ANNOUNCE_WINDOW_MS); });
    expect(status(container)).toBe('2 neue Aktivitäten');
  });

  it('appends via Load more produce no announcement', () => {
    const { container, rerender } = render(<ActivityFeed items={BASE} hasMore onLoadMore={() => {}} />);
    rerender(<ActivityFeed items={[...BASE, item('z', '2026-09-30'), item('y', '2026-09-30')]} hasMore onLoadMore={() => {}} />);
    act(() => { jest.advanceTimersByTime(ANNOUNCE_WINDOW_MS * 2); });
    expect(status(container)).toBe('');
  });

  it('a pending announcement is cancelled on unmount (no timer left behind)', () => {
    const { rerender, unmount } = render(<ActivityFeed items={BASE} />);
    rerender(<ActivityFeed items={[item('d'), ...BASE]} />);
    expect(jest.getTimerCount()).toBe(1);
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    unmount();
    expect(jest.getTimerCount()).toBe(0);
    act(() => { jest.advanceTimersByTime(ANNOUNCE_WINDOW_MS); });
    expect(err).not.toHaveBeenCalled();
    err.mockRestore();
  });

  it('countPrepended: items before the previous head; 0 for appends and replaced lists', () => {
    expect(countPrepended('a', ['c', 'b', 'a', 'z'])).toBe(2);
    expect(countPrepended('a', ['a', 'z'])).toBe(0);
    expect(countPrepended('a', ['q', 'r'])).toBe(0);
    expect(countPrepended(undefined, ['q'])).toBe(0);
  });

  describe('autoLoad', () => {
    const saved = (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;
    const made: { cb: IntersectionObserverCallback; observe: jest.Mock; disconnect: jest.Mock }[] = [];
    beforeEach(() => {
      made.length = 0;
      (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = class {
        observe = jest.fn();
        disconnect = jest.fn();
        cb: IntersectionObserverCallback;
        constructor(cb: IntersectionObserverCallback) {
          this.cb = cb;
          made.push(this);
        }
        unobserve() {}
        takeRecords() { return []; }
      };
    });
    afterEach(() => {
      (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = saved;
    });

    it('opts into one IntersectionObserver on the sentinel; intersecting loads more; unmount disconnects', () => {
      const on = jest.fn();
      const { unmount } = render(<ActivityFeed items={BASE} hasMore autoLoad onLoadMore={on} />);
      expect(made).toHaveLength(1);
      expect(made[0]!.observe).toHaveBeenCalledTimes(1);
      act(() => made[0]!.cb([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
      expect(on).not.toHaveBeenCalled();
      act(() => made[0]!.cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
      expect(on).toHaveBeenCalledTimes(1);
      unmount();
      expect(made[0]!.disconnect).toHaveBeenCalledTimes(1);
    });

    it('without autoLoad (or without more items) no observer is created', () => {
      render(<ActivityFeed items={BASE} hasMore onLoadMore={() => {}} />);
      render(<ActivityFeed items={BASE} autoLoad hasMore={false} onLoadMore={() => {}} />);
      expect(made).toHaveLength(0);
    });

    it('a new onLoadMore identity does not recreate the observer', () => {
      const { rerender } = render(<ActivityFeed items={BASE} hasMore autoLoad onLoadMore={() => {}} />);
      const second = jest.fn();
      rerender(<ActivityFeed items={BASE} hasMore autoLoad onLoadMore={second} />);
      expect(made).toHaveLength(1);
      act(() => made[0]!.cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
      expect(second).toHaveBeenCalledTimes(1);
    });
  });
});
