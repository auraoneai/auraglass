/* @jest-environment node */
/* MAT-184 — lens maps + LensDefs: 9 ids, generator determinism, no
   feTurbulence, <= 3 KB per map, LensDefs server-safe. */
import { describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { LensDefs, LENS_IDS } from '../lens/LensDefs';

const LENS_DIR = join(__dirname, '../assets/lens');
const ID_RE = /^ag-lens-(fixed|capsule|concentric)-(control|bar|panel)$/;

describe('lens maps', () => {
  it('exactly 9 files with contract ids', () => {
    const files = readdirSync(LENS_DIR).filter((f) => f.endsWith('.png'));
    expect(files.length).toBe(9);
    for (const f of files) expect(f.replace('.png', '')).toMatch(ID_RE);
  });

  it('each map is <= 3 KB', () => {
    for (const f of readdirSync(LENS_DIR)) {
      expect(readFileSync(join(LENS_DIR, f)).length).toBeLessThanOrEqual(3072);
    }
  });

  it('generator is deterministic (drift check via --check)', async () => {
    const { execFileSync } = require('node:child_process') as typeof import('node:child_process');
    const out = execFileSync('node', ['scripts/tokens/lens-maps.mjs', '--check'], {
      cwd: join(__dirname, '../../..'), encoding: 'utf8',
    });
    expect(out).toContain('check OK');
  });
});

describe('LensDefs', () => {
  it('renders 9 filters with data-ag-lens-defs + data-ag-lens-ready', () => {
    const html = renderToString(React.createElement(LensDefs));
    expect(html).toContain('data-ag-lens-defs');
    expect(html).toContain('data-ag-lens-ready');
    expect(html).toContain('aria-hidden="true"');
    const ids = [...html.matchAll(/id="(ag-lens-[^"]+)"/g)].map((m) => m[1]);
    expect(ids.length).toBe(9);
    for (const id of ids) expect(id).toMatch(ID_RE);
  });

  it('uses feImage -> feDisplacementMap with static scale, no feTurbulence', () => {
    const html = renderToString(React.createElement(LensDefs));
    expect(html).not.toContain('feTurbulence');
    expect((html.match(/<feImage[\s/>]/g) ?? []).length).toBe(9);
    expect((html.match(/<feDisplacementMap[\s/>]/g) ?? []).length).toBe(9);
    // static scales: thin=8 (control), regular=12 (bar), thick=18 (panel)
    for (const s of ['8', '12', '18']) expect(html).toContain(`scale="${s}"`);
  });

  it('feImage hrefs are data: URIs byte-identical to the committed PNGs', () => {
    // document-base-URL independent (package ships dist/ only)
    const html = renderToString(React.createElement(LensDefs));
    const hrefs = [...html.matchAll(/<feImage[^>]*href="data:image\/png;base64,([^"]+)"/g)];
    expect(hrefs.length).toBe(9);
    for (const [i, m] of hrefs.entries()) {
      const id = LENS_IDS[i];
      const committed = readFileSync(join(LENS_DIR, `${id}.png`));
      expect(Buffer.from(m[1]!, 'base64').equals(committed)).toBe(true);
    }
  });

  it('has no use-client directive in its module', () => {
    const src = readFileSync(join(__dirname, '../lens/LensDefs.tsx'), 'utf8');
    expect(src).not.toMatch(/^['"]use client['"]/m);
    const hooks = src.match(/use(State|Effect|SyncExternalStore|LayoutEffect)/g) ?? [];
    expect(hooks).toEqual([]);
  });
});
