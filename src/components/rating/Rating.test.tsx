/* CMP-316: Rating — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { Rating } from './index';

describe('Rating', () => {
  it('renders role=radiogroup with radio items', () => {
    const { container } = render(<Rating value={2} />);
    expect(container.querySelector('[role="radiogroup"]')).not.toBeNull();
    expect(container.querySelectorAll('[role="radio"]').length).toBe(5);
  });
  it('filled items carry data-state=on', () => {
    const { container } = render(<Rating value={3} />);
    const items = container.querySelectorAll('[data-ag-part="item"]');
    expect(items[0]!.getAttribute('data-state')).toBe('on');
    expect(items[2]!.getAttribute('data-state')).toBe('on');
    expect(items[3]!.getAttribute('data-state')).toBe('off');
  });
  it('Arrow keys move the value; Home/End jump to bounds', () => {
    const seen: number[] = [];
    const { container } = render(<Rating defaultValue={2} onValueChange={(v: number) => seen.push(v)} />);
    const root = container.querySelector('[data-ag-part="root"]')!;
    fireEvent.keyDown(root, { key: 'ArrowRight' });
    expect(seen[0]).toBe(3);
    fireEvent.keyDown(root, { key: 'End' });
    expect(seen[seen.length - 1]).toBe(5);
    fireEvent.keyDown(root, { key: 'Home' });
    expect(seen[seen.length - 1]).toBe(1);
  });
  it('readOnly sets aria-readonly and blocks interaction', () => {
    const seen: number[] = [];
    const { container } = render(<Rating value={2} readOnly onValueChange={(v: number) => seen.push(v)} />);
    const root = container.querySelector('[data-ag-part="root"]')!;
    expect(root.getAttribute('aria-readonly')).toBe('true');
    fireEvent.keyDown(root, { key: 'ArrowRight' });
    expect(seen.length).toBe(0);
  });
  it('RTL flips ArrowRight/ArrowLeft', () => {
    const seen: number[] = [];
    const { container } = render(
      <div dir="rtl"><Rating defaultValue={3} onValueChange={(v: number) => seen.push(v)} /></div>,
    );
    const root = container.querySelector('[data-ag-part="root"]')!;
    fireEvent.keyDown(root, { key: 'ArrowRight' });
    expect(seen[0]).toBe(2);
  });
});
