/* MAT-148 — useMaterialTier: server snapshot standard, html attr changes
   re-render, unknown values resolve to standard, observer disconnects on last
   unmount. */
import { describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { act, render } from '@testing-library/react';
import { useMaterialTier } from '../useMaterialTier';

const Probe = () => {
  const tier = useMaterialTier();
  return <div data-testid="tier">{tier}</div>;
};

describe('useMaterialTier', () => {
  it('returns standard by default', () => {
    const { getByTestId } = render(<Probe />);
    expect(getByTestId('tier').textContent).toBe('standard');
  });

  it('re-renders when <html data-ag-tier> changes', async () => {
    const { getByTestId } = render(<Probe />);
    // MutationObserver delivers on the microtask queue
    await act(async () => {
      document.documentElement.setAttribute('data-ag-tier', 'enhanced');
      await Promise.resolve();
    });
    expect(getByTestId('tier').textContent).toBe('enhanced');
    await act(async () => {
      document.documentElement.removeAttribute('data-ag-tier');
      await Promise.resolve();
    });
    expect(getByTestId('tier').textContent).toBe('standard');
  });

  it('unknown values resolve to standard', async () => {
    const { getByTestId } = render(<Probe />);
    await act(async () => {
      document.documentElement.setAttribute('data-ag-tier', 'cinematic');
      await Promise.resolve();
    });
    expect(getByTestId('tier').textContent).toBe('standard');
    document.documentElement.removeAttribute('data-ag-tier');
  });

  it('disconnects the observer after the last unmount', () => {
    const spy = jest.spyOn(MutationObserver.prototype, 'disconnect');
    const a = render(<Probe />);
    const b = render(<Probe />);
    a.unmount();
    expect(spy).not.toHaveBeenCalled();
    b.unmount();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
