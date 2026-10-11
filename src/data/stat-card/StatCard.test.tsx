/** @jest-environment jsdom */
// SURF-178: locales, trend x direction matrix, link card, sparkline, loading.
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { StatCard } from './StatCard';

describe('StatCard (SURF-176, REQ-SURF-90)', () => {
  it('renders label + formatted value, labelled article', () => {
    const { container } = render(<StatCard label="Revenue" value={1234567.89} locale="de-DE" />);
    const article = container.querySelector('article')!;
    expect(article.getAttribute('aria-labelledby')).toBeTruthy();
    expect(container.textContent).toContain('1.234.567,89');
  });

  it('delta: up-is-good=success, down-is-good flips intent', () => {
    const { container: up } = render(
      <StatCard label="M" value={1} delta={0.125} trendDirection="up-is-good" />,
    );
    expect(up.querySelector('[data-ag-part="stat-card-delta"]')!.getAttribute('data-ag-intent')).toBe('success');
    const { container: down } = render(
      <StatCard label="M" value={1} delta={0.125} trendDirection="down-is-good" />,
    );
    expect(down.querySelector('[data-ag-part="stat-card-delta"]')!.getAttribute('data-ag-intent')).toBe('danger');
    expect(up.querySelector('.ag-visually-hidden')!.textContent).toContain('vs previous period');
  });

  it('href turns the whole card into one link', () => {
    const { container } = render(<StatCard label="L" value={1} href="/x" />);
    const a = container.querySelector('a[href="/x"]')!;
    expect(a.getAttribute('data-ag-part')).toBe('stat-card');
    expect(container.querySelector('article')).toBeNull();
  });

  it('sparkline renders aria-hidden svg', () => {
    const { container } = render(<StatCard label="S" value={1} sparkline={[1, 2, 3]} />);
    expect(container.querySelector('[data-ag-part="stat-card-sparkline"] svg')).toBeTruthy();
  });

  it('loading masks the value', () => {
    const { container } = render(<StatCard label="L" value={42} loading />);
    expect(container.querySelector('[data-ag-part="stat-card-value"]')!.getAttribute('data-state')).toBe('loading');
  });
});
