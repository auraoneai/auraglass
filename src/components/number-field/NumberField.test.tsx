import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { NumberField, parseNumber, clampValue, formatNumber, snapToStep } from './index';

describe('NumberField (CMP-156)', () => {
  it('renders a spinbutton wired to label and emits parts', () => {
    const { container } = render(<NumberField label="qty" defaultValue={2} min={0} max={10} />);
    expect(screen.getByRole('textbox', { name: 'qty' })).toBeInTheDocument();
    for (const p of ['root', 'group', 'input', 'increment', 'decrement', 'label']) {
      expect(container.querySelector(`[data-ag-part="${p}"]`)).toBeTruthy();
    }
  });

  it('increment/decrement buttons change value within min/max', async () => {
    const spy = jest.fn();
    render(<NumberField label="n" defaultValue={5} max={6} onValueChange={spy} />);
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(spy).toHaveBeenLastCalledWith(6, expect.anything());
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    // clamped at max
    expect(spy).toHaveBeenLastCalledWith(6, expect.anything());
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(spy).toHaveBeenLastCalledWith(5, expect.anything());
  });

  it('ArrowUp/ArrowDown step the value', async () => {
    const spy = jest.fn();
    render(<NumberField label="n" defaultValue={1} step={2} onValueChange={spy} />);
    screen.getByRole('textbox').focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(spy).toHaveBeenLastCalledWith(3, expect.anything());
    await userEvent.keyboard('{ArrowDown}');
    expect(spy).toHaveBeenLastCalledWith(1, expect.anything());
  });
});

describe('parse/clamp/snap utils (CMP-157)', () => {
  it('parses en-US grouped input', () => {
    expect(parseNumber('1,234.56')).toBe(1234.56);
  });
  it('parses de-DE grouped + decimal input', () => {
    expect(parseNumber('1.234,56', 'de-DE')).toBe(1234.56);
    expect(parseNumber('1234,56', 'de-DE')).toBe(1234.56);
    expect(parseNumber('1.234', 'de-DE')).toBe(1234);
  });
  it('rejects junk and empty', () => {
    expect(parseNumber('abc')).toBeNull();
    expect(parseNumber('')).toBeNull();
  });
  it('clamps into range', () => {
    expect(clampValue(15, 0, 10)).toBe(10);
    expect(clampValue(-5, 0, 10)).toBe(0);
    expect(clampValue(5, 0, 10)).toBe(5);
  });
  it('formats by locale', () => {
    expect(formatNumber(1234.5, 'de-DE')).toBe('1.234,5');
  });
  it('snaps to step multiples from min', () => {
    expect(snapToStep(7, 5)).toBe(5);
    expect(snapToStep(8, 5)).toBe(10);
    expect(snapToStep(12, 5, 10)).toBe(10);
  });
  it('REQ-CMP-77: steppers are non-tabbable buttons with labels prop aria-labels', () => {
    const { container } = render(
      <NumberField label="qty" defaultValue={2} labels={{ increase: 'More', decrease: 'Less' }} />,
    );
    const inc = container.querySelector('[data-ag-part="increment"]');
    const dec = container.querySelector('[data-ag-part="decrement"]');
    for (const s of [inc, dec]) {
      expect(s?.tagName).toBe('BUTTON');
      expect(s).toHaveAttribute('tabindex', '-1');
    }
    expect(inc).toHaveAttribute('aria-label', 'More');
    expect(dec).toHaveAttribute('aria-label', 'Less');
  });

});
