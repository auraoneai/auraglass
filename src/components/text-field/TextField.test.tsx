import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { TextField } from './index';

describe('TextField (CMP-139)', () => {
  it('wires label + description + error; error sets invalid', () => {
    render(<TextField label="Email" description="We never share" error="Required" />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(describedBy).toContain(screen.getByText('We never share').id);
    expect(describedBy).toContain(screen.getByText('Required').id);
  });

  it('toggling error never throws and keeps hook order (E-04)', () => {
    const { rerender } = render(<TextField label="x" description="d" />);
    expect(() => {
      rerender(<TextField label="x" description="d" error="bad" />);
      rerender(<TextField label="x" description="d" />);
    }).not.toThrow();
  });

  it('no onChange prop; onValueChange fires with details', async () => {
    const spy = jest.fn();
    render(<TextField label="x" onValueChange={spy} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'x' }), 'hi');
    expect(spy).toHaveBeenCalledWith('h', expect.objectContaining({ reason: expect.any(String) }));
  });

  it('multiline renders a textarea and respects rows', () => {
    render(<TextField label="bio" multiline rows={5} />);
    const area = screen.getByRole('textbox', { name: 'bio' });
    expect(area.tagName).toBe('TEXTAREA');
    expect(area).toHaveAttribute('rows', '5');
  });

  it('emits all declared parts when fully dressed', () => {
    const { container } = render(
      <TextField
        label="L"
        description="D"
        error="E"
        startAdornment={<i />}
        endAdornment={<i />}
        showCount
        maxLength={10}
        defaultValue="hi"
      />,
    );
    for (const p of ['root', 'label', 'control-shell', 'control', 'adornment-start', 'adornment-end', 'description', 'error', 'counter']) {
      expect(container.querySelector(`[data-ag-part="${p}"]`)).toBeTruthy();
    }
  });
});
