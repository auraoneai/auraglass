/** @jest-environment jsdom */
// SURF-188 / REQ-SURF-96: <ol>/<li>/<time dateTime>, relative + absolute
// formats with an explicit time zone, intent by icon + text, horizontal
// orientation inside its size container. ActivityFeed cases live in
// ActivityFeed.test.tsx.
import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Timeline, formatTimestamp } from './Timeline';

const ITEMS = [
  { id: '1', timestamp: '2026-10-01T10:00:00Z', title: 'Deployed', intent: 'success' as const },
  { id: '2', timestamp: '2026-10-02T10:00:00Z', title: 'Rolled back', intent: 'danger' as const, description: 'error rate' },
  { id: '3', timestamp: '2026-10-02T11:00:00Z', title: 'Noted' },
];

describe('Timeline (SURF-186, REQ-SURF-96)', () => {
  it('renders <ol>/<li>/<time dateTime> with intents', () => {
    const { container } = render(<Timeline items={ITEMS} aria-label="Deploys" />);
    expect(container.querySelectorAll('ol li').length).toBe(3);
    const time = container.querySelector('time')!;
    expect(time.getAttribute('dateTime')).toBe('2026-10-01T10:00:00.000Z');
    expect(container.querySelector('[data-ag-intent="success"]')).toBeTruthy();
  });

  it('intent by text: danger and success items carry visually-hidden intent text; neutral carries none', () => {
    const { container } = render(<Timeline items={ITEMS} />);
    const hidden = (i: number) =>
      container.querySelectorAll('li')[i]!.querySelector('[data-ag-part="timeline-title"] .ag-visually-hidden')?.textContent ?? null;
    expect(hidden(0)).toBe('Success: ');
    expect(hidden(1)).toBe('Error: ');
    expect(hidden(2)).toBeNull();
    // the marker stays decorative; the title's text content now names the intent
    expect(container.querySelector('[data-ag-part="timeline-marker"]')!.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelectorAll('[data-ag-part="timeline-title"]')[1]!.textContent).toBe('Error: Rolled back');
  });

  it('intent labels are localisable', () => {
    const { container } = render(<Timeline items={ITEMS} labels={{ intent: { danger: 'Fehler', success: 'Erfolg' } }} />);
    const titles = [...container.querySelectorAll('[data-ag-part="timeline-title"]')].map((t) => t.textContent);
    expect(titles).toEqual(['Erfolg: Deployed', 'Fehler: Rolled back', 'Noted']);
  });

  it('horizontal orientation sets the attr and sits inside a size container', () => {
    const { container } = render(<Timeline items={ITEMS} orientation="horizontal" />);
    const ol = container.querySelector('[data-ag-part="timeline"]')!;
    expect(ol.getAttribute('data-ag-orientation')).toBe('horizontal');
    expect(ol.parentElement!.classList.contains('ag-timeline__container')).toBe(true);
    const css = readFileSync(join(__dirname, 'timeline.css'), 'utf8');
    expect(css).toMatch(/\.ag-timeline__container\s*\{\s*container-type:\s*inline-size;/);
    expect(css).toMatch(/@container \(max-width: 480px\)\s*\{\s*\.ag-timeline\[data-ag-orientation='horizontal'\]\s*\{\s*grid-auto-flow: row;/);
  });

  it('absolute format uses timeZone (default UTC)', () => {
    const utc = formatTimestamp('2026-10-01T02:30:00Z', { dateStyle: 'short' }, 'en-US');
    const ny = formatTimestamp('2026-10-01T02:30:00Z', { dateStyle: 'short' }, 'en-US', undefined, 'America/New_York');
    expect(utc.text).toBe('10/1/26');
    expect(ny.text).toBe('9/30/26');
    const { container } = render(<Timeline items={[{ id: 'a', timestamp: '2026-10-01T02:30:00Z', title: 'x' }]} timeFormat={{ dateStyle: 'short' }} timeZone="America/New_York" />);
    expect(container.querySelector('time')!.textContent).toBe('9/30/26');
  });

  it('relative format needs now; renders "N hours ago"; dev error without now', () => {
    const now = new Date('2026-10-02T20:00:00Z').getTime();
    const { text } = formatTimestamp('2026-10-02T10:00:00Z', 'relative', 'en-US', now);
    expect(text).toBe('10 hours ago');
    const dev = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      render(<Timeline items={ITEMS.slice(0, 1)} timeFormat="relative" />);
      expect(err).toHaveBeenCalledTimes(1);
      expect(String(err.mock.calls[0]![0])).toContain('pass `now` when timeFormat="relative"');
    } finally {
      err.mockRestore();
      process.env['NODE_ENV'] = dev;
    }
  });
});
