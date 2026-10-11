/* @jest-environment node */
/* REQ-PLAT-77 item 2 (PLAT-288): the next canaries' app/plat/server/page.tsx is
   generated from build/server-safe-exports.json — only safe:true subpaths that
   package.json exports are imported; a missing map is a usage error (exit 2). */
import { afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

type Gen = {
  importableSubpaths: (map: unknown, keys: string[]) => { safe: string[]; skipped: { subpath: string; reason: string }[] };
  renderServerPage: (subpaths: string[]) => string;
  main: (root: string) => number;
  CANARIES: string[];
};
let gen: Gen;
beforeAll(async () => { gen = (await import('../../../scripts/ci/gen-server-page.mjs')) as unknown as Gen; });

const MAP = {
  entries: [
    { subpath: '.', safe: false },
    { subpath: './tokens', safe: true },
    { subpath: './icons', safe: true },
    { subpath: './internal', safe: true },
    { subpath: './material', safe: false },
  ],
};
const EXPORTS = ['.', './tokens', './icons', './material'];

let tmp: string | null = null;
afterEach(() => { if (tmp) rmSync(tmp, { recursive: true, force: true }); tmp = null; });

const fixtureRoot = (map: unknown | null) => {
  tmp = mkdtempSync(join(tmpdir(), 'ag-gen-server-page-'));
  writeFileSync(join(tmp, 'package.json'), JSON.stringify({ exports: Object.fromEntries(EXPORTS.map((k) => [k, {}])) }));
  if (map) {
    mkdirSync(join(tmp, 'build'));
    writeFileSync(join(tmp, 'build', 'server-safe-exports.json'), JSON.stringify(map));
  }
  return tmp;
};

describe('gen-server-page (PLAT-288)', () => {
  it('imports only safe:true subpaths that package.json exports', () => {
    const { safe, skipped } = gen.importableSubpaths(MAP, EXPORTS);
    expect(safe).toEqual(['./tokens', './icons']);
    expect(skipped).toEqual([
      { subpath: './internal', reason: 'not in package.json exports' },
      { subpath: './material', reason: 'safe:false' },
    ]);
  });

  it('renders a Server Component importing each subpath as a namespace', () => {
    const page = gen.renderServerPage(['./tokens', './icons']);
    expect(page).toContain("import * as mod___tokens from 'aura-glass/tokens';");
    expect(page).toContain("import * as mod___icons from 'aura-glass/icons';");
    expect(page).toContain("'tokens': mod___tokens,");
    expect(page).not.toMatch(/['"]use client['"]/);
    expect(page).not.toMatch(/\buse(State|Effect|Context)\b/);
    expect(page).not.toContain("'aura-glass/internal'");
  });

  it('writes the page into every next canary', () => {
    const root = fixtureRoot(MAP);
    expect(gen.main(root)).toBe(0);
    for (const c of gen.CANARIES) {
      const out = readFileSync(join(root, 'canaries', c, 'app', 'plat', 'server', 'page.tsx'), 'utf8');
      expect(out).toBe(gen.renderServerPage(['./tokens', './icons']));
    }
  });

  it('exits 2 when build/server-safe-exports.json is missing', () => {
    expect(gen.main(fixtureRoot(null))).toBe(2);
  });

  it('exits 2 when no server-safe subpath is exported', () => {
    expect(gen.main(fixtureRoot({ entries: [{ subpath: './internal', safe: true }] }))).toBe(2);
  });
});
