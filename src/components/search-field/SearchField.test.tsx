import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SearchField } from './index';
import { materialProps } from '../../material/index';
import { SurfaceGroup } from '../../material/SurfaceGroup';

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

/* REQ-CMP-63: chrome thin capsule shell, no blur inside a SurfaceGroup, and TextField's single-line props. */
describe('SearchField (REQ-CMP-63)', () => {
  const shellOf = (c: HTMLElement) => c.querySelector('[data-ag-part="control-shell"]') as HTMLElement;

  it('the control-shell is a chrome thin surface (materialProps), passing variant and refraction', () => {
    const { container, rerender } = render(<SearchField label="s" />);
    for (const [k, v] of Object.entries(materialProps({ layer: 'chrome', thickness: 'thin' }))) {
      expect({ k, v: shellOf(container).getAttribute(k) }).toEqual({ k, v: String(v) });
    }
    expect(shellOf(container).getAttribute('data-ag-layer')).toBe('chrome');
    rerender(<SearchField label="s" variant="clear" refraction />);
    for (const [k, v] of Object.entries(materialProps({ layer: 'chrome', thickness: 'thin', variant: 'clear', refraction: true }))) {
      expect({ k, v: shellOf(container).getAttribute(k) }).toEqual({ k, v: String(v) });
    }
  });

  it('inside a SurfaceGroup the shell is a nested surface, so the material nesting rule removes its ::before blur', () => {
    const { container } = render(<SurfaceGroup><SearchField label="s" /></SurfaceGroup>);
    const shell = shellOf(container);
    expect(shell.hasAttribute('data-ag-surface')).toBe(true);
    expect(shell.parentElement!.closest('[data-ag-surface]')).not.toBeNull();
    expect(shell.hasAttribute('data-ag-allow-nested')).toBe(false);
    const css = readFileSync(join(process.cwd(), 'src/material/css/material.css'), 'utf8');
    expect(css).toMatch(/:where\(\[data-ag-surface\]\) \[data-ag-surface\]:not\(:where\(\[data-ag-allow-nested\]\)\)::before,[^{]*\{\s*backdrop-filter: none;/); // @ag-literal-allowed: test-vector
  });

  it('start/end adornments render inside the shell around the control', () => {
    const { container } = render(<SearchField label="s" startAdornment={<b>in</b>} endAdornment={<i>scope</i>} />);
    const parts = [...shellOf(container).querySelectorAll('[data-ag-part]')].map((e) => e.getAttribute('data-ag-part'));
    expect(parts.indexOf('adornment-start')).toBeGreaterThan(parts.indexOf('icon'));
    expect(parts.indexOf('adornment-start')).toBeLessThan(parts.indexOf('control'));
    expect(parts.indexOf('adornment-end')).toBeGreaterThan(parts.indexOf('control'));
    expect(container.querySelector('[data-ag-part="adornment-start"]')!.textContent).toBe('in');
    expect(container.querySelector('[data-ag-part="adornment-end"]')!.textContent).toBe('scope');
  });

  it('maxLength reaches the input and showCount renders the counter (uncontrolled and controlled)', async () => {
    const { container, rerender } = render(<SearchField label="s" maxLength={5} showCount />);
    const input = screen.getByRole('searchbox', { name: 's' }) as HTMLInputElement;
    expect(input.maxLength).toBe(5);
    expect(container.querySelector('[data-ag-part="counter"]')!.textContent).toBe('0/5');
    await userEvent.type(input, 'abc');
    expect(container.querySelector('[data-ag-part="counter"]')!.textContent).toBe('3/5');
    rerender(<SearchField label="s" value="ab" onValueChange={() => {}} showCount />);
    expect(container.querySelector('[data-ag-part="counter"]')!.textContent).toBe('2');
    rerender(<SearchField label="s" value="ab" onValueChange={() => {}} />);
    expect(container.querySelector('[data-ag-part="counter"]')).toBeNull();
  });

  it('validate + validationMode run Base UI field validation (onBlur)', async () => {
    const validate = jest.fn((v: unknown) => (String(v).length < 3 ? 'Too short' : null));
    const { container } = render(<SearchField label="s" validate={validate} validationMode="onBlur" />);
    const input = screen.getByRole('searchbox', { name: 's' });
    await userEvent.type(input, 'ab');
    expect(validate).not.toHaveBeenCalled();
    await userEvent.tab();
    expect(validate).toHaveBeenCalled();
    expect(container.querySelector('[data-ag-part="root"]')).toHaveAttribute('data-invalid');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
