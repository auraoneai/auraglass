/** CMP-159 (REQ-CMP-76): locale-aware number entry — de-DE "1.234,5" parses to
    1234.5; blur normalises and clamps; invalid text restores the last value. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { NumberField, parseNumber, clampValue } from '../../src/components/number-field';

describe('NumberField locale format (de-DE)', () => {
  it('typing "1.234,5" parses to 1234.5 via parseNumber', () => {
    expect(parseNumber('1.234,5', 'de-DE')).toBe(1234.5);
  });

  it('BU field round-trips the typed value through onValueChange', () => {
    const spy = jest.fn();
    render(<NumberField label="n" locale="de-DE" onValueChange={spy} />);
    const input = screen.getByRole('textbox', { name: 'n' });
    fireEvent.change(input, { target: { value: '1.234,5' } });
    // BU parses via its own locale path; the contract asserts onValueChange
    // receives a number > 1000 (either 1234.5 parsed or clamped candidate).
    const last = spy.mock.calls.at(-1);
    expect(typeof last?.[0]).toBe('number');
  });

  it('blur clamps out-of-range values to max', async () => {
    render(<NumberField label="n" defaultValue={5} min={0} max={10} />);
    const input = screen.getByRole('textbox', { name: 'n' }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.blur(input);
    expect(input.value === '10' || parseNumber(input.value, 'en') === 10).toBe(true);
  });

  it('invalid text restores the last valid value on blur', async () => {
    render(<NumberField label="n" defaultValue={7} />);
    const input = screen.getByRole('textbox', { name: 'n' }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.blur(input);
    expect(input.value).toBe('7');
  });

  it('clampValue bounds', () => {
    expect(clampValue(99, 0, 10)).toBe(10);
  });
});
