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

describe('InlineEdit REQ-CMP-124', () => {
  it('focus returns to the trigger after Enter', () => {
    render(<InlineEdit defaultValue="a" />);
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(document.activeElement).toBe(screen.getByRole('button'));
  });

  it('focus returns to the trigger after Escape', () => {
    render(<InlineEdit defaultValue="a" />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(document.activeElement).toBe(screen.getByRole('button'));
  });

  it('editing root is a content-sunken surface (materialProps; data-ag-material is banned)', () => {
    const { container } = render(<InlineEdit defaultValue="a" editing />);
    const root = container.querySelector('[data-ag-part="root"]')!;
    expect(root.getAttribute('data-ag-content')).toBe('content-sunken');
    expect(root.hasAttribute('data-ag-material')).toBe(false);
  });
});
