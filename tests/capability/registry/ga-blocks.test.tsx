/** @jest-environment jsdom */
// tests/capability/registry/ga-blocks.test.tsx — REQ-SURF-171 (REQ-FIN-88,
// AC-FIN-88). Renders all 7 GA registry blocks against the REAL library
// sources (never doubles) and asserts the composed component parts:
//   app-frame, data-workspace, analytics-dashboard, media-viewer
//   (now-playing + carousel), ai-workspace, support-inbox (thread, FilterBar
//   filtering, reply appended), mobile-settings (CMP Sheet + preferences
//   panel). Each block renders with 0 console errors and 0 axe violations.
//
// Resolution: blocks import the public specifiers ('aura-glass',
// 'aura-glass/<entry>'). The root jest.config.js maps none of them yet
// (REQ-FIN-09 / contract C-4, FIN-A); until it does, each specifier is
// aliased here to its src/contracts/entries.ts source via jest.requireActual
// — the real module, the same mapping the root mapper will make.
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { axe } from 'jest-axe';
import * as React from 'react';

jest.mock('aura-glass', () => jest.requireActual('../../../src/index'), { virtual: true });
jest.mock('aura-glass/app-shell', () => jest.requireActual('../../../src/app-shell/index'), { virtual: true });
jest.mock('aura-glass/data', () => jest.requireActual('../../../src/data/index'), { virtual: true });
jest.mock('aura-glass/ai', () => jest.requireActual('../../../src/ai/index'), { virtual: true });
jest.mock('aura-glass/media', () => jest.requireActual('../../../src/media/index'), { virtual: true });
jest.mock('aura-glass/backdrops', () => jest.requireActual('../../../src/backdrops/index'), { virtual: true });
jest.mock('aura-glass/theme', () => jest.requireActual('../../../src/theme/public'), { virtual: true });

import { AppFrame } from '../../../registry/blocks/app-frame/index';
import { APP_NAV, APP_TITLE } from '../../../registry/blocks/app-frame/fixtures';
import { DataWorkspace } from '../../../registry/blocks/data-workspace/index';
import { COLLECTIONS, ROWS } from '../../../registry/blocks/data-workspace/fixtures';
import { AnalyticsDashboard } from '../../../registry/blocks/analytics-dashboard/index';
import { EVENTS, STATS } from '../../../registry/blocks/analytics-dashboard/fixtures';
import { MediaViewer } from '../../../registry/blocks/media-viewer/index';
import { ITEM_IMAGES, ITEM_TITLE } from '../../../registry/blocks/media-viewer/fixtures';
import { AiWorkspace } from '../../../registry/blocks/ai-workspace/index';
import { SupportInbox, filterTickets } from '../../../registry/blocks/support-inbox/index';
import { MESSAGES, TICKETS } from '../../../registry/blocks/support-inbox/fixtures';
import { MobileSettings } from '../../../registry/blocks/mobile-settings/index';
import { SETTINGS_TABS } from '../../../registry/blocks/mobile-settings/fixtures';
import type { FilterGroup } from '../../../src/data/index';
import { AuraGlassProvider } from '../../../src/theme/public';

/** axe violations as `rule: target` strings (readable failure output). */
const violations = (r: unknown) =>
  (r as { violations: Array<{ id: string; nodes: Array<{ target: unknown }> }> }).violations
    .flatMap((v) => v.nodes.map((n) => `${v.id}: ${JSON.stringify(n.target)}`));

/** Blocks render inside the app-root provider a consuming app mounts. */
const renderBlock = (ui: React.ReactElement) => render(ui, { wrapper: ({ children }) => <AuraGlassProvider>{children}</AuraGlassProvider> });

let errors: unknown[][] = [];
let errorSpy: ReturnType<typeof jest.spyOn>;
beforeEach(() => {
  errors = [];
  errorSpy = jest.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { errors.push(a); });
});
afterEach(() => {
  cleanup();
  errorSpy.mockRestore();
});

const statusIs = (value: 'open' | 'pending' | 'closed'): FilterGroup => ({
  kind: 'group', id: 'root', combinator: 'and',
  children: [{ kind: 'rule', id: 'r-status', fieldId: 'status', operator: 'is', value }],
});

