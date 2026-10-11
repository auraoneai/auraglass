/** @jest-environment jsdom */
// tests/capability/registry/presence-stack.test.tsx — REQ-SURF-176
// (REQ-FIN-88, AC-FIN-88). Rendered against the REAL library sources: a
// <ul>/<li> list with every name as text, id-hashed palette colour vars,
// "N more collaborators" overflow, the 3-avatar narrow clamp, no timers.
//
// Resolution: 'aura-glass' is aliased to src/index.ts via jest.requireActual
// until the root mapper lands (REQ-FIN-09 / contract C-4, FIN-A).
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { axe } from 'jest-axe';
import * as fs from 'node:fs';
import * as React from 'react';

jest.mock('aura-glass', () => jest.requireActual('../../../src/index'), { virtual: true });

import { PresenceStack, presenceColor, hashId, PALETTE_SIZE } from '../../../registry/items/presence-stack/index';
import { presenceProps, presenceUsers } from '../../../registry/items/presence-stack/fixtures';

afterEach(cleanup);

/** jest-axe result shape (the package ships no types for it here). */
type AxeResult = { violations: Array<{ id: string; nodes: Array<{ target: unknown }> }> };

const overflow = (layout: 'wide' | 'narrow') =>
  document.querySelector(`[data-ag-part="overflow"][data-layout="${layout}"]`) as HTMLButtonElement | null;

describe('presence-stack item', () => {
  it('the same id always gives the same palette colour var', () => {
    expect(presenceColor('u-amara')).toBe(presenceColor('u-amara'));
    expect(presenceColor('u-amara')).toMatch(/^var\(--_ag-chart-[1-8]\)$/);
    for (const u of presenceUsers) {
      const k = (hashId(u.id) % PALETTE_SIZE) + 1;
      expect(presenceColor(u.id)).toBe(`var(--_ag-chart-${k})`);
    }
  });

  it('applies the id colour to each avatar, and `color` overrides it', () => {
    const { container } = render(<PresenceStack users={[{ id: 'u-amara', name: 'Amara Osei' }, { id: 'u-bert', name: 'Bert Hughes', color: 'var(--ag-color-accent)' }]} />);
    const avatars = container.querySelectorAll<HTMLElement>('.ag-presence-stack__avatar');
    expect(avatars[0]!.style.background).toBe(presenceColor('u-amara'));
    expect(avatars[1]!.style.background).toBe('var(--ag-color-accent)');
    // Re-rendering the same id yields the same colour.
    cleanup();
    const again = render(<PresenceStack users={[{ id: 'u-amara', name: 'Amara Osei' }]} />);
    expect(again.container.querySelector<HTMLElement>('.ag-presence-stack__avatar')!.style.background).toBe(presenceColor('u-amara'));
  });

  it('renders a <ul> of <li> with every shown name as text', () => {
    render(<PresenceStack {...presenceProps} />);
    const list = screen.getByRole('list', { name: 'Collaborators' });
    expect(list.tagName).toBe('UL');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(presenceProps.max);
    presenceUsers.slice(0, presenceProps.max).forEach((u, i) => expect(items[i]!.textContent).toContain(u.name));
    expect(document.body.textContent).not.toMatch(/online/);
  });

  it('types status as active | idle and exposes idle in the name text', () => {
    render(<PresenceStack users={[{ id: 'a', name: 'Ann Lee', status: 'idle' }, { id: 'b', name: 'Bo Ma', status: 'active' }]} />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]!.getAttribute('data-status')).toBe('idle');
    expect(items[0]!.textContent).toContain('Ann Lee (idle)');
    expect(items[1]!.textContent).toContain('Bo Ma');
  });

  it('renders avatarUrl as the avatar image', () => {
    const { container } = render(<PresenceStack users={[{ id: 'a', name: 'Ann Lee', avatarUrl: '/a.png' }]} />);
    expect(container.querySelector('img[src="/a.png"]')).not.toBeNull();
  });

  it("the overflow button is named 'N more collaborators' and is clickable", () => {
    const onOverflowClick = jest.fn();
    render(<PresenceStack {...presenceProps} onOverflowClick={onOverflowClick} />); // 7 users, max 5
    const wide = overflow('wide')!;
    expect(wide.getAttribute('aria-label')).toBe('2 more collaborators');
    expect(wide.textContent).toBe('+2');
    fireEvent.click(wide);
    expect(onOverflowClick).toHaveBeenCalledTimes(1);
  });

  it('the narrow layout clamps to 3 regardless of max (container-query CSS + data-narrow fallback)', () => {
    const { container } = render(<PresenceStack {...presenceProps} narrow />);
    expect(container.querySelector('.ag-presence-stack')!.hasAttribute('data-narrow')).toBe(true);
    const beyond = container.querySelectorAll('[data-beyond-narrow]');
    expect(beyond).toHaveLength(presenceProps.max - 3);
    expect(overflow('narrow')!.getAttribute('aria-label')).toBe(`${presenceUsers.length - 3} more collaborators`);
    const css = fs.readFileSync('registry/items/presence-stack/presence-stack.css', 'utf8');
    expect(css).toMatch(/container:\s*ag-presence-stack\s*\/\s*inline-size/);
    expect(css).toMatch(/@container ag-presence-stack \(max-width: 389\.98px\)/);
    expect(css).toMatch(/\[data-narrow\] \.ag-presence-stack__item\[data-beyond-narrow\]/);
  });

  it('no overflow button when every user fits', () => {
    render(<PresenceStack users={presenceUsers.slice(0, 2)} max={4} />);
    expect(overflow('wide')).toBeNull();
    expect(overflow('narrow')).toBeNull();
  });

  it('leaves no timers', () => {
    jest.useFakeTimers();
    try {
      render(<PresenceStack {...presenceProps} />);
      expect(jest.getTimerCount()).toBe(0);
    } finally {
      jest.useRealTimers();
    }
  });

  it('has 0 axe violations', async () => {
    const { container } = render(<PresenceStack {...presenceProps} />);
    const r = (await axe(container, { rules: { region: { enabled: false } } })) as AxeResult;
    expect(r.violations.map((v) => v.id)).toEqual([]);
  });

  it('ships no colour literals', () => {
    for (const f of ['PresenceStack.tsx', 'presence-stack.css', 'index.tsx']) {
      expect(fs.readFileSync(`registry/items/presence-stack/${f}`, 'utf8')).not.toMatch(/hsl\(|#[0-9a-f]{3,6}\b/i);
    }
  });
});
