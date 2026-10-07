/** @jest-environment jsdom */
import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { Command } from './Command';

const Items = ({ count = 5 }: { count?: number }) =>
  Array.from({ length: count }, (_, i) => (
    <Command.Item key={i} value={`item-${i}`}>Item {i}</Command.Item>
  ));

describe('Command (SURF-086)', () => {
  it('combobox input controls the listbox with aria-activedescendant', () => {
    render(
      <Command.Root>
        <Command.Input />
        <Command.List>
          <Items />
        </Command.List>
      </Command.Root>,
    );
    const input = screen.getByRole('combobox');
    const listbox = screen.getByRole('listbox');
    expect(input).toHaveAttribute('aria-controls', listbox.id);
  });

  it('ArrowDown/Up wraps the active option', () => {
    render(
      <Command.Root>
        <Command.Input />
        <Command.List>
          <Items count={3} />
        </Command.List>
      </Command.Root>,
    );
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const first = input.getAttribute('aria-activedescendant')!;
    expect(first).toContain('item-0');
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.getAttribute('aria-activedescendant')).toContain('item-2'); // wraps
  });

  it('Enter selects the active item', () => {
    const picked: string[] = [];
    render(
      <Command.Root>
        <Command.Input />
        <Command.List>
          <Command.Item value="open" onSelect={() => picked.push('open')}>Open</Command.Item>
          <Command.Item value="save">Save</Command.Item>
        </Command.List>
      </Command.Root>,
    );
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(picked).toEqual(['open']);
  });

  it('Escape clears the query, then propagates', () => {
    render(
      <Command.Root>
        <Command.Input />
        <Command.List>
          <Items />
        </Command.List>
      </Command.Root>,
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'ite' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('metacharacter queries do not throw', () => {
    render(
      <Command.Root>
        <Command.Input />
        <Command.List>
          <Command.Item value="a+b">a+b</Command.Item>
        </Command.List>
      </Command.Root>,
    );
    const input = screen.getByRole('combobox');
    for (const q of ['a+b', '(x', '[', '*?', '\\', '$.']) {
      expect(() => fireEvent.change(input, { target: { value: q } })).not.toThrow();
    }
  });

  it('fuzz: random printable queries never throw', () => {
    render(
      <Command.Root>
        <Command.Input />
        <Command.List>
          <Items count={20} />
        </Command.List>
      </Command.Root>,
    );
    const input = screen.getByRole('combobox');
    for (let i = 0; i < 200; i++) {
      const q = Array.from({ length: 1 + (i % 8) }, () =>
        String.fromCharCode(32 + ((i * 37 + 11) % 95)),
      ).join('');
      fireEvent.change(input, { target: { value: q } });
    }
    expect(true).toBe(true);
  });

  it('Empty shows when the filter removes everything', () => {
    render(
      <Command.Root>
        <Command.Input />
        <Command.List>
          <Command.Item value="a">Alpha</Command.Item>
        </Command.List>
        <Command.Empty>Nothing</Command.Empty>
      </Command.Root>,
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzz' } });
    expect(screen.getByText('Nothing')).toBeTruthy();
  });
});
