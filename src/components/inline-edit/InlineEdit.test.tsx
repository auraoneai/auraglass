/* CMP-317: InlineEdit — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { InlineEdit } from './index';

describe('InlineEdit', () => {
  it('trigger click swaps to the textbox', () => {
    render(<InlineEdit defaultValue="name" />);
    fireEvent.click(screen.getByRole('button', { name: /edit|name/i }));
    expect(screen.getByRole('textbox')).toBeTruthy();
  });
  it('Enter commits the edited value', () => {
    const seen: string[] = [];
    render(<InlineEdit defaultValue="a" onValueChange={(v: string) => seen.push(v)} />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'b' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(seen[0]).toBe('b');
  });
  it('Escape cancels back to the trigger', () => {
    const seen: string[] = [];
    render(<InlineEdit defaultValue="a" onValueChange={(v: string) => seen.push(v)} />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'nope' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(seen.length).toBe(0);
    expect(screen.queryByRole('textbox')).toBeNull();
  });
  it('blur commits', () => {
    const seen: string[] = [];
    render(<InlineEdit defaultValue="a" onValueChange={(v: string) => seen.push(v)} />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'c' } });
    fireEvent.blur(input);
    expect(seen[0]).toBe('c');
  });
});
