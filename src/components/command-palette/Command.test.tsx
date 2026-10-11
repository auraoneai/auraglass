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

// ---------------------------------------------------------------------------
// REQ-FIN-82 follow-ups on merged #360/#361 (SURF-60 item rules, SURF-61..63).
// ---------------------------------------------------------------------------
import { act } from '@testing-library/react';
import { jest } from '@jest/globals';

const mockAnnounce = jest.fn();
jest.mock('../../theme', () => {
  const actual = jest.requireActual<typeof import('../../theme')>('../../theme');
  return { ...actual, useAnnouncer: () => ({ announce: mockAnnounce, clear: () => {} }) };
});

const visibleOptions = () => [...document.querySelectorAll('[role="option"]')].filter((o) => !(o as HTMLElement).hidden);

describe('Command SURF-61: score + shouldFilter', () => {
  it("Command.score('oS','openSettings') ranks the camelCase word start above a mid-word subsequence", () => {
    expect(typeof Command.score).toBe('function');
    const wordStart = Command.score('oS', 'openSettings');
    const midWord = Command.score('oS', 'photoshop');
    expect(midWord).toBeGreaterThan(0);
    expect(wordStart).toBeGreaterThan(midWord);
  });

  it('shouldFilter={false} shows every item for any query', () => {
    render(
      <Command.Root shouldFilter={false}>
        <Command.Input />
        <Command.List>
          <Items count={4} />
        </Command.List>
      </Command.Root>,
    );
    for (const q of ['zzz', 'item-1', '']) {
      fireEvent.change(screen.getByRole('combobox'), { target: { value: q } });
      expect(visibleOptions()).toHaveLength(4);
    }
  });
});

describe('Command SURF-60 (item rules in the SURF file)', () => {
  it('zero matches hides all items and shows Empty', () => {
    render(
      <Command.Root>
        <Command.Input />
        <Command.List>
          <Items count={3} />
        </Command.List>
        <Command.Empty>Nothing</Command.Empty>
      </Command.Root>,
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzz' } });
    expect(document.querySelectorAll('[role="option"]:not([hidden])')).toHaveLength(0);
    expect(screen.getByText('Nothing')).toBeTruthy();
  });

  it("query 'os' puts the top-ranked option first", () => {
    render(
      <Command.Root>
        <Command.Input />
        <Command.List>
          <Command.Item value="photoshop">photoshop</Command.Item>
          <Command.Item value="openSettings">openSettings</Command.Item>
          <Command.Item value="os">os</Command.Item>
        </Command.List>
      </Command.Root>,
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'os' } });
    const ordered = visibleOptions().sort(
      (a, b) => Number((a as HTMLElement).style.order) - Number((b as HTMLElement).style.order),
    );
    expect(ordered[0]!.textContent).toBe('os');
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    expect(screen.getByRole('combobox').getAttribute('aria-activedescendant')).toContain('item-os');
  });

  it('click fires onSelect and onValueChange', () => {
    const select = jest.fn();
    const change = jest.fn();
    render(
      <Command.Root onValueChange={change}>
        <Command.Input />
        <Command.List>
          <Command.Item value="save" onSelect={select}>Save</Command.Item>
        </Command.List>
      </Command.Root>,
    );
    fireEvent.click(screen.getByRole('option', { name: 'Save' }));
    expect(select).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledWith('save');
  });
});

describe('Command SURF-62: IME', () => {
  it('Enter while composing (isComposing:true) does not select', () => {
    const select = jest.fn();
    render(
      <Command.Root>
        <Command.Input />
        <Command.List>
          <Command.Item value="open" onSelect={select}>Open</Command.Item>
        </Command.List>
      </Command.Root>,
    );
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
    expect(select).not.toHaveBeenCalled();
    fireEvent.compositionStart(input);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(select).not.toHaveBeenCalled();
    fireEvent.compositionEnd(input);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(select).toHaveBeenCalledTimes(1);
  });
});

describe('Command SURF-63: announces count', () => {
  it("announces 'N results' 500 ms after the visible count settles", () => {
    jest.useFakeTimers();
    try {
      mockAnnounce.mockClear();
      render(
        <Command.Root>
          <Command.Input />
          <Command.List>
            <Command.Item value="alpha">alpha</Command.Item>
            <Command.Item value="alps">alps</Command.Item>
            <Command.Item value="beta">beta</Command.Item>
          </Command.List>
        </Command.Root>,
      );
      act(() => {
        jest.advanceTimersByTime(600);
      });
      mockAnnounce.mockClear();
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'al' } });
      act(() => {
        jest.advanceTimersByTime(499);
      });
      expect(mockAnnounce).not.toHaveBeenCalled();
      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(mockAnnounce).toHaveBeenCalledTimes(1);
      expect(mockAnnounce).toHaveBeenCalledWith('2 results');
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'beta' } });
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(mockAnnounce).toHaveBeenLastCalledWith('1 result');
    } finally {
      jest.useRealTimers();
    }
  });
});
