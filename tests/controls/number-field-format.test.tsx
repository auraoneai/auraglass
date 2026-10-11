/** CMP-159 (REQ-CMP-76): locale-aware number entry — BU's parser is the one
    parser: de-DE "1.234,5" -> onValueChange(1234.5), blur normalises, out-of-
    range clamps to max, invalid restores the last valid value. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { NumberField } from '../../src/components/number-field';

describe('NumberField locale format (de-DE)', () => {
  it('typing "1.234,5" calls onValueChange with exactly 1234.5', () => {
    const spy = jest.fn();
    render(<NumberField label="n" locale="de-DE" onValueChange={spy} />);
    const input = screen.getByRole('textbox', { name: 'n' });
    fireEvent.change(input, { target: { value: '1.234,5' } });
    fireEvent.blur(input);
    expect(spy.mock.calls.at(-1)?.[0]).toBe(1234.5);
  });

  it('blur leaves the normalised "1.234,5" in the input', () => {
    render(<NumberField label="n" locale="de-DE" />);
    const input = screen.getByRole('textbox', { name: 'n' }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '1.234,5' } });
    fireEvent.blur(input);
    expect(input.value).toBe('1.234,5');
  });

  it('typing 99 with max 10 shows "10" after blur', () => {
    render(<NumberField label="n" defaultValue={5} min={0} max={10} />);
    const input = screen.getByRole('textbox', { name: 'n' }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.blur(input);
    expect(input.value).toBe('10');
  });

  it('invalid text restores the last valid value on blur', () => {
    render(<NumberField label="n" defaultValue={7} />);
    const input = screen.getByRole('textbox', { name: 'n' }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.blur(input);
    expect(input.value).toBe('7');
  });
});
