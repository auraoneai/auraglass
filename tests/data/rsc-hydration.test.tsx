/** @jest-environment node */
// SURF-145 — REQ-SURF-07/08: the W2 server list renders via renderToString
// with zero hooks; StatCard/Sparkline/ChartFrame root/Timeline/ActivityFeed
// frame produce complete markup server-side.
import { describe, expect, it } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { StatCard } from '../../src/data/stat-card/StatCard';
import { Sparkline } from '../../src/data/sparkline/Sparkline';
import { ChartFrame } from '../../src/data/chart-frame/ChartFrame';
import { Timeline } from '../../src/components/timeline/Timeline';

const DATA = [{ m: 'Jan', a: 3 }];
const SERIES = [{ key: 'a', label: 'A' }];

describe('RSC/hydration split (SURF-145)', () => {
  it('StatCard renders a complete article server-side', () => {
    const html = renderToString(createElement(StatCard, { label: 'Revenue', value: 128430, delta: 0.1, trendDirection: 'up-is-good' }));
    expect(html).toContain('data-ag-part="stat-card"');
    expect(html).toContain('Revenue');
    expect(html).toContain('128,430');
  });
  it('Sparkline renders role=img svg with its aria-label server-side', () => {
    const html = renderToString(createElement(Sparkline, { data: [1, 4, 2, 8], label: 'Trend' }));
    expect(html).toContain('role="img"');
    expect(html).toContain('Trend');
  });
  it('ChartFrame renders figure + caption + table fallback server-side (plot is a height placeholder)', () => {
    const html = renderToString(createElement(ChartFrame, { title: 'T', data: DATA, series: SERIES, x: { key: 'm', label: 'Month' }, children: null }));
    expect(html).toContain('data-ag-part="chart-frame"');
    expect(html).toContain('<figcaption');
    expect(html).toContain('chart-table');
  });
  it('Timeline renders <ol><li><time> server-side', () => {
    const html = renderToString(createElement(Timeline, { items: [{ id: 'a', timestamp: '2026-10-07T00:00:00Z', title: 'Shipped' }] }));
    expect(html).toContain('<ol');
    expect(html).toContain('<time');
    expect(html).toContain('Shipped');
  });
});
