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
    expect(btn.getAttribute('data-ag-size-class')).toBe('control');
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

  it('pointerLight emits data-ag-pointer-light', () => {
    render(<Button pointerLight>Glow</Button>);
    expect(screen.getByRole('button').getAttribute('data-ag-pointer-light')).toBe('');
  });
});
