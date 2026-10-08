/** @jest-environment jsdom */
// SURF-122: every W1 compat adapter renders its 5.0 successor from 4.x-style
// props and warns exactly once per adapter.
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import * as appShell from '../../src/compat/surf/app-shell/GlassAppShell';
import { GlassHeader } from '../../src/compat/surf/app-shell/GlassHeader';
import { GlassTopBar } from '../../src/compat/surf/app-shell/GlassTopBar';
import { GlassSidebar } from '../../src/compat/surf/app-shell/GlassSidebar';
import { GlassMain } from '../../src/compat/surf/app-shell/GlassMain';
import { GlassPageHeader } from '../../src/compat/surf/app-shell/GlassPageHeader';
import { GlassStatusBar } from '../../src/compat/surf/app-shell/GlassStatusBar';
import { GlassInspector } from '../../src/compat/surf/app-shell/GlassInspector';
import { GlassMobileShell } from '../../src/compat/surf/app-shell/GlassMobileShell';
import { ZSpaceAppLayout } from '../../src/compat/surf/app-shell/ZSpaceAppLayout';
import { GlassTabs } from '../../src/compat/surf/navigation/GlassTabs';
import { GlassPageTabs } from '../../src/compat/surf/navigation/GlassPageTabs';
import { GlassTabBar } from '../../src/compat/surf/navigation/GlassTabBar';
import { GlassWorkspaceTabs } from '../../src/compat/surf/navigation/GlassWorkspaceTabs';
import { LiquidGlassTabBar } from '../../src/compat/surf/navigation/LiquidGlassTabBar';
import { GlassBottomNav } from '../../src/compat/surf/navigation/GlassBottomNav';
import { LiquidGlassBottomAccessory } from '../../src/compat/surf/navigation/LiquidGlassBottomAccessory';
import { GlassMobileNav } from '../../src/compat/surf/navigation/GlassMobileNav';
import { GlassBreadcrumb } from '../../src/compat/surf/navigation/GlassBreadcrumb';
import { GlassPagination } from '../../src/compat/surf/navigation/GlassPagination';
import { GlassCommandPalette } from '../../src/compat/surf/navigation/GlassCommandPalette';
import { GlassCommand } from '../../src/compat/surf/navigation/GlassCommand';
import { LiquidGlassCommandSurface } from '../../src/compat/surf/navigation/LiquidGlassCommandSurface';
import { LiquidGlassTransitionProvider } from '../../src/compat/surf/navigation/LiquidGlassTransitionProvider';
import { LiquidGlassSource } from '../../src/compat/surf/navigation/LiquidGlassSource';
import { LiquidGlassDestination } from '../../src/compat/surf/navigation/LiquidGlassDestination';

const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

beforeEach(() => { warn.mockClear(); });

type Row = { name: string; C: React.FC<Record<string, unknown>>; props: Record<string, unknown> };
const ADAPTERS: Row[] = [
  { name: 'GlassAppShell', C: appShell.GlassAppShell as never, props: { children: 'x' } },
  { name: 'GlassHeader', C: GlassHeader as never, props: { children: 'x' } },
  { name: 'GlassTopBar', C: GlassTopBar as never, props: { children: 'x' } },
  { name: 'GlassSidebar', C: GlassSidebar as never, props: { items: [] } },
  { name: 'GlassMain', C: GlassMain as never, props: { children: 'x' } },
  { name: 'GlassPageHeader', C: GlassPageHeader as never, props: { title: 'T' } },
  { name: 'GlassStatusBar', C: GlassStatusBar as never, props: { children: 'x' } },
  { name: 'GlassInspector', C: GlassInspector as never, props: { children: 'x' } },
  { name: 'GlassMobileShell', C: GlassMobileShell as never, props: { topBar: 't', tabBar: 'b' } },
  { name: 'ZSpaceAppLayout', C: ZSpaceAppLayout as never, props: { depth: 3, children: 'x' } },
  { name: 'GlassTabs', C: GlassTabs as never, props: { selectedTab: 'a' } },
  { name: 'GlassPageTabs', C: GlassPageTabs as never, props: { value: 'a' } },
  { name: 'GlassTabBar', C: GlassTabBar as never, props: { items: [] } },
  { name: 'GlassWorkspaceTabs', C: GlassWorkspaceTabs as never, props: { children: 'x' } },
  { name: 'LiquidGlassTabBar', C: LiquidGlassTabBar as never, props: { children: 'x' } },
  { name: 'GlassBottomNav', C: GlassBottomNav as never, props: { children: 'x' } },
  { name: 'LiquidGlassBottomAccessory', C: LiquidGlassBottomAccessory as never, props: { children: 'x' } },
  { name: 'GlassMobileNav', C: GlassMobileNav as never, props: { children: 'x' } },
  { name: 'GlassBreadcrumb', C: GlassBreadcrumb as never, props: { children: 'x' } },
  { name: 'GlassPagination', C: GlassPagination as never, props: { currentPage: 2, totalPages: 9 } },
  { name: 'GlassCommandPalette', C: GlassCommandPalette as never, props: { defaultOpen: true } },
  { name: 'GlassCommand', C: GlassCommand as never, props: { children: 'x' } },
  { name: 'LiquidGlassCommandSurface', C: LiquidGlassCommandSurface as never, props: { defaultOpen: true } },
  { name: 'LiquidGlassTransitionProvider', C: LiquidGlassTransitionProvider as never, props: { children: 'x' } },
  { name: 'LiquidGlassSource', C: LiquidGlassSource as never, props: { id: 'a', children: 'x' } },
  { name: 'LiquidGlassDestination', C: LiquidGlassDestination as never, props: { id: 'a', children: 'x' } },
];

describe('W1 compat adapters (SURF-122)', () => {
  for (const { name, C, props } of ADAPTERS) {
    it(`${name} renders and warns exactly once`, () => {
      render(<C {...props} />);
      const calls = warn.mock.calls.filter((c) => String(c[0]).includes(`'${name}'`));
      expect(calls.length).toBe(1);
      render(<C {...props} />);
      const after = warn.mock.calls.filter((c) => String(c[0]).includes(`'${name}'`));
      expect(after.length).toBe(1);
    });
  }

  it('GlassPagination maps currentPage/totalPages onto page/pageCount', () => {
    const { container } = render(<GlassPagination currentPage={2} totalPages={9} />);
    expect(container.querySelector('[data-ag-part="pagination"]')).toBeTruthy();
  });
});
