/** @jest-environment jsdom */
// REQ-SURF-13 (W1): every shell/navigation compat adapter renders its 5.0
// successor from its 4.x story props and warns exactly once with its DEP-S id.
// Harness: tests/app-shell/compat-harness.tsx. Story props:
// tests/fixtures/consumer-4x/cases/surf/app-shell/story-args.tsx.
import { describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { expectAdapter, type CompatRow } from './compat-harness';
import { W1_STORY_ARGS as A } from '../fixtures/consumer-4x/cases/surf/app-shell/story-args';
import * as compat from '../../src/compat/surf';
import { COMPAT_IDS } from '../fixtures/consumer-4x/cases/surf/compat-ids';

type C = React.ComponentType<Record<string, unknown>>;
const row = (name: keyof typeof compat & keyof typeof A, part: string, extra?: Record<string, unknown>): CompatRow => ({
  name, id: COMPAT_IDS[name]!.id, part, C: compat[name] as unknown as C, args: A[name]!, ...(extra ? { extra } : {}),
});

export const W1_ROWS: CompatRow[] = [
  row('GlassAppShell', '.ag-app-shell [data-ag-slot="main"]'),
  row('GlassHeader', '[data-ag-part="top-bar"]'),
  row('GlassTopBar', '[data-ag-part="top-bar"]'),
  row('GlassSidebar', '[data-ag-part="sidebar"] [data-ag-part="sidebar-nav"]', { onNavigate: jest.fn(), onCollapsedChange: jest.fn() }),
  row('GlassMain', 'main[data-ag-slot="main"]'),
  row('GlassPageHeader', '[data-ag-part="page-header"]'),
  row('GlassStatusBar', '[data-ag-part="status-bar"]'),
  row('GlassInspector', 'aside[data-ag-part="inspector"][aria-label="Details"]'),
  row('GlassMobileShell', '.ag-app-shell[data-ag-layout="compact"]'),
  row('ZSpaceAppLayout', '.ag-app-shell [data-ag-slot="main"]'),
  row('GlassTabs', '[data-ag-part="tabs"]'),
  row('GlassPageTabs', '[data-ag-part="tabs"] [role="tabpanel"]', { onChange: jest.fn() }),
  row('GlassTabBar', '[data-ag-part="tab-bar"]', { onChange: jest.fn() }),
  row('GlassWorkspaceTabs', '[data-ag-part="tabs"]', { onValueChange: jest.fn() }),
  row('LiquidGlassTabBar', '[data-ag-part="tab-bar"][data-ag-appearance="floating"]', { onChange: jest.fn() }),
  row('GlassBottomNav', '[data-ag-part="tab-bar"][data-ag-placement="bottom"]', { onActiveChange: jest.fn() }),
  row('LiquidGlassBottomAccessory', '[data-ag-part="tab-bar-accessory"]'),
  row('GlassMobileNav', '[data-ag-part="popup"] [data-ag-part="sidebar-nav"]', { onOpenChange: jest.fn() }),
  row('GlassBreadcrumb', 'nav[data-ag-part="breadcrumbs"]'),
  row('GlassPagination', '[data-ag-part="pagination"]', { onPageChange: jest.fn() }),
  row('GlassCommandPalette', '[data-ag-part="command-palette"] [data-ag-part="command"]', { onOpenChange: jest.fn(), onSelect: jest.fn() }),
  row('GlassCommand', '[data-ag-part="command"]', { onSelect: jest.fn() }),
  row('LiquidGlassCommandSurface', '[data-ag-part="command-palette"] [data-ag-part="command"]', { onOpenChange: jest.fn() }),
  row('LiquidGlassTransitionProvider', '[data-ag-part="source-transition"]'),
  row('LiquidGlassSource', '[data-ag-part="source"]'),
  row('LiquidGlassDestination', '[data-ag-part="destination"]'),
  row('GlassSplitPane', '[data-ag-part="resizable-panels"] [data-ag-part="resize-handle"]', { onSplitChange: jest.fn() }),
  row('GlassNavigationMenu', 'nav[data-ag-part="sidebar-nav"]', { onItemClick: jest.fn() }),
  row('LiquidGlassInsetSidebar', '[data-ag-part="sidebar"][data-ag-appearance="inset"]', { onSelect: jest.fn() }),
  row('LiquidGlassInspectorPanel', 'aside[data-ag-part="inspector"] [data-ag-part="inspector-content"]', { onOpenChange: jest.fn() }),
  row('GlassSidebarRail', '[data-ag-part="sidebar"] [data-ag-part="sidebar-nav"]'),
  row('GlassSidebarPanel', '[data-ag-part="sidebar"] [data-ag-part="sidebar-content"]'),
  row('GlassBreadcrumbs', 'nav[data-ag-part="breadcrumbs"] [aria-current="page"]'),
  row('GlassPage', '.ag-container[data-ag-size="xl"]'),
];

describe('W1 compat adapters render from 4.x story props (REQ-SURF-13)', () => {
  it.each(W1_ROWS.map((r) => [r.name, r] as const))('%s', (_name, r) => {
    expectAdapter(r);
  });
});

describe('W1 prop mapping', () => {
  const quiet = () => jest.spyOn(console, 'warn').mockImplementation(() => undefined);

  it('GlassAppShell maps sidebarPlacement → sidebarSide and collapsed → defaultSidebar, wrapping each slot', () => {
    quiet();
    const { container } = render(
      <compat.GlassAppShell topBar="Top" sidebar="Side" statusBar="Status" actionBar="Actions" sidebarPlacement="right" collapsed>
        Body
      </compat.GlassAppShell>,
    );
    const root = container.querySelector('.ag-app-shell')!;
    expect(root.getAttribute('data-ag-sidebar-side')).toBe('end');
    expect(root.getAttribute('data-ag-sidebar')).toBe('rail');
    expect(root.querySelector('[data-ag-part="top-bar"]')!.textContent).toBe('Top');
    expect(root.querySelector('[data-ag-part="sidebar"]')!.textContent).toBe('Side');
    expect(root.querySelector('[data-ag-slot="main"]')!.textContent).toBe('ActionsBody');
    expect(root.querySelector('[data-ag-part="status-bar"]')!.textContent).toBe('Status');
    // 4.x-only props never reach the DOM.
    const legacy = render(<compat.GlassAppShell padding="lg" maxWidth="full" density="compact">x</compat.GlassAppShell>);
    const legacyRoot = legacy.container.querySelector('.ag-app-shell')!;
    expect(legacyRoot.hasAttribute('padding')).toBe(false);
    expect(legacyRoot.hasAttribute('maxwidth')).toBe(false);
    expect(legacyRoot.getAttribute('data-ag-sidebar')).toBe('expanded');
    expect(legacyRoot.getAttribute('data-ag-sidebar-side')).toBe('start');
    cleanup();
  });

  it('GlassSidebar marks activeId current and handler-only items render as <button type="button">', () => {
    quiet();
    const onNavigate = jest.fn();
    const { container } = render(<compat.GlassSidebar {...A.GlassSidebar!.props} onNavigate={onNavigate} />);
    const current = container.querySelector('[aria-current="page"]')!;
    expect(current.textContent).toContain('Projects');
    expect(current.tagName).toBe('BUTTON');
    expect(current.getAttribute('type')).toBe('button');
    fireEvent.click(current);
    expect(onNavigate).toHaveBeenCalledWith(expect.objectContaining({ id: 'projects' }));
    cleanup();
  });

  it('GlassTabBar maps the 4.x activeTab index and onChange(event, index)', () => {
    quiet();
    const onChange = jest.fn();
    const { container } = render(<compat.GlassTabBar {...A.GlassTabBar!.props} onChange={onChange} />);
    expect(container.querySelector('[aria-current="page"]')!.textContent).toContain('Audience');
    fireEvent.click(container.querySelectorAll('[data-ag-part="tab-bar-item"]')[2]!);
    expect(onChange).toHaveBeenCalledWith(null, 2);
    cleanup();
  });

  it('GlassPageTabs renders one real panel per tab and reports onChange(value)', () => {
    quiet();
    const onChange = jest.fn();
    const { container } = render(<compat.GlassPageTabs {...A.GlassPageTabs!.props} onChange={onChange} />);
    expect(container.querySelectorAll('[role="tab"]')).toHaveLength(3);
    fireEvent.click(container.querySelectorAll('[role="tab"]')[1]!);
    expect(onChange).toHaveBeenCalledWith('activity');
    cleanup();
  });

  it('GlassPagination maps currentPage/totalPages onto page/pageCount', () => {
    quiet();
    const onPageChange = jest.fn();
    const { container } = render(<compat.GlassPagination currentPage={2} totalPages={9} onPageChange={onPageChange} />);
    expect(container.querySelector('[aria-current="page"]')!.textContent).toContain('2');
    fireEvent.click(container.querySelector('[data-ag-part="next"]')!);
    expect(onPageChange).toHaveBeenCalledWith(3);
    cleanup();
  });

  it('GlassSplitPane maps initial → defaultLayout and direction → orientation', () => {
    quiet();
    const { container } = render(<compat.GlassSplitPane {...A.GlassSplitPane!.props} initial={30} direction="vertical" />);
    const handle = container.querySelector('[data-ag-part="resize-handle"]')!;
    expect(handle.getAttribute('aria-orientation')).toBe('horizontal');
    const panels = container.querySelectorAll<HTMLElement>('[data-ag-part="resizable-panel"]');
    expect(panels[0]!.style.flexBasis).toBe('30%');
    expect(panels[1]!.style.flexBasis).toBe('70%');
    expect(handle.getAttribute('aria-valuemin')).toBe('20');
    cleanup();
  });

  it('LiquidGlassInspectorPanel renders nothing when closed and maps sections to Inspector.Section', () => {
    quiet();
    const closed = render(<compat.LiquidGlassInspectorPanel {...A.LiquidGlassInspectorPanel!.props} open={false} />);
    expect(closed.container.innerHTML).toBe('');
    cleanup();
    const onOpenChange = jest.fn();
    const { container } = render(<compat.LiquidGlassInspectorPanel {...A.LiquidGlassInspectorPanel!.props} onOpenChange={onOpenChange} />);
    expect(container.querySelectorAll('[data-ag-part="inspector-section"]')).toHaveLength(2);
    fireEvent.click(container.querySelector('[data-ag-part="inspector-header"] button')!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    cleanup();
  });

  it('GlassSidebarPanel collapsed is hidden + inert (no focusable children left in the a11y tree)', () => {
    quiet();
    const { container } = render(<compat.GlassSidebarPanel title="Filters" collapsed><a href="#x">Link</a></compat.GlassSidebarPanel>);
    const aside = container.querySelector('[data-ag-part="sidebar"]')!;
    expect(aside.hasAttribute('hidden')).toBe(true);
    expect(aside.hasAttribute('inert')).toBe(true);
    expect(aside.getAttribute('aria-hidden')).toBeNull();
    cleanup();
  });
});
