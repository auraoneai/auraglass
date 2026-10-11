/* REQ-CMP-62: 0 onValueChange between compositionstart/end, exactly 1 after;
   Enter while composing is prevented (no submit). */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TextField } from '../../src/components/text-field';

describe('TextField IME composition (REQ-CMP-62)', () => {
  it('0 calls during composition, 1 final call after compositionend', () => {
    const spy = jest.fn();
    const { container } = render(<TextField aria-label="t" onValueChange={spy} />);
    const input = container.querySelector('input')!;
    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: 'に' } });
    fireEvent.change(input, { target: { value: 'にほ' } });
    expect(spy).not.toHaveBeenCalled();
    fireEvent.compositionEnd(input);
    expect(spy).toHaveBeenCalledTimes(1); /* single flush with latest value */
    expect(spy.mock.calls[0][0]).toBe('にほ');
    fireEvent.change(input, { target: { value: 'にほん' } });
    expect(spy).toHaveBeenCalledTimes(2); /* normal forwarding resumes */
  });

  it('Enter during composition is preventDefaulted', () => {
    const { container } = render(<TextField aria-label="t" />);
    const input = container.querySelector('input')!;
    fireEvent.compositionStart(input);
    const ev = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    Object.defineProperty(ev, 'isComposing', { value: true });
    Object.defineProperty(ev, 'keyCode', { value: 229 });
    const allowed = input.dispatchEvent(ev);
    expect(allowed).toBe(false); /* preventDefault called */
    fireEvent.compositionEnd(input);
  });
});
