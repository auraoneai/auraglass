/** @jest-environment node */
// SURF-133 — app-frame block: schema, registryDependencies, deterministic
// fixtures, renders AppShell + Sidebar + TopBar + StatusBar + Inspector from
// public entries, rendered against the real library sources (REQ-SURF-171).
import { describe, expect, it, jest } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
// 'aura-glass' / 'aura-glass/<entry>' are not mapped by the root jest config
// yet (REQ-FIN-09 / contract C-4, FIN-A): alias them to their
// src/contracts/entries.ts sources — the real modules, never doubles.
jest.mock('aura-glass', () => jest.requireActual('../../../src/index'), { virtual: true });
jest.mock('aura-glass/app-shell', () => jest.requireActual('../../../src/app-shell/index'), { virtual: true });
jest.mock('aura-glass/data', () => jest.requireActual('../../../src/data/index'), { virtual: true });
jest.mock('aura-glass/ai', () => jest.requireActual('../../../src/ai/index'), { virtual: true });
jest.mock('aura-glass/media', () => jest.requireActual('../../../src/media/index'), { virtual: true });
jest.mock('aura-glass/backdrops', () => jest.requireActual('../../../src/backdrops/index'), { virtual: true });
jest.mock('aura-glass/theme', () => jest.requireActual('../../../src/theme/public'), { virtual: true });

import { AppFrame } from '../../../registry/blocks/app-frame/index';
import { APP_NAV, APP_TITLE } from '../../../registry/blocks/app-frame/fixtures';

describe('app-frame block', () => {
  it('renders AppShell with sidebar, top bar, status bar and inspector', () => {
    const html = renderToString(createElement(AppFrame));
    expect(html).toContain('data-ag-part="sidebar"');
    expect(html).toContain('data-ag-part="top-bar"');
    expect(html).toContain('data-ag-part="status-bar"');
    expect(html).toContain('data-ag-part="inspector"');
    expect(html).toContain(APP_TITLE);
  });
  it('renders every fixture nav item as a link', () => {
    const html = renderToString(createElement(AppFrame));
    for (const item of APP_NAV) {
      expect(html).toContain(item.href);
      expect(html).toContain(item.label);
    }
  });
  it('renders children inside Main', () => {
    const html = renderToString(
      createElement(AppFrame, {}, createElement('p', null, 'workspace-children'))
    );
    expect(html).toContain('workspace-children');
  });
});
