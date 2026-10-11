/** @jest-environment node */
// tests/ai/side-effects-gate.test.ts — REQ-SURF-06 (AC-SURF-03): the SURF dist
// side-effect gate scripts/surf/verify-side-effects.mjs. It runs PLAT's real
// trap (tests/side-effects/trap.mjs, jsdom realm) over a planted dist/ tree in
// a temp dir, so the planted-violation and clean cases exercise the same code
// path CI runs over the built package.

import { afterEach, describe, expect, it } from '@jest/globals';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const gate = require('../../scripts/surf/verify-side-effects.mjs') as {
  SURF_ENTRIES: string[];
  isSurfModule: (m: string) => boolean;
  evaluate: (i: { observed: Array<{ api: string; module: string }>; surfExceptions: unknown[]; distFiles: Set<string> }) => {
    ok: boolean;
    errors: string[];
    surfCalls: unknown[];
    otherCalls: unknown[];
    missingEntries: string[];
  };
  runGate: (o: { root?: string; distRoot?: string; write?: boolean }) => Promise<ReturnType<typeof gate.evaluate>>;
};

const ROOT = join(__dirname, '..', '..');
const allEntries = () => new Set(gate.SURF_ENTRIES.map((e) => `dist/${e}/index.js`));

describe('SURF side-effect gate: evaluate()', () => {
  it('passes with every SURF entry present, no SURF calls and an empty surf fragment', () => {
    const r = gate.evaluate({ observed: [{ api: 'window.addEventListener', module: 'dist/foundation/x.js' }], surfExceptions: [], distFiles: allEntries() });
    expect(r).toEqual(expect.objectContaining({ ok: true, errors: [], surfCalls: [], missingEntries: [] }));
    expect(r.otherCalls).toHaveLength(1);
  });

  it('fails on a recorded call from any SURF-owned dist module', () => {
    const observed = [
      { api: 'window.setTimeout', module: 'dist/ai/thread/Thread.js' },
      { api: 'new ResizeObserver', module: 'dist/components/tabs/Tabs.js' },
      { api: 'window.addEventListener', module: 'dist/root/surf.js' },
    ];
    const r = gate.evaluate({ observed, surfExceptions: [], distFiles: allEntries() });
    expect(r.ok).toBe(false);
    expect(r.errors).toEqual([
      'undeclared window.setTimeout in dist/ai/thread/Thread.js',
      'undeclared new ResizeObserver in dist/components/tabs/Tabs.js',
      'undeclared window.addEventListener in dist/root/surf.js',
    ]);
  });

  it('fails when fragments/side-effects/surf.ts declares any exception', () => {
    const r = gate.evaluate({ observed: [], surfExceptions: [{ module: 'dist/ai/index.js', expires: '5.1.0' }], distFiles: allEntries() });
    expect(r.ok).toBe(false);
    expect(r.errors).toEqual(['fragments/side-effects/surf.ts must be [] (has 1 row(s))']);
  });

  it('fails closed when a SURF entry is missing from dist', () => {
    const files = allEntries();
    files.delete('dist/media/index.js');
    const r = gate.evaluate({ observed: [], surfExceptions: [], distFiles: files });
    expect(r.ok).toBe(false);
    expect(r.missingEntries).toEqual(['dist/media/index.js']);
  });

  it('classifies SURF ownership by dist path, not by substring', () => {
    expect(gate.isSurfModule('dist/data/table/Table.js')).toBe(true);
    expect(gate.isSurfModule('dist/compat/surf/index.js')).toBe(true);
    expect(gate.isSurfModule('dist/compat/mat/index.js')).toBe(false);
    expect(gate.isSurfModule('dist/components/button/Button.js')).toBe(false);
    expect(gate.isSurfModule('dist/database/x.js')).toBe(false);
  });
});

describe('SURF side-effect gate: runGate() over a planted dist with the PLAT trap', () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
  });

  const plant = (files: Record<string, string>) => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-surf-sidefx-'));
    dirs.push(dir);
    for (const [rel, body] of Object.entries(files)) {
      mkdirSync(dirname(join(dir, rel)), { recursive: true });
      writeFileSync(join(dir, rel), body);
    }
    return dir;
  };
  const cleanEntries = () => Object.fromEntries(gate.SURF_ENTRIES.map((e) => [`dist/${e}/index.js`, 'export const x = 1;\n']));

  it('records 0 SURF calls for side-effect-free entries', async () => {
    const distRoot = plant(cleanEntries());
    const r = await gate.runGate({ root: ROOT, distRoot, write: false });
    expect(r.errors).toEqual([]);
    expect(r.ok).toBe(true);
  }, 60_000);

  // Planted through window.* — the PLAT trap wraps the jsdom window's APIs;
  // bare Node globals (setTimeout, queueMicrotask) are a trap gap handed to
  // FIN-C (scripts/ci + tests/side-effects are PLAT files).
  it('fails on a module-scope listener, timer and observer planted in SURF modules', async () => {
    const distRoot = plant({
      ...cleanEntries(),
      'dist/ai/index.js': "window.addEventListener('keydown', () => {});\nwindow.setTimeout(() => {}, 10);\nexport const x = 1;\n",
      'dist/data/table/store.js': 'new window.MutationObserver(() => {});\nexport const y = 2;\n',
      'dist/foundation/other.js': "window.addEventListener('resize', () => {});\nexport const z = 3;\n",
    });
    const r = await gate.runGate({ root: ROOT, distRoot, write: false });
    expect(r.ok).toBe(false);
    expect(r.surfCalls).toEqual([
      { api: 'window.addEventListener', module: 'dist/ai/index.js' },
      { api: 'window.setTimeout', module: 'dist/ai/index.js' },
      { api: 'new MutationObserver', module: 'dist/data/table/store.js' },
    ]);
    expect(r.otherCalls).toEqual([{ api: 'window.addEventListener', module: 'dist/foundation/other.js' }]);
  }, 60_000);

  it('fails closed without dist/', async () => {
    const distRoot = plant({ 'README.md': 'no dist\n' });
    const r = await gate.runGate({ root: ROOT, distRoot, write: false });
    expect(r.ok).toBe(false);
    expect(r.errors[0]).toMatch(/dist\/ missing/);
  });
});
