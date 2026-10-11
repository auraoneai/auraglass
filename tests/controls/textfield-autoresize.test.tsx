/* REQ-CMP-60: autoResize fallback when field-sizing unsupported + controlled
   showCount derives from value. jsdom has no CSS.supports -> the manual
   scrollHeight fallback path is the one under test. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
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

  it('controlled counter derives from value prop', () => {
    const { container, rerender } = render(
      <TextField aria-label="t" value="ab" showCount onValueChange={() => {}} />,
    );
    expect(container.querySelector("[data-ag-part='counter']")?.textContent).toBe('2');
    rerender(<TextField aria-label="t" value="abcd" showCount onValueChange={() => {}} />);
    expect(container.querySelector("[data-ag-part='counter']")?.textContent).toBe('4');
  });
});
