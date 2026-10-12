/* REQ-CMP-64: Escape on a non-empty field clears it and stops there; on an
   empty field it propagates; Enter in a form submits through the browser's
   implicit submission; Tab reaches the clear button only with a value;
   onClear fires once. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchField } from './index';

const clearButton = (root: ParentNode) => root.querySelector<HTMLElement>('[data-ag-part="clear"]');

describe('SearchField keyboard contract (REQ-CMP-64)', () => {
  it('Escape on an EMPTY field reaches a parent keydown listener', () => {
    const parent = jest.fn();
    const { container } = render(
      <div onKeyDown={parent}>
        <SearchField aria-label="s" />
      </div>,
    );
    fireEvent.keyDown(container.querySelector('input')!, { key: 'Escape' });
    expect(parent).toHaveBeenCalledTimes(1);
  });

  it('Escape on a NON-EMPTY field clears it and does not reach a parent listener', async () => {
    const parent = jest.fn();
    const onClear = jest.fn();
    const { container } = render(
      <div onKeyDown={(e) => { if (e.key === 'Escape') parent(); }}>
        <SearchField aria-label="s" defaultValue="query" onClear={onClear} />
      </div>,
    );
    const input = container.querySelector('input')!;
    input.focus();
    await userEvent.keyboard('{Escape}');
    expect(input.value).toBe('');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(parent).not.toHaveBeenCalled();
    // now empty: the next Escape propagates
    await userEvent.keyboard('{Escape}');
    expect(parent).toHaveBeenCalledTimes(1);
  });

  it('Enter inside a form submits through implicit submission', async () => {
    const submit = jest.fn((e: React.FormEvent) => e.preventDefault());
    const { container } = render(
      <form onSubmit={submit}>
        <SearchField aria-label="s" defaultValue="q" />
        <button type="submit">Go</button>
      </form>,
    );
    await userEvent.type(container.querySelector('input')!, '{Enter}');
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('Tab from the input reaches the clear button only when there is a value', async () => {
    const empty = render(
      <>
        <SearchField aria-label="empty" />
        <button type="button">next</button>
      </>,
    );
    expect(clearButton(empty.container)).toBeNull();
    empty.container.querySelector('input')!.focus();
    await userEvent.tab();
    expect(document.activeElement).toBe(empty.getByText('next'));
    empty.unmount();

    const filled = render(
      <>
        <SearchField aria-label="filled" defaultValue="x" />
        <button type="button">next</button>
      </>,
    );
    const clear = clearButton(filled.container);
    expect(clear).not.toBeNull();
    filled.container.querySelector('input')!.focus();
    await userEvent.tab();
    expect(document.activeElement).toBe(clear);
    await userEvent.tab();
    expect(document.activeElement).toBe(filled.getByText('next'));
  });

  it('onClear fires exactly once per activation', () => {
    const onClear = jest.fn();
    const { container } = render(<SearchField aria-label="s" defaultValue="x" onClear={onClear} />);
    fireEvent.click(clearButton(container)!);
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
