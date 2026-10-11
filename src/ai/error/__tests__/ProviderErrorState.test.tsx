import { describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ProviderErrorState } from '../ProviderErrorState';
import type { AgErrorKind } from '../ProviderErrorState';

const KINDS = ['rate-limit', 'auth', 'network', 'content-filter', 'context-length', 'aborted', 'unknown'] as const;

describe('ProviderErrorState', () => {
  it.each(KINDS)('default copy for %s', (kind: AgErrorKind) => {
    const { container } = render(<ProviderErrorState kind={kind} />);
    const title = container.querySelector('[data-ag-part="error-title"]')!;
    expect(title.textContent!.length).toBeGreaterThan(3);
  });
  it('role=alert in panel only', () => {
    const p = render(<ProviderErrorState kind="network" variant="panel" />);
    expect(screen.getByRole('alert')).toBeTruthy();
    p.unmount();
    const c = render(<ProviderErrorState kind="network" variant="compact" />);
    expect(c.container.querySelector('[role="alert"]')).toBeNull();
  });
  it('retry countdown 3→0 then enables', () => {
    jest.useFakeTimers();
    render(<ProviderErrorState kind="network" retryAfterMs={3000} onRetry={() => {}} />);
    const btn = screen.getByRole('button');
    expect((btn as HTMLButtonElement).disabled).toBe(true);
    expect(btn.textContent).toContain('3');
    act(() => { jest.advanceTimersByTime(3100); });
    expect((btn as HTMLButtonElement).disabled).toBe(false);
    jest.useRealTimers();
  });
  it('settled state keeps no timer alive after the countdown (REQ-SURF-190)', () => {
    jest.useFakeTimers();
    render(<ProviderErrorState kind="rate-limit" retryAfterMs={2000} onRetry={() => {}} />);
    expect(jest.getTimerCount()).toBe(1);
    act(() => { jest.advanceTimersByTime(2000); });
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(false);
    expect(jest.getTimerCount()).toBe(0);
    jest.useRealTimers();
  });
  it('no retryAfterMs starts no timer', () => {
    jest.useFakeTimers();
    render(<ProviderErrorState kind="network" onRetry={() => {}} />);
    expect(jest.getTimerCount()).toBe(0);
    jest.useRealTimers();
  });
});
