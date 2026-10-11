/** @jest-environment jsdom */
// REQ-SURF-82: the APG tree keyboard script, run in jsdom against the same
// KEYBOARD_TREE fixture the Keyboard story renders (the remote Playwright
// tests/a11y/apg/surf/tree-view.apg.spec.ts runs it on the built Storybook).
// Roles come from ./treeSemantics (OD-20 default: treegrid / row).
import { describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { I18nProvider } from 'react-aria-components';
import { TreeView, type TreeViewBaseProps } from './TreeView';
import { TREE_ITEM_SELECTOR, TREE_ROLE } from './treeSemantics';
import { KEYBOARD_TREE, type TreeFixtureNode } from './treeFixtures';

const focusedKey = () => (document.activeElement as HTMLElement | null)?.getAttribute('data-key') ?? null;
const row = (container: HTMLElement, key: string) =>
  [...container.querySelectorAll<HTMLElement>(TREE_ITEM_SELECTOR)].find((r) => r.getAttribute('data-key') === key);

function setup(extra: Partial<TreeViewBaseProps<TreeFixtureNode>> = {}) {
  const onAction = jest.fn();
  const onExpandedChange = jest.fn();
  const user = userEvent.setup();
  const utils = render(
    <>
      <button type="button">Before</button>
      <TreeView<TreeFixtureNode>
        items={KEYBOARD_TREE}
        getKey={(n) => n.id}
        getTextValue={(n) => n.label}
        aria-label="Fruit"
        selectionMode="multiple"
        onAction={onAction}
        onExpandedChange={onExpandedChange}
        {...extra}
      />
      <button type="button">After</button>
    </>,
  );
  return { ...utils, user, onAction, onExpandedChange };
}

describe('TreeView APG keyboard (REQ-SURF-82)', () => {
  it('renders the OD-20 default roles', () => {
    const { container } = setup();
    expect(container.querySelectorAll(`[role="${TREE_ROLE}"]`).length).toBe(1);
    expect(container.querySelectorAll(TREE_ITEM_SELECTOR).length).toBe(4);
  });

  it('one tab stop: Tab lands on the first item, Tab again leaves the tree', async () => {
    const { user } = setup();
    await user.tab();
    expect(document.activeElement!.textContent).toBe('Before');
    await user.tab();
    expect(focusedKey()).toBe('apple');
    await user.tab();
    expect(document.activeElement!.textContent).toBe('After');
    await user.tab({ shift: true });
    expect(focusedKey()).toBe('apple');
  });

  it('Down/Up, Home/End move between visible items', async () => {
    const { user } = setup();
    await user.tab();
    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(focusedKey()).toBe('banana');
    await user.keyboard('{ArrowUp}');
    expect(focusedKey()).toBe('apple');
    await user.keyboard('{End}');
    expect(focusedKey()).toBe('date');
    await user.keyboard('{Home}');
    expect(focusedKey()).toBe('apple');
  });

  it('Right expands, Right again enters the first child; Left goes to the parent, Left again collapses', async () => {
    const { user, container } = setup();
    await user.tab();
    await user.tab();
    expect(row(container, 'apple')!.getAttribute('aria-expanded')).toBe('false');
    await user.keyboard('{ArrowRight}');
    expect(row(container, 'apple')!.getAttribute('aria-expanded')).toBe('true');
    expect(focusedKey()).toBe('apple');
    await user.keyboard('{ArrowRight}');
    expect(focusedKey()).toBe('apricot');
    expect(document.activeElement!.getAttribute('aria-level')).toBe('2');
    // Right on a leaf does nothing
    await user.keyboard('{ArrowRight}');
    expect(focusedKey()).toBe('apricot');
    await user.keyboard('{ArrowLeft}');
    expect(focusedKey()).toBe('apple');
    await user.keyboard('{ArrowLeft}');
    expect(row(container, 'apple')!.getAttribute('aria-expanded')).toBe('false');
    expect(focusedKey()).toBe('apple');
  });

  it('RTL: ArrowLeft is expand/enter-child', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <I18nProvider locale="ar-EG">
        <button type="button">Before</button>
        <TreeView items={KEYBOARD_TREE} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="Fruit" />
      </I18nProvider>,
    );
    await user.tab();
    await user.tab();
    await user.keyboard('{ArrowLeft}');
    expect(row(container, 'apple')!.getAttribute('aria-expanded')).toBe('true');
    await user.keyboard('{ArrowLeft}');
    expect(focusedKey()).toBe('apricot');
    await user.keyboard('{ArrowRight}');
    expect(focusedKey()).toBe('apple');
  });

  it("'*' expands every expandable sibling of the focused item and nothing else", async () => {
    const { user, container, onExpandedChange } = setup();
    await user.tab();
    await user.tab();
    await user.keyboard('*');
    for (const k of ['apple', 'banana', 'date']) expect(row(container, k)!.getAttribute('aria-expanded')).toBe('true');
    expect(row(container, 'cherry')!.hasAttribute('aria-expanded')).toBe(false);
    // nested parent (a sibling of a different level) is not expanded
    expect(row(container, 'avocado')!.getAttribute('aria-expanded')).toBe('false');
    expect([...(onExpandedChange.mock.calls.at(-1)![0] as Set<string>)].sort()).toEqual(['apple', 'banana', 'date']);
    expect(focusedKey()).toBe('apple');
    // inside a child level '*' expands only that level's siblings
    await user.keyboard('{ArrowRight}{ArrowDown}*');
    expect(focusedKey()).toBe('avocado');
    expect(row(container, 'avocado')!.getAttribute('aria-expanded')).toBe('true');
  });

  it("'*' in a controlled tree reports the request and leaves the DOM to the prop", async () => {
    const { user, container, onExpandedChange } = setup({ expandedKeys: [] });
    await user.tab();
    await user.tab();
    await user.keyboard('*');
    expect(onExpandedChange).toHaveBeenCalledTimes(1);
    expect([...(onExpandedChange.mock.calls[0]![0] as Set<string>)].sort()).toEqual(['apple', 'banana', 'date']);
    expect(row(container, 'apple')!.getAttribute('aria-expanded')).toBe('false');
  });

  it('type-ahead moves to the matching item; a pause > 1000 ms starts a new search', async () => {
    jest.useFakeTimers();
    try {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <>
          <button type="button">Before</button>
          <TreeView items={KEYBOARD_TREE} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="Fruit" />
        </>,
      );
      await user.tab();
      await user.tab();
      await user.keyboard('c');
      expect(focusedKey()).toBe('cherry');
      await act(async () => {
        jest.advanceTimersByTime(1100);
      });
      await user.keyboard('d');
      expect(focusedKey()).toBe('date');
      await act(async () => {
        jest.advanceTimersByTime(1100);
      });
      await user.keyboard('ba');
      expect(focusedKey()).toBe('banana');
    } finally {
      jest.useRealTimers();
    }
  });

  it('Enter fires onAction once with the key; Space toggles aria-selected', async () => {
    const { user, container, onAction } = setup();
    await user.tab();
    await user.tab();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith('banana');
    expect(row(container, 'banana')!.getAttribute('aria-selected')).toBe('false');
    await user.keyboard(' ');
    expect(row(container, 'banana')!.getAttribute('aria-selected')).toBe('true');
    await user.keyboard(' ');
    expect(row(container, 'banana')!.getAttribute('aria-selected')).toBe('false');
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('every item carries aria-level/aria-setsize/aria-posinset; parents carry aria-expanded', async () => {
    const { container } = setup({ defaultExpandedKeys: ['apple', 'avocado'] });
    const rows = [...container.querySelectorAll<HTMLElement>(TREE_ITEM_SELECTOR)];
    expect(rows.map((r) => [r.getAttribute('data-key'), r.getAttribute('aria-level'), r.getAttribute('aria-posinset'), r.getAttribute('aria-setsize')])).toEqual([
      ['apple', '1', '1', '4'],
      ['apricot', '2', '1', '2'],
      ['avocado', '2', '2', '2'],
      ['hass', '3', '1', '1'],
      ['banana', '1', '2', '4'],
      ['cherry', '1', '3', '4'],
      ['date', '1', '4', '4'],
    ]);
    const expanded = Object.fromEntries(rows.map((r) => [r.getAttribute('data-key'), r.getAttribute('aria-expanded')]));
    expect(expanded).toEqual({ apple: 'true', apricot: null, avocado: 'true', hass: null, banana: 'false', cherry: null, date: 'false' });
  });
});
