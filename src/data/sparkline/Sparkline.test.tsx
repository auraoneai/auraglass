/** @jest-environment jsdom */
// SURF-174: label summary, variants, degenerate cases.
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Sparkline } from './Sparkline';

describe('Sparkline (SURF-173, REQ-SURF-91)', () => {
  it('aria-label carries the data summary', () => {
    const { container } = render(<Sparkline data={[1, 5, 3, 9]} label="Trend" />);
    const label = container.querySelector('svg')!.getAttribute('aria-label')!;
    expect(label).toContain('Trend');
    expect(label).toContain('4 points');
    expect(label).toContain('low 1');
    expect(label).toContain('high 9');
  });

  it('empty data renders "no data"', () => {
    const { container } = render(<Sparkline data={[]} label="T" />);
    expect(container.querySelector('svg')!.getAttribute('aria-label')).toBe('T: no data');
  });

  it('one point renders a dot, all-equal renders a mid line', () => {
    const { container: one } = render(<Sparkline data={[5]} label="T" />);
    expect(one.querySelectorAll('circle').length).toBe(1);
    const { container: flat } = render(<Sparkline data={[3, 3, 3]} label="T" />);
    const path = flat.querySelector('path')!.getAttribute('d')!;
    const ys = path.match(/,([\d.]+)/g)!;
    expect(new Set(ys).size).toBe(1);
  });

  it('NaN/Infinity become gaps with a dev warning', () => {
    const prev = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Sparkline data={[1, 2, Number.NaN, 4, 5]} label="T" />);
    expect(warn).toHaveBeenCalled();
    expect(container.querySelectorAll('path').length).toBe(2);
    warn.mockRestore();
    process.env['NODE_ENV'] = prev;
  });

  it('bar and area variants render', () => {
    const { container: bar } = render(<Sparkline data={[1, 2, 3]} label="T" variant="bar" />);
    expect(bar.querySelectorAll('rect').length).toBe(3);
    const { container: area } = render(<Sparkline data={[1, 2, 3]} label="T" variant="area" />);
    expect(area.querySelectorAll('.ag-sparkline__area').length).toBe(1);
  });
});
