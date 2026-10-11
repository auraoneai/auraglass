/** @jest-environment jsdom */
// SURF-188: <ol>/<li>/<time dateTime>, relative + absolute formats, intents,
// ActivityFeed grouping + load more + prepend announce batching.
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { Timeline, formatTimestamp } from './Timeline';
import { ActivityFeed } from './ActivityFeed';

const ITEMS = [
  { id: '1', timestamp: '2026-10-01T10:00:00Z', title: 'Deployed', intent: 'success' as const },
  { id: '2', timestamp: '2026-10-02T10:00:00Z', title: 'Rolled back', intent: 'danger' as const, description: 'error rate' },
];

describe('Timeline (SURF-186, REQ-SURF-96)', () => {
  it('renders <ol>/<li>/<time dateTime> with intents', () => {
    const { container } = render(<Timeline items={ITEMS} aria-label="Deploys" />);
    expect(container.querySelectorAll('ol li').length).toBe(2);
    const time = container.querySelector('time')!;
    expect(time.getAttribute('dateTime')).toBe('2026-10-01T10:00:00.000Z');
    expect(container.querySelector('[data-ag-intent="success"]')).toBeTruthy();
  });

  it('relative format needs now; renders "N hours ago"', () => {
    const now = new Date('2026-10-02T20:00:00Z').getTime();
    const { text } = formatTimestamp('2026-10-02T10:00:00Z', 'relative', 'en-US', now);
    expect(text).toMatch(/hour/);
    const dev = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    formatTimestamp('2026-10-02T10:00:00Z', 'relative', 'en-US');
    expect(err).toHaveBeenCalled();
    err.mockRestore();
    process.env['NODE_ENV'] = dev;
  });

  it('a non-date timestamp string renders verbatim without dateTime (4.x display times via compat)', () => {
    expect(formatTimestamp('2 hours ago', 'absolute', 'en-US')).toEqual({ dateTime: '', text: '2 hours ago' });
    const { container } = render(<Timeline items={[{ id: 'a', timestamp: '2 hours ago', title: 'Started' }]} />);
    const time = container.querySelector('[data-ag-part="timeline-time"]')!;
    expect(time.textContent).toBe('2 hours ago');
    expect(time.hasAttribute('datetime')).toBe(false);
  });
});

describe('ActivityFeed (SURF-187, REQ-SURF-97)', () => {
  const ACT = ITEMS.map((i, n) => ({ ...i, actor: { name: `User ${n}` } }));

  it('groups by day with heading', () => {
    const { container } = render(<ActivityFeed items={ACT} groupBy="day" locale="en-US" />);
    expect(container.querySelectorAll('[data-ag-part="activity-day-heading"]').length).toBe(2);
  });

  it('Load more button fires onLoadMore; loading disables', () => {
    const on = jest.fn();
    const { container } = render(<ActivityFeed items={ACT} hasMore onLoadMore={on} />);
    const btn = container.querySelector('[data-ag-part="activity-load-more"]') as HTMLElement;
    fireEvent.click(btn);
    expect(on).toHaveBeenCalledTimes(1);
  });

  it('prepends announce batched once', () => {
    const { container, rerender } = render(<ActivityFeed items={ACT} />);
    rerender(<ActivityFeed items={[{ id: 'x', timestamp: '2026-10-03T00:00:00Z', title: 'New' }, ...ACT]} />);
    const status = container.querySelector('[role="status"]')!;
    expect(status.textContent).toContain('1 new activities');
  });
});
