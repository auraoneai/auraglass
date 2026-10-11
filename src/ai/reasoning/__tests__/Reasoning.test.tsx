import { afterEach, describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Reasoning } from '../Reasoning';

afterEach(() => { jest.restoreAllMocks(); });

const trigger = () => screen.getByRole('button');

describe('Reasoning', () => {
  it('auto-opens on streaming, label "Thinking…"', () => {
    render(<Reasoning text="hmm" state="streaming" />);
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().textContent).toBe('Thinking…');
  });

  it('auto-closes once on done; duration label formats seconds', () => {
    const { rerender } = render(<Reasoning text="hmm" state="streaming" />);
    rerender(<Reasoning text="hmm" state="done" durationMs={4200} />);
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(trigger().textContent).toBe('Thought for 4.2 s');
    // "Once": the user can reopen after done and it stays open across rerenders.
    fireEvent.click(trigger());
    rerender(<Reasoning text="hmm more" state="done" durationMs={4200} />);
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
  });

  it('integer seconds at ≥10 s', () => {
    const { rerender } = render(<Reasoning text="x" state="streaming" />);
    rerender(<Reasoning text="x" state="done" durationMs={10000} />);
    expect(trigger().textContent).toBe('Thought for 10 s');
  });

  it('toggled-open-during-stream stays aria-expanded=true after done', () => {
    const { rerender } = render(<Reasoning text="x" state="streaming" defaultOpen />);
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(trigger()); // user closes during streaming
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(trigger()); // user reopens during streaming
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    rerender(<Reasoning text="x" state="done" durationMs={1200} />);
    // Auto-close would have collapsed it; the user's toggle wins.
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().textContent).toBe('Thought for 1.2 s');
  });

  it('duration from performance.now() when durationMs is absent (0 → 3456 ms)', () => {
    let now = 0;
    jest.spyOn(performance, 'now').mockImplementation(() => now);
    const { rerender } = render(<Reasoning text="x" state="streaming" />);
    now = 3456;
    rerender(<Reasoning text="x" state="done" />);
    expect(trigger().textContent).toBe('Thought for 3.5 s');
  });

  it('panel stays mounted while closed so aria-controls always resolves', () => {
    const { rerender } = render(<Reasoning text="secret plan" state="streaming" />);
    rerender(<Reasoning text="secret plan" state="done" durationMs={500} />);
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    const panel = document.getElementById(trigger().getAttribute('aria-controls')!);
    expect(panel).not.toBeNull();
    expect(panel!.hidden).toBe(true);
    expect(panel!.textContent).toBe('secret plan');
  });
});
