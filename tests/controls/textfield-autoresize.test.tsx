/* REQ-CMP-60: autoResize fallback when field-sizing unsupported + controlled
   showCount derives from value. jsdom has no CSS.supports -> the manual
   scrollHeight fallback path is the one under test. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import { TextField } from '../../src/components/text-field';

describe('TextField REQ-CMP-60', () => {
  it('manual fallback sets an explicit capped height on input', () => {
    const { container } = render(
      <TextField aria-label="t" multiline autoResize maxRows={3} />,
    );
    const ta = container.querySelector('textarea')!;
    fireEvent.change(ta, { target: { value: 'line\nline\nline\nline' } });
    expect(ta.style.height).not.toBe('');
    expect(ta.style.maxBlockSize).toContain('calc(var(--ag-type-body-leading) * 3)');
  });

  it('capped growth: the fallback height never exceeds maxRows line-heights', () => {
    const sh = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight');
    const gcs = window.getComputedStyle;
    // 10 lines of 20px content; line-height 20px; maxRows 3 -> 60px cap
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, get() { return 200; } });
    window.getComputedStyle = ((el: Element) => {
      const real = gcs(el);
      return new Proxy(real, { get: (t, k) => (k === 'lineHeight' ? '20px' : Reflect.get(t, k)) });
    }) as typeof window.getComputedStyle;
    try {
      const { container } = render(<TextField aria-label="t" multiline autoResize maxRows={3} />);
      const ta = container.querySelector('textarea')!;
      fireEvent.change(ta, { target: { value: Array.from({ length: 10 }, () => 'line').join('\n') } });
      expect(ta.style.height).toBe('60px');
      expect(ta.style.overflowY).toBe('auto');
    } finally {
      window.getComputedStyle = gcs;
      if (sh) Object.defineProperty(HTMLElement.prototype, 'scrollHeight', sh);
    }
  });

  it('validationMode defaults to onBlur: blur runs validate() with no validationMode prop', async () => {
    const validate = jest.fn((v: unknown) => (v === '' ? 'Required' : null));
    const { container } = render(<TextField label="Name" defaultValue="" validate={validate} />);
    const input = container.querySelector('input')!;
    act(() => { input.focus(); });
    expect(validate).not.toHaveBeenCalled();
    act(() => { input.blur(); });
    await act(async () => {});
    expect(validate).toHaveBeenCalled();
    expect(container.querySelector('[data-ag-part="root"]')!.hasAttribute('data-invalid')).toBe(true);
  });

  it('controlled counter derives from value prop', () => {
    const { container, rerender } = render(
      <TextField aria-label="t" value="ab" showCount onValueChange={() => {}} />,
    );
    expect(container.querySelector("[data-ag-part='counter']")?.textContent).toBe('2');
    rerender(<TextField aria-label="t" value="abcd" showCount onValueChange={() => {}} />);
    expect(container.querySelector("[data-ag-part='counter']")?.textContent).toBe('4');
  });
});
