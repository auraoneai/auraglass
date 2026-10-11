import { describe, expect, it, jest, beforeAll } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SegmentedControl } from './index';

/* jsdom lacks PointerEvent; Base UI radio dispatches one on click. */
beforeAll(() => {
  if (typeof window !== 'undefined' && !('PointerEvent' in window)) {
    (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
  }
});

const Items = () => (
  <>
    <SegmentedControl.Item value="list">List</SegmentedControl.Item>
    <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
    <SegmentedControl.Item value="map">Map</SegmentedControl.Item>
  </>
);

describe('SegmentedControl', () => {
  it('renders radiogroup semantics with parts', () => {
    render(
      <SegmentedControl.Root aria-label="View" name="view" defaultValue="list">
        <Items />
      </SegmentedControl.Root>,
    );
    const group = screen.getByRole('radiogroup', { name: 'View' });
    expect(group.getAttribute('data-ag-part')).toBe('root');
    expect(group.querySelector('[data-ag-part="indicator"]')).not.toBeNull();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(group.querySelectorAll('[data-ag-part="item-label"]')).toHaveLength(3);
  });

  it('single-select: choosing an item checks it and calls onValueChange', () => {
    const onValueChange = jest.fn();
    render(
      <SegmentedControl.Root aria-label="View" name="view" onValueChange={onValueChange}>
        <Items />
      </SegmentedControl.Root>,
    );
    const grid = screen.getByRole('radio', { name: 'Grid' });
    fireEvent.click(grid);
    expect(onValueChange).toHaveBeenCalledWith('grid', expect.anything());
  });

  it('defaultValue checks the initial item', () => {
    render(
      <SegmentedControl.Root aria-label="View" name="view" defaultValue="map">
        <Items />
      </SegmentedControl.Root>,
    );
    expect(screen.getByRole('radio', { name: 'Map' })).toHaveAttribute('aria-checked', 'true');
  });

  it('disabled item cannot be selected', () => {
    const onValueChange = jest.fn();
    render(
      <SegmentedControl.Root aria-label="View" name="view" onValueChange={onValueChange}>
        <SegmentedControl.Item value="a" disabled>A</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'A' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('size emits data-ag-size', () => {
    render(
      <SegmentedControl.Root aria-label="View" name="view" size="sm">
        <Items />
      </SegmentedControl.Root>,
    );
    expect(screen.getByRole('radiogroup').getAttribute('data-ag-size')).toBe('sm');
  });

  it('orientation=vertical emits data-orientation; indicator suppressed when supplied (REQ-CMP-41)', () => {
    const { container } = render(
      <SegmentedControl.Root aria-label="View" name="v" orientation="vertical" defaultValue="a">
        <SegmentedControl.Indicator className="custom-ind">!</SegmentedControl.Indicator>
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    expect(container.querySelector('[data-orientation="vertical"]')).not.toBeNull();
    const inds = container.querySelectorAll('[data-ag-part="indicator"]');
    expect(inds.length).toBe(1);
    expect(inds[0]?.classList.contains('custom-ind')).toBe(true);
  });
});

describe('REQ-CMP-44', () => {
  it('auto title from string children when no title given', () => {
    render(
      <SegmentedControl.Root aria-label="v" name="v" defaultValue="a">
        <SegmentedControl.Item value="a">Alpha</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    expect(screen.getByRole('radio', { name: 'Alpha' })).toHaveAttribute('title', 'Alpha');
  });

  it('warns once when >5 items at ≤390px (mocked RO)', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    class RO {
      cb: ResizeObserverCallback;
      constructor(cb: ResizeObserverCallback) { this.cb = cb; }
      observe(el: Element) {
        this.cb([{ contentRect: { width: 390 } } as ResizeObserverEntry], this as unknown as ResizeObserver);
      }
      unobserve() {}
      disconnect() {}
    }
    const prev = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = RO;
    try {
      render(
        <SegmentedControl.Root aria-label="v" name="v" defaultValue="a">
          {['a','b','c','d','e','f'].map((v) => (
            <SegmentedControl.Item key={v} value={v}>{v}</SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>,
      );
      const calls = warn.mock.calls.filter((c) => String(c[0]).includes('prefer Select'));
      expect(calls).toHaveLength(1);
    } finally {
      (globalThis as { ResizeObserver?: unknown }).ResizeObserver = prev;
      warn.mockRestore();
    }
  });
});
