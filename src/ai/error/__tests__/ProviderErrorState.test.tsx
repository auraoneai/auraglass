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
    act(() => { jest.advanceTimersByTime(3100); });
    expect((btn as HTMLButtonElement).disabled).toBe(false);
    jest.useRealTimers();
  });
});
