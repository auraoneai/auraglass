/** @jest-environment node */
// SURF-240 — analytics-dashboard block render test against the real library sources (REQ-SURF-171).
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

import { AnalyticsDashboard } from '../../../registry/blocks/analytics-dashboard/index';
import { EVENTS, STATS } from '../../../registry/blocks/analytics-dashboard/fixtures';

describe('analytics-dashboard block', () => {
  it('renders stat cards, chart frame title and the timeline', () => {
    const html = renderToString(createElement(AnalyticsDashboard));
    expect(html).toContain('data-ag-part="analytics-dashboard"');
    for (const s of STATS) expect(html).toContain(s.label);
    expect(html).toContain('Product revenue');
    for (const e of EVENTS) expect(html).toContain(e.title);
  });
});
