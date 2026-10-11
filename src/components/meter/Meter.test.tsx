/* CMP-312: Meter — generated for lane 3g (T0/T2 components). */
import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Meter } from './index';

describe('Meter', () => {
  it('renders role=meter with label', () => {
    const { container } = render(<Meter value={60} label="Storage" />);
    const el = container.querySelector('[role="meter"]')!;
    expect(el.getAttribute('aria-label')).toBe('Storage');
    expect(container.querySelector('[data-ag-part="track"]')).not.toBeNull();
  });
  it('low/high/optimum derive data-ag-intent', () => {
    const cases: Array<[number, { low?: number; high?: number; optimum?: number }, string]> = [
      [10, { low: 20, high: 80, optimum: 90 }, 'danger'],
      [50, { low: 20, high: 80, optimum: 90 }, 'warning'],
      [90, { low: 20, high: 80, optimum: 90 }, 'success'],
    ];
    for (const [v, opts, intent] of cases) {
      const { container, unmount } = render(<Meter value={v} label="m" {...opts} />);
      expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-ag-intent')).toBe(intent);
      unmount();
    }
  });
  it('missing label logs a dev warning', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Meter value={10} label={undefined as never} />);
    expect(spy.mock.calls.some((c) => String(c[0]).includes('label'))).toBe(true);
    spy.mockRestore();
  });
});
