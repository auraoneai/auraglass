/** @jest-environment jsdom */
// SURF-163: separator ARIA + keyboard resize.
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { Table } from './Table';
import type { TableColumnDef } from './types';

const DATA = [{ id: 'a', name: 'x' }];
const COLS: TableColumnDef<(typeof DATA)[number]>[] = [{ accessorKey: 'name', header: 'Name' }];

beforeEach(() => {
  delete (document as { dir?: string }).dir;
});

describe('Table resize (SURF-163, REQ-SURF-71)', () => {
  function sep(container: HTMLElement) {
    return container.querySelector('[role="separator"]') as HTMLElement;
  }

  it('separator carries the full ARIA contract', () => {
    const { container } = render(<Table data={DATA} columns={COLS} caption="t" enableColumnResizing />);
    const s = sep(container);
    expect(s.getAttribute('aria-orientation')).toBe('vertical');
    expect(s.getAttribute('aria-valuemin')).toBe('48');
    expect(s.getAttribute('aria-valuemax')).toBe('800');
    expect(s.getAttribute('aria-label')).toMatch(/name/i);
    expect(s.tabIndex).toBe(0);
  });

  it('ArrowRight grows by 8, Shift+ArrowRight by 32', () => {
    const { container } = render(<Table data={DATA} columns={COLS} caption="t" enableColumnResizing />);
    const s = sep(container);
    const start = Number(s.getAttribute('aria-valuenow'));
    fireEvent.keyDown(s, { key: 'ArrowRight' });
    expect(Number(sep(container).getAttribute('aria-valuenow'))).toBe(start + 8);
    fireEvent.keyDown(s, { key: 'ArrowRight', shiftKey: true });
    expect(Number(sep(container).getAttribute('aria-valuenow'))).toBe(start + 8 + 32);
    fireEvent.keyDown(s, { key: 'ArrowLeft', shiftKey: true });
    expect(Number(sep(container).getAttribute('aria-valuenow'))).toBe(start + 8);
  });

  it('RTL: ArrowLeft grows', () => {
    (document as { dir?: string }).dir = 'rtl';
    const { container } = render(<Table data={DATA} columns={COLS} caption="t" enableColumnResizing />);
    const s = sep(container);
    const start = Number(s.getAttribute('aria-valuenow'));
    fireEvent.keyDown(s, { key: 'ArrowLeft' });
    expect(Number(sep(container).getAttribute('aria-valuenow'))).toBe(start + 8);
  });

  it('Home/End snap to min/max', () => {
    const { container } = render(<Table data={DATA} columns={COLS} caption="t" enableColumnResizing />);
    const s = sep(container);
    fireEvent.keyDown(s, { key: 'End' });
    expect(Number(sep(container).getAttribute('aria-valuenow'))).toBe(800);
    fireEvent.keyDown(s, { key: 'Home' });
    expect(Number(sep(container).getAttribute('aria-valuenow'))).toBe(48);
  });
});
