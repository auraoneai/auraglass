import { describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Reasoning } from '../Reasoning';

describe('Reasoning', () => {
  it('auto-opens on streaming, label "Thinking…"', () => {
    render(<Reasoning text="hmm" state="streaming" />);
    const t = screen.getByRole('button');
    expect(t.getAttribute('aria-expanded')).toBe('true');
    expect(t.textContent).toBe('Thinking…');
  });
  it('auto-closes once on done; duration label formats seconds', () => {
    const { rerender } = render(<Reasoning text="hmm" state="streaming" />);
    rerender(<Reasoning text="hmm" state="done" durationMs={4200} />);
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByRole('button').textContent).toBe('Thought for 4.2 s');
  });
  it('user toggle during streaming respected (auto-close suppressed on done)', () => {
    const { rerender } = render(<Reasoning text="x" state="streaming" />);
    fireEvent.click(screen.getByRole('button')); // user closes during streaming
    rerender(<Reasoning text="x" state="done" durationMs={10000} />);
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByRole('button').textContent).toBe('Thought for 10 s');
  });
});
