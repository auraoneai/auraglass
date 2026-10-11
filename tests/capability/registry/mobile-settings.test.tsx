/** @jest-environment jsdom */
// SURF-132 / REQ-SURF-171 — mobile-settings block: MobileShell + labelled
// TabBar + CMP Sheet trigger, rendered against the real library sources.
// Primary-control geometry (>=44x44 via --ag-target-coarse in
// mobile-settings.css) is certified by the L11 browser render harness; jsdom
// has no layout, so here we assert the touch-target hooks are applied.
import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import { createElement } from 'react';
// 'aura-glass' / 'aura-glass/<entry>' are not mapped by the root jest config
// yet (REQ-FIN-09 / contract C-4, FIN-A): alias them to their
// src/contracts/entries.ts sources — the real modules, never doubles.
jest.mock('aura-glass', () => jest.requireActual('../../../src/index'), { virtual: true });
jest.mock('aura-glass/app-shell', () => jest.requireActual('../../../src/app-shell/index'), { virtual: true });
jest.mock('aura-glass/theme', () => jest.requireActual('../../../src/theme/public'), { virtual: true });

import { MobileSettings } from '../../../registry/blocks/mobile-settings/index';
import { SETTINGS_TABS } from '../../../registry/blocks/mobile-settings/fixtures';
import { AuraGlassProvider } from '../../../src/theme/public';

const renderBlock = () => render(createElement(AuraGlassProvider, null, createElement(MobileSettings)));

describe('mobile-settings block', () => {
  it('renders the mobile shell with a labelled tab bar', () => {
    const { container } = renderBlock();
    expect(container.querySelector('[data-ag-slot="tabbar"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="Settings sections"]')).toBeTruthy();
  });
  it('renders every fixture tab as a link', () => {
    const { container } = renderBlock();
    for (const tab of SETTINGS_TABS) {
      const link = container.querySelector(`a[href="#${tab.id}"]`);
      expect(link).toBeTruthy();
      expect(link!.textContent).toBe(tab.label);
    }
  });
  it('primary controls carry the touch-target hooks', () => {
    const { container } = renderBlock();
    expect(container.querySelectorAll('.ag-tab-bar__item')).toHaveLength(SETTINGS_TABS.length);
    const trigger = container.querySelector('[data-ag-part="trigger"]');
    expect(trigger).toBeTruthy();
    expect(trigger!.classList.contains('ag-mobile-settings__control')).toBe(true);
  });
});
