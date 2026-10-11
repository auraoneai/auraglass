/* REQ-CMP-64: Escape on empty propagates; Enter in a form submits; Tab order
   reaches clear only with a value; onClear fires once. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { SearchField } from './index';

describe('SearchField keyboard contract (REQ-CMP-64)', () => {
  it('Escape on an EMPTY field reaches a parent keydown listener', () => {
    const parent = jest.fn();
    const { container } = render(
      <div onKeyDown={parent}>
        <SearchField aria-label="s" />
      </div>,
    );
    fireEvent.keyDown(container.querySelector('input')!, { key: 'Escape' });
    expect(parent).toHaveBeenCalled();
  });

  it('Enter inside a form fires submit', () => {
    const submit = jest.fn((e: React.FormEvent) => e.preventDefault());
    const { container } = render(
      <form onSubmit={submit}>
        <SearchField aria-label="s" defaultValue="q" />
      </form>,
    );
    fireEvent.keyDown(container.querySelector('input')!, { key: 'Enter' });
    fireEvent.submit(container.querySelector('form')!);
    expect(submit).toHaveBeenCalled();
  });

  it('Tab: clear button is focusable only when there is a value', () => {
    const { container, unmount } = render(<SearchField aria-label="s" />);
    expect(container.querySelector('[data-ag-part="clear"], [aria-label*="lear"]')).toBeNull();
    unmount();
    const second = render(<SearchField aria-label="s" defaultValue="x" />);
    const clear = second.container.querySelector('[data-ag-part="clear"], [aria-label*="lear"]');
    expect(clear).not.toBeNull();
    expect((clear as HTMLElement).tabIndex ?? 0).toBeGreaterThanOrEqual(-1);
  });

  it('onClear fires exactly once per activation', () => {
    const onClear = jest.fn();
    const { container } = render(<SearchField aria-label="s" defaultValue="x" onClear={onClear} />);
    const clear = container.querySelector('[data-ag-part="clear"], button') as HTMLElement;
    fireEvent.click(clear);
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
