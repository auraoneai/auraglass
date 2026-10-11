import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IconButton } from './index';

const X = <svg data-testid="x" />;

describe('IconButton', () => {
  it('renders an ag-icon-button with parts root>icon only', () => {
    render(<IconButton label="Close" icon={X} />);
    const btn = screen.getByRole('button', { name: 'Close' });
    expect(btn).toHaveClass('ag-icon-button');
    expect(btn.querySelector('[data-ag-part="icon"]')).not.toBeNull();
    expect(btn.querySelector('[data-ag-part="label"]')).toBeNull();
  });


  it('emits data-ag-size for square sizing; no label part ever renders (REQ-CMP-36)', () => {
    const { rerender } = render(<IconButton label="x" icon={X} size="sm" />);
    expect(screen.getByRole('button').getAttribute('data-ag-size')).toBe('sm');
    expect(document.querySelector('[data-ag-part="label"]')).toBeNull();
    rerender(<IconButton label="x" icon={X} size="lg" />);
    expect(screen.getByRole('button').getAttribute('data-ag-size')).toBe('lg');
  });

  it('dev console.error on empty label', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<IconButton label="" icon={X} />);
    expect(spy.mock.calls.some((c) => String(c[0]).includes('IconButton'))).toBe(true);
    spy.mockRestore();
  });

  it('shape=fixed emits data-ag-shape, capsule (default) does not', () => {
    const { rerender } = render(<IconButton label="x" icon={X} />);
    expect(screen.getByRole('button').getAttribute('data-ag-shape')).toBeNull();
    rerender(<IconButton label="x" icon={X} shape="fixed" />);
    expect(screen.getByRole('button').getAttribute('data-ag-shape')).toBe('fixed');
  });

  it('forwards pressed toggle behavior from Button internals', () => {
    const onPressedChange = jest.fn();
    render(<IconButton label="Pin" icon={X} pressed={false} onPressedChange={onPressedChange} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onPressedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('accepts ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<IconButton label="x" icon={X} ref={ref} />);
    expect(ref.current?.tagName).toBe('BUTTON');
  });
});
