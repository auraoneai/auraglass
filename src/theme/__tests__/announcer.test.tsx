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

  it('id replacement swaps the previous message under the same id', () => {
    const { api } = setup();
    act(() => { api().announce('Step 1 of 3', { id: 'wizard' }); });
    act(() => { api().announce('Step 2 of 3', { id: 'wizard' }); });
    expect(regions().polite.textContent).toBe('Step 2 of 3');
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

  it('createStreamingAnnouncer: 10 s stream, token every 50 ms -> <= 11 writes', () => {
    const writes: string[] = [];
    const announce = (m: string) => { writes.push(m); };
    const s = createStreamingAnnouncer(announce, { intervalMs: 1000 });
    for (let i = 0; i < 200; i += 1) {
      s.push(`token-${i}`);
      jest.advanceTimersByTime(50);
    }
    s.stop();
    // first chunk immediate + at most one flush per 1000 ms window + tail
    expect(writes.length).toBeLessThanOrEqual(11);
    expect(writes[0]).toBe('token-0');
  });
});
