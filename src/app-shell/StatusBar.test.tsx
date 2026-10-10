/** @jest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { StatusBar } from './StatusBar';
import { AuraGlassProvider } from '../theme';

const mockAnnounce = jest.fn();
jest.mock('../theme/announcer/useAnnouncer', () => ({
  useAnnouncer: () => ({ announce: mockAnnounce }),
}));

describe('StatusBar (SURF-029)', () => {
  it('renders a sunken content bar in the status slot with no landmark role', () => {
    render(
      <StatusBar.Root>
        <StatusBar.Item>3 items</StatusBar.Item>
        <StatusBar.Item>UTC</StatusBar.Item>
      </StatusBar.Root>,
    );
    const el = document.querySelector('[data-ag-part="status-bar"]')!;
    expect(el).toHaveAttribute('data-ag-slot', 'status');
    expect(el).toHaveAttribute('data-ag-layer', 'content');
    expect(el).toHaveAttribute('data-ag-content', 'content-sunken');
    expect(el.getAttribute('role')).toBeNull();
    expect(screen.getAllByText(/items|UTC/)).toHaveLength(2);
  });


describe('StatusBar.Live announcements (SURF-39)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockAnnounce.mockClear();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not announce on mount; debounces to one call per 1000 ms burst', () => {
    const { container, rerender } = render(
      <AuraGlassProvider>
        <StatusBar.Live message="one">one</StatusBar.Live>
      </AuraGlassProvider>,
    );
    expect(mockAnnounce.mock.calls.length).toBe(0);
    expect(container.querySelector('[aria-live]')).toBeNull();

    rerender(
      <AuraGlassProvider>
        <StatusBar.Live message="two">two</StatusBar.Live>
      </AuraGlassProvider>,
    );
    jest.advanceTimersByTime(500);
    rerender(
      <AuraGlassProvider>
        <StatusBar.Live message="three">three</StatusBar.Live>
      </AuraGlassProvider>,
    );
    jest.advanceTimersByTime(500);
    // only ~1000ms since first change — second change's timer still pending
    jest.advanceTimersByTime(600);
    expect(mockAnnounce.mock.calls.length).toBe(1);
    expect(mockAnnounce.mock.calls[0]).toEqual(['three', { politeness: 'polite' }]);
    expect(container.querySelector('[aria-live]')).toBeNull();
  });
});
});
