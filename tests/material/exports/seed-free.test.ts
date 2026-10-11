/* @jest-environment node */
/* tests/material/exports/seed-free.test.ts — REQ-FIN-52 seed clause (FIN-D D.2-01; REQ-MAT-14/15/16).
   The C0 seed bodies of the theme and motion public surfaces were replaced (#369:
   ab362c747, 311777e40). This test pins that:
   - none of src/theme/createGlassTheme.ts, src/theme/public.ts, src/motion/public.ts
     carries the line-1 contract-seed header (the REQ-FIN-06 seed rule:
     /^\/[*\/] @ag-contract-seed:/ on the first line);
   - the export generator no longer holds back any of the nine entries whose closures
     reached those files (., ./theme, ./motion, ./primitives, ./app-shell, ./ai, ./media,
     ./backdrops, ./compat);
   - the `aura-glass/theme` subpath, resolved through package.json "exports" and
     build/exports.manifest.json to its source, exposes a working createGlassTheme.
   The packed-tarball half (`import('aura-glass')` → Button) runs remotely in GitLab CI. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(__dirname, '../../..');
const SEED_HEADER = /^\/[*/] @ag-contract-seed:/;

const SEED_REPLACED_FILES = [
  'src/theme/createGlassTheme.ts',
  'src/theme/public.ts',
  'src/motion/public.ts',
] as const;

/** The nine entries REQ-FIN-06 reported as excluded on next @ 84a3b94f1. */
const FORMERLY_EXCLUDED = [
  '.', './theme', './motion', './primitives', './app-shell', './ai', './media', './backdrops', './compat',
] as const;

const readJson = (rel: string) => JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));

/** Parse `generate-exports.mjs --list-entries` into built and pending subpaths. */
function listEntries(): { built: string[]; pending: string[] } {
  const out = execFileSync('node', ['scripts/build/generate-exports.mjs', '--list-entries'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  const built: string[] = [];
  const pending: string[] = [];
  let section: 'built' | 'pending' | null = null;
  for (const line of out.split('\n')) {
    if (line.startsWith('exports (built):')) section = 'built';
    else if (line.startsWith('pending')) section = 'pending';
    else if (section && /^\s+\S/.test(line)) (section === 'built' ? built : pending).push(line.trim().split(/\s+/)[0]);
  }
  return { built, pending };
}

describe('REQ-FIN-52 seed-free theme/motion surfaces', () => {
  it.each(SEED_REPLACED_FILES)('%s line 1 carries no @ag-contract-seed header', (rel) => {
    const firstLine = readFileSync(join(ROOT, rel), 'utf8').split('\n', 1)[0];
    expect(firstLine).not.toMatch(SEED_HEADER);
  });

  it('the seed-header regex itself matches both real seed comment forms', () => {
    // Guards against a regex that can never match (which would make the test above vacuous).
    expect('/* @ag-contract-seed: S-21 owner MAT').toMatch(SEED_HEADER);
    expect('// @ag-contract-seed: S-21 owner MAT').toMatch(SEED_HEADER);
    expect(' * @ag-contract-seed: not on line 1 form').not.toMatch(SEED_HEADER);
  });

  it('generate-exports builds every formerly seed-gated entry and holds none back', () => {
    const { built, pending } = listEntries();
    for (const sub of FORMERLY_EXCLUDED) {
      expect(built).toContain(sub);
      expect(pending).not.toContain(sub);
    }
    const pkg = readJson('package.json');
    for (const sub of FORMERLY_EXCLUDED) expect(pkg.exports).toHaveProperty([sub]);
  });

  it("import('aura-glass/theme') exposes a working createGlassTheme", async () => {
    const pkg = readJson('package.json');
    const cond = pkg.exports['./theme'] as { types: string; default: string };
    expect(cond).toBeDefined();
    // Map the published dist target back to its source through the manifest (the
    // bare `aura-glass/*` specifier needs contract C-4's moduleNameMapper in Jest).
    const entry = (readJson('build/exports.manifest.json').entries as Array<{ subpath: string; source: string; default: string }>)
      .find((e) => e.subpath === './theme');
    expect(entry).toBeDefined();
    expect('./' + entry!.default).toBe(cond.default);
    const mod = await import(pathToFileURL(join(ROOT, entry!.source)).href);
    expect(typeof mod.createGlassTheme).toBe('function');
    const theme = mod.createGlassTheme({ id: 'seed-free' });
    expect(theme.cssText).toMatch(/^\[data-ag-theme="seed-free"\]\s*\{[^}]*\}$/);
    expect(Object.keys(theme.vars).length).toBeGreaterThan(0);
    for (const name of Object.keys(theme.vars)) expect(name.startsWith('--ag-')).toBe(true);
  });
});