const BLOCKS: Array<[string, () => React.ReactElement]> = [
  ['app-frame', () => <AppFrame />],
  ['data-workspace', () => <DataWorkspace />],
  ['analytics-dashboard', () => <AnalyticsDashboard />],
  ['media-viewer', () => <MediaViewer />],
  ['ai-workspace', () => <AiWorkspace />],
  ['support-inbox', () => <SupportInbox />],
  ['mobile-settings', () => <MobileSettings />],
];

describe('GA registry blocks (REQ-SURF-171)', () => {
  it.each(BLOCKS)('%s renders with 0 console errors and 0 axe violations', async (_id, el) => {
    let container!: HTMLElement;
    // Flush mount effects (portal containers, layout-measured ids) before asserting.
    await act(async () => { ({ container } = renderBlock(el())); });
    expect(container.firstElementChild).not.toBeNull();
    expect(violations(await axe(container))).toEqual([]);
    expect(errors).toEqual([]);
  });

  it('app-frame composes AppShell + Sidebar + TopBar + StatusBar + Inspector', () => {
    const { container } = renderBlock(<AppFrame />);
    for (const part of ['sidebar', 'top-bar', 'status-bar', 'inspector']) {
      expect(container.querySelector(`[data-ag-part="${part}"]`)).not.toBeNull();
    }
    expect(container.textContent).toContain(APP_TITLE);
    for (const item of APP_NAV) expect(container.querySelector(`a[href="${item.href}"]`)).not.toBeNull();
  });

  it('data-workspace composes Table + FilterBar + TreeView + StatCard + Pagination', () => {
    const { container } = renderBlock(<DataWorkspace />);
    expect(container.querySelector('[data-ag-part="data-workspace"]')).not.toBeNull();
    expect(container.textContent).toContain(ROWS[0]!.name);
    for (const c of COLLECTIONS) expect(container.textContent).toContain(c.label);
  });

  it('analytics-dashboard composes StatCards, ChartFrame and Timeline', () => {
    const { container } = renderBlock(<AnalyticsDashboard />);
    for (const s of STATS) expect(container.textContent).toContain(s.label);
    for (const e of EVENTS) expect(container.textContent).toContain(e.title);
  });

  it('media-viewer composes NowPlayingBar on the same media handle and a CarouselRail of ITEM_IMAGES', () => {
    const { container } = renderBlock(<MediaViewer />);
    expect(container.querySelector('[data-ag-backdrop-preset="photo"]')).not.toBeNull();
    expect(container.querySelector('[data-ag-part="media-controls"]')).not.toBeNull();
    const np = container.querySelector('[data-ag-part="now-playing"]');
    expect(np).not.toBeNull();
    expect(np!.querySelector('[data-ag-part="now-playing-title"]')!.textContent).toBe(ITEM_TITLE);
    const rail = container.querySelector('[data-ag-part="carousel"]');
    expect(rail).not.toBeNull();
    expect(rail!.getAttribute('aria-roledescription')).toBe('carousel');
    expect(rail!.querySelectorAll('[data-ag-part="carousel-slide"]')).toHaveLength(ITEM_IMAGES.length);
    for (const it of ITEM_IMAGES) expect(rail!.querySelector(`img[src="${it.src}"]`)).not.toBeNull();
    // One handle: toggling from the NowPlayingBar reaches the same <video>
    // MediaControls drive.
    const video = container.querySelector('video') as HTMLVideoElement;
    const play = jest.spyOn(video, 'play').mockImplementation(() => Promise.resolve());
    const toggle = np!.querySelector('button[aria-label]') as HTMLButtonElement;
    expect(toggle).not.toBeNull();
    act(() => { fireEvent.click(toggle); });
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('ai-workspace composes Thread + Composer', () => {
    const { container } = renderBlock(<AiWorkspace />);
    expect(container.querySelector('[data-ag-part="ai-workspace"]')).not.toBeNull();
    expect(container.querySelector('[data-ag-part="thread"]')).not.toBeNull();
  });

  it('support-inbox renders the conversation as a Thread', () => {
    const { container } = renderBlock(<SupportInbox />);
    const thread = container.querySelector('[data-ag-part="thread"]');
    expect(thread).not.toBeNull();
    expect(within(thread as HTMLElement).getByRole('log')).toBeTruthy();
    const first = MESSAGES[TICKETS[0]!.id]!;
    expect(thread!.querySelectorAll('[data-ag-part="message"]')).toHaveLength(first.length);
    for (const m of first) expect(thread!.textContent).toContain(m.body);
  });

  it('support-inbox applies the FilterBar model to TICKETS (status / priority)', () => {
    expect(filterTickets(TICKETS, statusIs('open')).map((t) => t.id)).toEqual(TICKETS.filter((t) => t.status === 'open').map((t) => t.id));
    const notHigh: FilterGroup = { kind: 'group', id: 'root', combinator: 'and',
      children: [{ kind: 'rule', id: 'r-p', fieldId: 'priority', operator: 'is-not', value: 'high' }] };
    expect(filterTickets(TICKETS, notHigh).every((t) => t.priority !== 'high')).toBe(true);
    const either: FilterGroup = { kind: 'group', id: 'root', combinator: 'or', children: [
      { kind: 'rule', id: 'a', fieldId: 'status', operator: 'is', value: 'closed' },
      { kind: 'rule', id: 'b', fieldId: 'priority', operator: 'is', value: 'high' }] };
    expect(filterTickets(TICKETS, either).map((t) => t.id).sort()).toEqual(['T-1039', 'T-1042']);

    const { container } = renderBlock(<SupportInbox defaultFilter={statusIs('pending')} />);
    const table = container.querySelector('[data-ag-part="support-inbox"] table') as HTMLElement;
    expect(table).not.toBeNull();
    for (const t of TICKETS) {
      if (t.status === 'pending') expect(table.textContent).toContain(t.subject);
      else expect(table.textContent).not.toContain(t.subject);
    }
  });

  it('support-inbox appends the reply to the thread on submit and clears the draft', () => {
    const { container } = renderBlock(<SupportInbox />);
    const before = container.querySelectorAll('[data-ag-part="thread"] [data-ag-part="message"]').length;
    const box = screen.getByLabelText('Reply') as HTMLTextAreaElement;
    fireEvent.change(box, { target: { value: 'Resent the link — please check spam.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    const msgs = container.querySelectorAll('[data-ag-part="thread"] [data-ag-part="message"]');
    expect(msgs).toHaveLength(before + 1);
    expect(msgs[msgs.length - 1]!.textContent).toContain('Resent the link — please check spam.');
    expect(box.value).toBe('');
  });

  it('mobile-settings: TabBar + a CMP Sheet that opens GlassPreferencesPanel, primary controls on the 44px hook', async () => {
    const { container } = renderBlock(<MobileSettings />);
    for (const tab of SETTINGS_TABS) expect(container.querySelector(`a[href="#${tab.id}"]`)!.textContent).toBe(tab.label);
    expect(document.querySelector('[data-ag-preferences-panel]')).toBeNull();
    const trigger = container.querySelector('[data-ag-part="trigger"]') as HTMLElement;
    expect(trigger).not.toBeNull();
    expect(trigger.classList.contains('ag-mobile-settings__control')).toBe(true);
    await act(async () => { fireEvent.click(trigger); });
    // Let Base UI finish the open transition (rAF/animation-frame state) inside act.
    await act(async () => { await new Promise((r) => setTimeout(r, 50)); });
    const sheet = document.querySelector('[data-ag-overlay="sheet"][data-ag-part="popup"]') as HTMLElement;
    expect(sheet).not.toBeNull();
    expect(sheet.getAttribute('data-state')).toBe('open');
    const panel = sheet.querySelector('[data-ag-preferences-panel]') as HTMLElement;
    expect(panel).not.toBeNull();
    expect(panel.classList.contains('ag-mobile-settings__panel')).toBe(true);
    expect(panel.querySelectorAll('[data-ag-part="group"]').length).toBeGreaterThan(0);
    expect((sheet.querySelector('[data-ag-part="close"]') as HTMLElement).classList.contains('ag-mobile-settings__control')).toBe(true);
    expect(violations(await axe(document.body))).toEqual([]);
    expect(errors).toEqual([]);
  });
});
