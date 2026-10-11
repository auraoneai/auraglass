/* MAT-292/293 (A11Y-055): live-region announcer — polite/assertive routing,
   500 ms identical coalescing, 7 000 ms clear, id replacement, streaming
   budget via createStreamingAnnouncer, and a single dev warning when no
   provider/portal root exists. */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render, act } from '@testing-library/react';
import { AuraGlassProvider } from '../AuraGlassProvider';
import { useAnnouncer, createStreamingAnnouncer } from '../announcer/useAnnouncer';
import type { UseAnnouncer } from '../../contracts/preferences';

jest.useFakeTimers();

const setup = () => {
  let api: ReturnType<UseAnnouncer> | null = null;
  function Probe() {
    api = useAnnouncer();
    return null;
  }
  render(<AuraGlassProvider storage={null}><Probe /></AuraGlassProvider>);
  return { api: () => api! };
};

const regions = () => ({
  polite: document.querySelector('[data-ag-announcer] [aria-live="polite"]')!,
  assertive: document.querySelector('[data-ag-announcer] [aria-live="assertive"]')!,
});

afterEach(() => {
  document.body.querySelectorAll('[data-ag-portal-root]').forEach((e) => e.remove());
  document.documentElement.removeAttribute('data-ag-root');
});

describe('useAnnouncer', () => {
  it('routes messages to polite by default and assertive on demand', () => {
    const { api } = setup();
    act(() => { api().announce('Saved'); });
    expect(regions().polite.textContent).toBe('Saved');
    expect(regions().assertive.textContent).toBe('');
    act(() => { api().announce('Error', { politeness: 'assertive' }); });
    expect(regions().assertive.textContent).toBe('Error');
  });

  it('coalesces identical messages within 500 ms', () => {
    const { api } = setup();
    act(() => { api().announce('Hi'); });
    act(() => { api().announce('Hi'); });
    expect(regions().polite.textContent).toBe('Hi');
    // second announce produces a re-announce nudge only after 500 ms
    act(() => { jest.advanceTimersByTime(600); api().announce('Hi'); });
    expect(regions().polite.textContent).toBe('Hi');
  });

  it('clears regions 7 000 ms after the last write', () => {
    const { api } = setup();
    act(() => { api().announce('Gone soon'); });
    expect(regions().polite.textContent).toBe('Gone soon');
    act(() => { jest.advanceTimersByTime(7000); });
    expect(regions().polite.textContent).toBe('');
  });

  it('clear() empties both regions', () => {
    const { api } = setup();
    act(() => {
      api().announce('A');
      api().announce('B', { politeness: 'assertive' });
    });
    act(() => { api().clear(); });
    expect(regions().polite.textContent).toBe('');
    expect(regions().assertive.textContent).toBe('');
  });

  it('id replacement: a same-id message within 100 ms replaces the queued one; only the second is ever written', () => {
    const { api } = setup();
    const polite = regions().polite;
    const seen: string[] = [];
    const desc = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent')!;
    Object.defineProperty(polite, 'textContent', {
      configurable: true,
      get() { return desc.get!.call(this); },
      set(v: string) { seen.push(v); desc.set!.call(this, v); },
    });
    act(() => { api().announce('Step 1 of 3', { id: 'wizard' }); });
    expect(polite.textContent).toBe('');
    act(() => { jest.advanceTimersByTime(100); });
    expect(polite.textContent).toBe('');
    act(() => { api().announce('Step 2 of 3', { id: 'wizard' }); });
    act(() => { jest.advanceTimersByTime(1000); });
    delete (polite as unknown as Record<string, unknown>).textContent;
    expect(polite.textContent).toBe('Step 2 of 3');
    expect(seen.some((t) => t.includes('Step 1 of 3'))).toBe(false);
    expect(seen).toContain('Step 2 of 3');
  });

  it('per-region queue: a write inside the 500 ms gap is queued, then written in order', () => {
    const { api } = setup();
    const polite = regions().polite;
    act(() => { api().announce('First'); });
    expect(polite.textContent).toBe('First');
    act(() => { jest.advanceTimersByTime(100); api().announce('Second'); });
    // still inside the gap: queued, not written
    expect(polite.textContent).toBe('First');
    act(() => { jest.advanceTimersByTime(399); });
    expect(polite.textContent).toBe('First');
    act(() => { jest.advanceTimersByTime(1); });
    expect(polite.textContent).toBe('Second');
  });

  it('regions queue independently: an assertive write is not delayed by a busy polite lane', () => {
    const { api } = setup();
    act(() => {
      api().announce('Polite 1');
      api().announce('Polite 2');
      api().announce('Alert', { politeness: 'assertive' });
    });
    expect(regions().polite.textContent).toBe('Polite 1');
    expect(regions().assertive.textContent).toBe('Alert');
    act(() => { jest.advanceTimersByTime(500); });
    expect(regions().polite.textContent).toBe('Polite 2');
  });

  it('clear() drops queued entries so nothing is written afterwards', () => {
    const { api } = setup();
    act(() => { api().announce('Now'); api().announce('Later'); });
    act(() => { api().clear(); });
    act(() => { jest.advanceTimersByTime(2000); });
    expect(regions().polite.textContent).toBe('');
  });

  it('no-op + exactly one dev warning when no provider is mounted', () => {
    document.body.querySelectorAll('[data-ag-portal-root]').forEach((e) => e.remove());
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { render } = require('@testing-library/react') as typeof import('@testing-library/react');
    let api: ReturnType<UseAnnouncer> | null = null;
    function Bare() { api = useAnnouncer(); return null; }
    render(React.createElement(Bare));
    act(() => { api!.announce('nobody hears'); });
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('createStreamingAnnouncer: 10 s stream, token every 50 ms -> <= 11 writes, final token is the last write', () => {
    const writes: string[] = [];
    const announce = (m: string) => { writes.push(m); };
    const s = createStreamingAnnouncer(announce, { intervalMs: 1000 });
    // tokens at t = 0, 50, ..., 9950 ms; stop() at 9950 ms with the tail
    // (token-181..token-199) still buffered.
    for (let i = 0; i < 200; i += 1) {
      if (i > 0) jest.advanceTimersByTime(50);
      s.push(`token-${i}`);
    }
    s.stop();
    // first chunk immediate + one flush per 1000 ms window + the stop() tail
    expect(writes.length).toBeLessThanOrEqual(11);
    expect(writes[0]).toBe('token-0');
    expect(writes[writes.length - 1]).toContain('token-199');
    // every token is announced exactly once, in order, across the writes
    const announced = Array.from(writes.join(' ').matchAll(/token-(\d+)/g), (m) => Number(m[1]));
    expect(announced).toEqual(Array.from({ length: 200 }, (_, i) => i));
    // no write after stop()
    const n = writes.length;
    jest.advanceTimersByTime(5000);
    expect(writes.length).toBe(n);
  });

  it('createStreamingAnnouncer: stream through useAnnouncer leaves the final token in the region', () => {
    const { api } = setup();
    const s = createStreamingAnnouncer((m) => api().announce(m), { intervalMs: 1000 });
    act(() => {
      for (let i = 0; i < 200; i += 1) {
        if (i > 0) jest.advanceTimersByTime(50);
        s.push(`token-${i} `);
      }
      s.stop();
    });
    act(() => { jest.advanceTimersByTime(500); });
    expect(regions().polite.textContent).toContain('token-199');
  });

  it('createStreamingAnnouncer: cancel() discards the buffered tail', () => {
    const writes: string[] = [];
    const s = createStreamingAnnouncer((m) => { writes.push(m); }, { intervalMs: 1000 });
    s.push('a');
    jest.advanceTimersByTime(200);
    s.push('b');
    s.cancel();
    jest.advanceTimersByTime(5000);
    expect(writes).toEqual(['a']);
  });
});
