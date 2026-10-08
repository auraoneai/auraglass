import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { SearchField } from './index';

describe('SearchField (CMP-146)', () => {
  it('Escape clears non-empty value and calls onClear + onValueChange', async () => {
    const onClear = jest.fn();
    const onValueChange = jest.fn();
    render(<SearchField label="s" defaultValue="abc" onClear={onClear} onValueChange={onValueChange} />);
    const input = screen.getByRole('searchbox', { name: 's' });
    input.focus();
    await userEvent.keyboard('{Escape}');
    expect(onClear).toHaveBeenCalled();
    expect(onValueChange).toHaveBeenLastCalledWith('', expect.anything());
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('Escape on empty propagates (does not call onClear)', async () => {
    const onClear = jest.fn();
    render(<SearchField label="s" onClear={onClear} />);
    screen.getByRole('searchbox', { name: 's' }).focus();
    await userEvent.keyboard('{Escape}');
    expect(onClear).not.toHaveBeenCalled();
  });

  it('clear button exists only while field has a value', async () => {
    render(<SearchField label="s" />);
    const input = screen.getByRole('searchbox', { name: 's' });
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
    await userEvent.type(input, 'x');
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect((input as HTMLInputElement).value).toBe('');
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });

  it('emits parts incl. icon/control-shell; loading adds spinner + aria-busy', () => {
    const { container, rerender } = render(<SearchField label="s" shortcut="⌘K" />);
    for (const p of ['root', 'control-shell', 'icon', 'control', 'shortcut', 'label']) {
      expect(container.querySelector(`[data-ag-part="${p}"]`)).toBeTruthy();
    }
    rerender(<SearchField label="s" value="v" onValueChange={() => {}} />);
    expect(container.querySelector('[data-ag-part="clear"]')).toBeTruthy();
    rerender(<SearchField label="s" value="v" onValueChange={() => {}} loading />);
    expect(container.querySelector('[data-ag-part="spinner"]')).toBeTruthy();
    expect(container.querySelector('[data-ag-part="root"]')).toHaveAttribute('aria-busy', 'true');
  });
});
