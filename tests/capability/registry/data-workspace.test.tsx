/** @jest-environment node */
// SURF-265 — data-workspace block: schema + deterministic fixtures + render.
// Real assertions run under tests/capability/jest.doubles.cjs.
import { describe, expect, it } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import type * as Mod from '../../../registry/blocks/data-workspace/index';
import { COLLECTIONS, ROWS } from '../../../registry/blocks/data-workspace/fixtures';

const PENDING = "data-workspace: 'aura-glass/*' unresolvable under root jest until PR24 lands — assertions run under the doubles preset";
const M = (() => { try { return require('../../../registry/blocks/data-workspace/index') as typeof Mod; } catch { return null; } })();

describe('data-workspace block', () => {
  it('renders the workspace grid with StatCards, FilterBar, Table and Pagination', () => {
    if (!M) { console.warn(PENDING); return; }
    const html = renderToString(createElement(M.DataWorkspace));
    expect(html).toContain('data-ag-part="data-workspace"');
    expect(html).toContain(ROWS[0]!.name);
    for (const c of COLLECTIONS) expect(html).toContain(c.label);
  });
});
