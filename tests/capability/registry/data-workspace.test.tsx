/** @jest-environment node */
// SURF-265 — data-workspace block: schema + deterministic fixtures + render.
// Rendered against the real library sources (REQ-SURF-171).
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

import { DataWorkspace } from '../../../registry/blocks/data-workspace/index';
import { COLLECTIONS, ROWS } from '../../../registry/blocks/data-workspace/fixtures';

describe('data-workspace block', () => {
  it('renders the workspace grid with StatCards, FilterBar, Table and Pagination', () => {
    const html = renderToString(createElement(DataWorkspace));
    expect(html).toContain('data-ag-part="data-workspace"');
    expect(html).toContain(ROWS[0]!.name);
    for (const c of COLLECTIONS) expect(html).toContain(c.label);
  });
});
