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
      <SegmentedControl.Root aria-label="View" defaultValue="list">
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
      <SegmentedControl.Root aria-label="View" onValueChange={onValueChange}>
        <Items />
      </SegmentedControl.Root>,
    );
    const grid = screen.getByRole('radio', { name: 'Grid' });
    fireEvent.click(grid);
    expect(onValueChange).toHaveBeenCalledWith('grid', expect.anything());
  });

  it('defaultValue checks the initial item', () => {
    render(
      <SegmentedControl.Root aria-label="View" defaultValue="map">
        <Items />
      </SegmentedControl.Root>,
    );
    expect(screen.getByRole('radio', { name: 'Map' })).toHaveAttribute('aria-checked', 'true');
  });

  it('disabled item cannot be selected', () => {
    const onValueChange = jest.fn();
    render(
      <SegmentedControl.Root aria-label="View" onValueChange={onValueChange}>
        <SegmentedControl.Item value="a" disabled>A</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'A' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('size emits data-ag-size', () => {
    render(
      <SegmentedControl.Root aria-label="View" size="sm">
        <Items />
      </SegmentedControl.Root>,
    );
    expect(screen.getByRole('radiogroup').getAttribute('data-ag-size')).toBe('sm');
  });
});
