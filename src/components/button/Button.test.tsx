/** jsdom family suite for Button — real Base UI, no @base-ui mocks. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './index';

describe('Button', () => {
  it('renders with ag-button class and parts', () => {
    render(<Button startIcon={<svg data-testid="s" />} endIcon={<svg data-testid="e" />}>Save</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('ag-button');
    expect(btn.getAttribute('data-ag-part')).toBe('root');
    expect(btn.getAttribute('data-ag-interactive')).toBe('');
    expect(btn.getAttribute('data-size-class')).toBe('control');
    expect(btn.querySelector('[data-ag-part="label"]')?.textContent).toBe('Save');
    expect(btn.querySelectorAll('[data-ag-part="icon"]')).toHaveLength(2);
  });

  it('type defaults to button', () => {
    render(<Button>ok</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('loading blocks onClick, sets aria-busy, keeps label mounted', () => {
    const onClick = jest.fn();
    render(<Button loading onClick={onClick}>Save</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn.querySelector('[data-ag-part="label"]')).not.toBeNull();
    expect(btn.querySelector('[data-ag-part="spinner"]')).not.toBeNull();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('accessible name is unchanged while loading', () => {
    render(<Button loading>Save draft</Button>);
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeTruthy();
  });

  it('pressed toggle flips aria-pressed and calls onPressedChange(true, details)', () => {
    const onPressedChange = jest.fn();
    render(<Button pressed={false} onPressedChange={onPressedChange}>Pin</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(btn);
    expect(onPressedChange).toHaveBeenCalledWith(true, expect.objectContaining({ reason: expect.anything() }));
  });

  it('uncontrolled defaultPressed works', () => {
    render(<Button defaultPressed>Mute</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('render={<a>} renders an anchor keeping the ag-button class', () => {
    render(<Button render={<a href="/x" />}>Go</Button>);
    const a = screen.getByRole('link');
    expect(a.tagName).toBe('A');
    expect(a).toHaveClass('ag-button');
    expect(a).toHaveAttribute('href', '/x');
  });

  it('second prominent button in one view logs exactly one dev warning', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <div>
        <Button prominent>One</Button>
        <Button prominent>Two</Button>
      </div>,
    );
    expect(spy.mock.calls.filter((c) => String(c[0]).includes('prominent'))).toHaveLength(1);
    spy.mockRestore();
  });

  it('intent="danger" sets data-ag-intent and leaves data-ag-variant unchanged', () => {
    render(<Button intent="danger">Delete</Button>);
    const btn = screen.getByRole('button');
    expect(btn.getAttribute('data-ag-intent')).toBe('danger');
    expect(btn.getAttribute('data-ag-variant')).toBe('regular');
  });

  /* REQ-CMP-34: every non-neutral S-30 intent is emitted (material attributes
     unchanged); neutral omits the attribute. */
  it.each(['info', 'success', 'warning', 'danger'] as const)('intent="%s" emits data-ag-intent and keeps the chrome material', (intent) => {
    render(<Button intent={intent}>Act</Button>);
    const btn = screen.getByRole('button');
    expect(btn.getAttribute('data-ag-intent')).toBe(intent);
    expect(btn.getAttribute('data-ag-layer')).toBe('chrome');
    expect(btn.getAttribute('data-ag-thickness')).toBe('thin');
    expect(btn.getAttribute('data-ag-variant')).toBe('regular');
  });

  it('intent="neutral" (and no intent) omits data-ag-intent', () => {
    render(<><Button intent="neutral">A</Button><Button>B</Button></>);
    for (const btn of screen.getAllByRole('button')) expect(btn.hasAttribute('data-ag-intent')).toBe(false);
  });

  it('Button.css tints text, rim and specular for each non-neutral intent', () => {
    const css = require('node:fs').readFileSync(require('node:path').join(__dirname, 'Button.css'), 'utf8') as string;
    for (const intent of ['info', 'success', 'warning', 'danger']) {
      // the per-intent one-line rule (not the shared grouped selector list)
      const rule = new RegExp(`\\.ag-button\\[data-ag-intent='${intent}'\\] \\{ (color:[^}]*)\\}`, 'u').exec(css)?.[1] ?? '';
      expect(rule).toContain(`color: var(--ag-color-${intent})`);
      expect(rule).toContain(`--ag-color-specular: var(--ag-color-${intent})`);
    }
    expect(css).toMatch(/--ag-surface-rim: currentColor/u);
    expect(css).not.toMatch(/data-ag-intent='neutral'/u);
  });

  /* REQ-CMP-35: keyboard activation — Enter and Space each fire one click,
     and a toggle Button flips aria-pressed on each. */
  it('Enter and Space each activate once; a toggle flips aria-pressed on each', async () => {
    const onClick = jest.fn();
    const onPressedChange = jest.fn();
    render(<><Button onClick={onClick}>Go</Button><Button defaultPressed onPressedChange={onPressedChange}>Bold</Button></>);
    const [go, bold] = screen.getAllByRole('button') as [HTMLElement, HTMLElement];
    go.focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
    bold.focus();
    expect(bold.getAttribute('aria-pressed')).toBe('true');
    await userEvent.keyboard('{Enter}');
    expect(bold.getAttribute('aria-pressed')).toBe('false');
    await userEvent.keyboard(' ');
    expect(bold.getAttribute('aria-pressed')).toBe('true');
    expect(onPressedChange.mock.calls.map((c) => c[0])).toEqual([false, true]);
  });

  it('identity variant emits data-ag-variant=identity', () => {
    render(<Button variant="identity">Ghost</Button>);
    expect(screen.getByRole('button').getAttribute('data-ag-variant')).toBe('identity');
  });

  it('disabled suppresses activation', async () => {
    const onClick = jest.fn();
    render(<Button disabled onClick={onClick}>Nope</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('prominent guard scopes to the nearest chrome surface (REQ-CMP-34)', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      /* two prominent buttons in SEPARATE chrome surfaces -> 0 warnings */
      render(
        <>
          <div data-ag-surface="" data-ag-layer="chrome"><Button prominent>One</Button></div>
          <div data-ag-surface="" data-ag-layer="chrome"><Button prominent>Two</Button></div>
        </>,
      );
      const surfaceWarnings = err.mock.calls.filter((c) => String(c[0]).includes('prominent'));
      expect(surfaceWarnings).toHaveLength(0);
    } finally {
      err.mockRestore();
    }
  });

  it('second prominent button in the SAME chrome surface warns once', async () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      render(
        <div data-ag-surface="" data-ag-layer="chrome">
          <Button prominent>One</Button>
          <Button prominent>Two</Button>
        </div>,
      );
      /* effects flush after render in RTL */
      await new Promise((r) => setTimeout(r, 0));
      const surfaceWarnings = err.mock.calls.filter((c) => String(c[0]).includes('prominent'));
      expect(surfaceWarnings).toHaveLength(1);
    } finally {
      err.mockRestore();
    }
  });

  it('thickness + interactive defaults land on the root (REQ-CMP-34)', () => {
    render(<Button>Attrs</Button>);
    const btn = screen.getByRole('button');
    expect(btn.getAttribute('data-ag-thickness')).toBe('thin');
    expect(btn.getAttribute('data-ag-interactive')).toBe('');
  });

  it('explicit thickness overrides the thin default', () => {
    render(<Button thickness="thick">Attrs</Button>);
    expect(screen.getByRole('button').getAttribute('data-ag-thickness')).toBe('thick');
  });

  it('pointerLight emits data-ag-pointer-light', () => {
    render(<Button pointerLight>Glow</Button>);
    expect(screen.getByRole('button').getAttribute('data-ag-pointer-light')).toBe('');
  });

  it('icon parts carry aria-hidden (REQ-CMP-33)', () => {
    render(<Button startIcon={<svg data-testid="i1" />} endIcon={<svg data-testid="i2" />}>Icons</Button>);
    const icons = document.querySelectorAll('[data-ag-part="icon"]');
    expect(icons.length).toBeGreaterThan(0);
    for (const icon of icons) expect(icon.getAttribute('aria-hidden')).toBe('true');
  });
  it('adding pressed between renders warns once and remounts the root (REQ-CMP-32)', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const { rerender } = render(<Button>Flip</Button>);
      const first = screen.getByRole('button');
      rerender(<Button pressed={false}>Flip</Button>);
      expect(warn.mock.calls.filter((c) => String(c[0]).includes('Button and Toggle'))).toHaveLength(1);
      const second = screen.getByRole('button');
      expect(second).not.toBe(first); // Button -> Toggle remounts the DOM node
      rerender(<Button pressed={true}>Flip</Button>);
      expect(warn.mock.calls.filter((c) => String(c[0]).includes('Button and Toggle'))).toHaveLength(1);
    } finally {
      warn.mockRestore();
    }
  });
});
