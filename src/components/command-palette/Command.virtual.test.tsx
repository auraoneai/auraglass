/** @jest-environment jsdom */
// SURF-063 (REQ-FIN-82, merged #361): >100 visible items render through the
// SURF VirtualList; the active option is scrolled into the window before
// aria-activedescendant points at it.
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { Command } from './Command';

// jsdom has no layout: give the scroller a 240px viewport and every virtual
// row 32px (Command's estimate), and implement element scrolling the way a
// browser does (scrollTop + a scroll event) so the virtualizer can move its
// window.
const ROW = 32;
const VIEWPORT = 240;
const N = 5000;
const restores: Array<() => void> = [];

const defineGetter = (proto: object, key: string, get: (this: HTMLElement) => number) => {
  const prev = Object.getOwnPropertyDescriptor(proto, key);
  Object.defineProperty(proto, key, { configurable: true, get });
  restores.push(() => {
    if (prev) Object.defineProperty(proto, key, prev);
    else delete (proto as Record<string, unknown>)[key];
  });
};

beforeEach(() => {
  const rect = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    const row = this.dataset?.index !== undefined;
    return {
      x: 0, y: 0, top: 0, left: 0, right: 400, width: 400,
      bottom: row ? ROW : VIEWPORT,
      height: row ? ROW : VIEWPORT,
      toJSON: () => ({}),
    } as DOMRect;
  });
  restores.push(() => rect.mockRestore());
  defineGetter(HTMLElement.prototype, 'offsetHeight', function () {
    return this.dataset?.index !== undefined ? ROW : VIEWPORT;
  });
  defineGetter(HTMLElement.prototype, 'clientHeight', () => VIEWPORT);
  const prevScrollTo = (Element.prototype as { scrollTo?: unknown }).scrollTo;
  (Element.prototype as unknown as { scrollTo: (o: ScrollToOptions) => void }).scrollTo = function (
    this: Element,
    opts: ScrollToOptions,
  ) {
    if (typeof opts?.top === 'number') this.scrollTop = opts.top;
    this.dispatchEvent(new Event('scroll'));
  };
  restores.push(() => {
    (Element.prototype as { scrollTo?: unknown }).scrollTo = prevScrollTo;
  });
});

afterEach(() => {
  while (restores.length) restores.pop()!();
});

const Many = ({ count = N }: { count?: number }) => (
  <Command.Root>
    <Command.Input />
    <Command.List>
      {Array.from({ length: count }, (_, i) => (
        <Command.Item key={i} value={`cmd-${i}`}>{`Command ${i}`}</Command.Item>
      ))}
    </Command.List>
  </Command.Root>
);

describe('Command SURF-63: 5,000 items', () => {
  it('renders <=30 option nodes (and more than 0) inside the controlled listbox', () => {
    render(<Many />);
    const options = document.querySelectorAll('[role="option"]');
    expect(options.length).toBeGreaterThan(0);
    expect(options.length).toBeLessThanOrEqual(30);
    const input = screen.getByRole('combobox');
    const listbox = document.getElementById(input.getAttribute('aria-controls')!);
    expect(listbox).not.toBeNull();
    expect(listbox).toHaveAttribute('role', 'listbox');
    for (const o of options) expect(listbox!.contains(o)).toBe(true);
    // options carry their position in the full set
    expect(options[0]).toHaveAttribute('aria-setsize', String(N));
  });

  it('ArrowDown to item 4999 sets aria-activedescendant to a node that exists', () => {
    render(<Many />);
    const input = screen.getByRole('combobox');
    act(() => {
      fireEvent.keyDown(input, { key: 'ArrowDown' }); // item 0
    });
    expect(input.getAttribute('aria-activedescendant')).toMatch(/item-cmd-0$/);
    act(() => {
      fireEvent.keyDown(input, { key: 'ArrowUp' }); // wraps to item 4999
    });
    const id = input.getAttribute('aria-activedescendant')!;
    expect(id).toMatch(/item-cmd-4999$/);
    const active = document.getElementById(id);
    expect(active).not.toBeNull();
    expect(active).toHaveAttribute('aria-selected', 'true');
    expect(active).toHaveAttribute('aria-posinset', String(N));
    expect(document.querySelectorAll('[role="option"]').length).toBeLessThanOrEqual(30);
  });

  it('stepping ArrowDown through the window keeps every active id resolvable', () => {
    render(<Many />);
    const input = screen.getByRole('combobox');
    for (let i = 0; i < 40; i++) {
      act(() => {
        fireEvent.keyDown(input, { key: 'ArrowDown' });
      });
      const id = input.getAttribute('aria-activedescendant')!;
      expect(id).toMatch(new RegExp(`item-cmd-${i}$`));
      expect(document.getElementById(id)).not.toBeNull();
    }
    act(() => {
      fireEvent.keyDown(input, { key: 'End' });
    });
    expect(document.getElementById(input.getAttribute('aria-activedescendant')!)).not.toBeNull();
  });
});
