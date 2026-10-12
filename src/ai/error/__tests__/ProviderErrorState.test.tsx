import { describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { DEFAULT_COPY, ProviderErrorState } from '../ProviderErrorState';
import type { AgErrorKind } from '../ProviderErrorState';

const KINDS = ['rate-limit', 'auth', 'network', 'content-filter', 'context-length', 'aborted', 'unknown'] as const;

describe('ProviderErrorState', () => {
  it.each(KINDS)('default copy for %s', (kind: AgErrorKind) => {
    const { container } = render(<ProviderErrorState kind={kind} />);
    const title = container.querySelector('[data-ag-part="error-title"]')!;
    expect(title.textContent!.length).toBeGreaterThan(3);
  });
  it('role=alert in panel appearance only', () => {
    const p = render(<ProviderErrorState kind="network" appearance="panel" />);
    expect(screen.getByRole('alert')).toBeTruthy();
    p.unmount();
    const c = render(<ProviderErrorState kind="network" appearance="compact" />);
    expect(c.container.querySelector('[role="alert"]')).toBeNull();
  });
  it('appearance is emitted as data-ag-appearance, never a variant attribute (S-30)', () => {
    const d = render(<ProviderErrorState kind="auth" />);
    const root = d.container.querySelector('[data-ag-part="provider-error"]')!;
    expect(root.getAttribute('data-ag-appearance')).toBe('panel');
    expect(root.hasAttribute('data-variant')).toBe(false);
    expect(root.hasAttribute('data-ag-variant')).toBe(false);
    d.unmount();
    const c = render(<ProviderErrorState kind="auth" appearance="compact" />);
    expect(c.container.querySelector('[data-ag-part="provider-error"]')!.getAttribute('data-ag-appearance')).toBe('compact');
  });
  it('retry countdown 3→0 then enables', () => {
    jest.useFakeTimers();
    render(<ProviderErrorState kind="network" retryAfterMs={3000} onRetry={() => {}} />);
    const btn = screen.getByRole('button');
    expect((btn as HTMLButtonElement).disabled).toBe(true);
    expect(btn.textContent).toContain('3');
    // one timeout per second (REQ-MAT-51: no interval loop): each tick commits
    // before the next timeout is armed
    for (const left of ['2', '1']) {
      act(() => { jest.advanceTimersByTime(1000); });
      expect(btn.textContent).toContain(left);
      expect(jest.getTimerCount()).toBe(1);
    }
    act(() => { jest.advanceTimersByTime(1000); });
    expect((btn as HTMLButtonElement).disabled).toBe(false);
    jest.useRealTimers();
  });
  it('settled state keeps no timer alive after the countdown (REQ-SURF-190)', () => {
    jest.useFakeTimers();
    render(<ProviderErrorState kind="rate-limit" retryAfterMs={2000} onRetry={() => {}} />);
    expect(jest.getTimerCount()).toBe(1);
    act(() => { jest.advanceTimersByTime(1000); });
    act(() => { jest.advanceTimersByTime(1000); });
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

  it.each(KINDS)('REQ-SURF-127: %s renders its exact default title and detail', (kind: AgErrorKind) => {
    const { container } = render(<ProviderErrorState kind={kind} />);
    expect(container.querySelector('[data-ag-part="error-title"]')!.textContent).toBe(DEFAULT_COPY[kind].title);
    expect(container.querySelector('[data-ag-part="error-detail"]')!.textContent).toBe(DEFAULT_COPY[kind].detail);
  });
  it('REQ-SURF-127: default copy is distinct per kind', () => {
    const titles = KINDS.map((k) => DEFAULT_COPY[k].title);
    expect(new Set(titles).size).toBe(KINDS.length);
  });
  it('title/detail props override the default copy', () => {
    const { container } = render(<ProviderErrorState kind="auth" title="T" detail="D" />);
    expect(container.querySelector('[data-ag-part="error-title"]')!.textContent).toBe('T');
    expect(container.querySelector('[data-ag-part="error-detail"]')!.textContent).toBe('D');
  });
  it('REQ-SURF-127: Retry is the CMP Button (part retry, no leaked inner parts)', () => {
    const { container } = render(<ProviderErrorState kind="network" onRetry={() => {}} />);
    const btn = screen.getByRole('button', { name: 'Retry' });
    expect(btn.getAttribute('data-ag-part')).toBe('retry');
    expect(btn.classList.contains('ag-button')).toBe(true);
    expect(btn.getAttribute('data-ag-size')).toBe('sm');
    const parts = [...container.querySelectorAll('[data-ag-part]')].map((e) => e.getAttribute('data-ag-part'));
    expect(parts.filter((p) => ['hit-area', 'label', 'spinner', 'root'].includes(p!))).toEqual([]);
  });
  it('REQ-SURF-127: onRetry is not called while the countdown disables Retry, and is once enabled', () => {
    jest.useFakeTimers();
    const onRetry = jest.fn();
    render(<ProviderErrorState kind="rate-limit" retryAfterMs={2000} onRetry={onRetry} />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    act(() => { jest.advanceTimersByTime(1000); });
    expect(btn.textContent).toContain('1');
    fireEvent.click(btn);
    expect(onRetry).not.toHaveBeenCalled();
    act(() => { jest.advanceTimersByTime(1000); });
    expect((btn as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(btn);
    expect(onRetry).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
  it('no Retry button without onRetry', () => {
    render(<ProviderErrorState kind="network" />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
