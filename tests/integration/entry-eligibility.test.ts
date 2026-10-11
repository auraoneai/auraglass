/** @jest-environment node */
import { test, expect, describe, beforeAll } from '@jest/globals';
/* REQ-FIN-06 / AC-FIN-06 (REQ-CMP-23, REQ-CMP-29 gate part): entry eligibility.
   (a) a line-1 `/* @ag-contract-seed:` (or `// @ag-contract-seed:`) file excludes
       every entry whose import closure reaches it;
   (b) the marker on line 4 is not a seed;
   (c) --check names the seed file, its owner (contracts/ownership.json) and the
       REQ-FIN that removes it, and exits 1 only on a stale exclusion;
   plus: ga:'5.1' entries are dropped on 5.0.x, contract pattern subpaths
   (./icons/*) and top-level main/types are regenerated. */
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let graph: any, gen: any, ROOT: string, FIXTURE: string, SCRIPT: string;
beforeAll(async () => {
  graph = await import('../../scripts/build/lib/graph.mjs');
  gen = await import('../../scripts/build/generate-exports.mjs');
  ROOT = graph.ROOT;
  FIXTURE = join(ROOT, 'tests/integration/fixtures/seed');
  SCRIPT = join(ROOT, 'scripts/build/generate-exports.mjs');
});

const run = (args: string[]) => spawnSync('node', [SCRIPT, ...args], { cwd: ROOT, encoding: 'utf8' });
const withFixtureCopy = (fn: (dir: string) => void) => {
  const dir = mkdtempSync(join(tmpdir(), 'seed-fix-'));
  cpSync(FIXTURE, dir, { recursive: true });
  try { fn(dir); } finally { rmSync(dir, { recursive: true, force: true }); }
};

describe('entry eligibility (REQ-FIN-06)', () => {
  test('(a)/(b) the seed marker counts only as a line-1 header', () => {
    expect(graph.fileIsSeed(join(FIXTURE, 'src/theme/createGlassTheme.ts'))).toBe(true); // /* form
    expect(graph.fileIsSeed(join(FIXTURE, 'src/motion/public.ts'))).toBe(true); // // form
    const lines = readFileSync(join(FIXTURE, 'src/notaseed.ts'), 'utf8').split('\n');
    expect(lines[3]).toContain('@ag-contract-seed:'); // the marker really is on line 4
    expect(graph.fileIsSeed(join(FIXTURE, 'src/notaseed.ts'))).toBe(false);
  });

  test('entries are partitioned by import closure, ga line and seed', () => {
    const { keep, pending } = graph.buildableEntries(FIXTURE);
    expect(keep.map((e: any) => e.subpath).sort()).toEqual(['.', './icons', './midfile']);
    expect(pending.map((e: any) => e.subpath).sort()).toEqual(['./future', './motion', './theme']);
    const theme = pending.find((e: any) => e.subpath === './theme');
    // ./theme's own source is clean: it is excluded through its closure
    expect(theme.seedFiles.map((f: string) => f.split('/src/').pop())).toEqual(['theme/createGlassTheme.ts']);
    const future = pending.find((e: any) => e.subpath === './future');
    expect(future.gaDropped).toBe(true);
    expect(future.reason).toBe("ga:'5.1' > 5.0 (ships on 5.1.x)");
  });

  test('ga lines come from the contract ENTRIES list', () => {
    const ga = graph.contractGaLines(FIXTURE);
    expect(ga.get('./future')).toBe('5.1');
    expect(ga.get('.')).toBe('5.0');
    expect(graph.contractGaLines(ROOT).get('./charts')).toBe('5.1');
    expect(graph.gaGate({ ga: '5.1' }, '5.1.0')).toBeNull();
    expect(graph.gaGate({ ga: '5.1' }, '5.0.3')).not.toBeNull();
  });

  test('(c) the exclusion report names seed file, owner and removing REQ-FIN', () => {
    const report = gen.exclusionReport(FIXTURE);
    const theme = report.find((r: any) => r.subpath === './theme');
    expect(theme.seedFiles).toEqual([{ file: 'src/theme/createGlassTheme.ts', owner: 'MAT', removingReqFin: expect.stringContaining('REQ-FIN-52') }]);
    const motion = report.find((r: any) => r.subpath === './motion');
    expect(motion.seedFiles).toEqual([{ file: 'src/motion/public.ts', owner: 'MAT', removingReqFin: expect.stringContaining('REQ-FIN-58') }]);
    expect(report.every((r: any) => r.stale === false)).toBe(true);
  });

  test('desired exports, pattern subpath and top-level main/types', () => {
    expect(gen.desiredExports(FIXTURE)).toEqual({
      '.': { types: './dist/index.d.ts', default: './dist/index.js' },
      './midfile': { types: './dist/notaseed.d.ts', default: './dist/notaseed.js' },
      './icons': { types: './dist/icons/index.d.ts', default: './dist/icons/index.js' },
      './icons/*': { types: './dist/icons/*.d.ts', default: './dist/icons/*.js' },
      './data.css': './dist/data.css',
    });
    expect(gen.desiredTopLevel(FIXTURE)).toEqual({ main: './dist/index.js', types: './dist/index.d.ts' });
  });

  test('--check: drifted package.json is stale (exit 1); --write converges; seed exclusions alone exit 0', () => {
    withFixtureCopy((dir) => {
      const stale = run(['--check', '--root', dir]);
      expect(stale.status).toBe(1);
      expect(stale.stderr).toContain('STALE EXCLUSION — package.json disagrees with the gate');
      expect(stale.stdout).toContain('seed: src/theme/createGlassTheme.ts  owner: MAT  removed by REQ-FIN-52');
      expect(stale.stdout).toContain('seed: src/motion/public.ts  owner: MAT  removed by REQ-FIN-58');
      execFileSync('node', [SCRIPT, '--write', '--root', dir], { cwd: ROOT });
      const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
      expect(Object.keys(pkg)).toEqual(['name', 'version', 'exports', 'main', 'types']);
      expect(pkg.exports['./future']).toBeUndefined();
      const ok = run(['--check', '--root', dir]);
      expect(ok.status).toBe(0);
      expect(ok.stdout).toContain('./theme  import graph contains @ag-contract-seed');
      expect(ok.stdout).toContain("./future  ga:'5.1' > 5.0 (ships on 5.1.x)");
      expect(ok.stdout).toContain('match the gate');
    });
  });

  test('--check: an excluded entry with no seed file is a stale exclusion (exit 1)', () => {
    withFixtureCopy((dir) => {
      execFileSync('node', [SCRIPT, '--write', '--root', dir], { cwd: ROOT });
      const mf = join(dir, 'build/exports.manifest.json');
      const m = JSON.parse(readFileSync(mf, 'utf8'));
      m.entries.push({ subpath: './gone', source: 'src/gone.ts', types: 'dist/gone.d.ts', default: 'dist/gone.js' });
      writeFileSync(mf, JSON.stringify(m));
      const res = run(['--check', '--root', dir]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('./gone  missing source src/gone.ts  [STALE: no seed file]');
      expect(res.stderr).toContain('STALE EXCLUSION ./gone');
    });
  });

  test('a seed removed by its owner re-admits the entry (exclusion becomes stale until --write)', () => {
    withFixtureCopy((dir) => {
      execFileSync('node', [SCRIPT, '--write', '--root', dir], { cwd: ROOT });
      writeFileSync(join(dir, 'src/theme/createGlassTheme.ts'), '/* real implementation */\nexport const createGlassTheme = () => ({});\n');
      const res = run(['--check', '--root', dir]);
      expect(res.status).toBe(1);
      expect(res.stderr).toContain('exports["./theme"]: have undefined');
    });
  });

  test('--list-entries --json (REQ-PLAT-67/73): manifest-shaped, shipped rows verbatim, exclusions with reasons', () => {
    const res = run(['--list-entries', '--json', '--root', FIXTURE]);
    expect(res.status).toBe(0);
    const out = JSON.parse(res.stdout);
    const manifest = JSON.parse(readFileSync(join(FIXTURE, 'build/exports.manifest.json'), 'utf8'));
    expect(out.version).toBe(manifest.version);
    // shipped rows are the manifest's own objects, in manifest order
    expect(out.entries).toEqual(manifest.entries.filter((e: any) => ['.', './midfile', './icons', './data.css'].includes(e.subpath)));
    expect(out.excluded.map((x: any) => x.subpath).sort()).toEqual(['./future', './motion', './theme']);
    for (const x of out.excluded) expect(x.reason).toBeTruthy();
    // entries ∪ excluded partitions the manifest
    expect([...out.entries, ...out.excluded].map((x: any) => x.subpath).sort())
      .toEqual(manifest.entries.map((e: any) => e.subpath).sort());
    expect(out.exports).toEqual(gen.desiredExports(FIXTURE));
    // without --json the human listing is unchanged
    expect(run(['--list-entries', '--root', FIXTURE]).stdout).toContain('exports (built):');
  });

  test('the real repo: --check exits 0, ./charts ga-dropped, root/primitives/forms/icons/* exported, main/types set', () => {
    const res = run(['--check']);
    expect(res.stderr).toBe('');
    expect(res.status).toBe(0);
    expect(res.stdout).toContain("./charts  ga:'5.1' > 5.0 (ships on 5.1.x)");
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    expect(pkg.exports['./charts']).toBeUndefined();
    for (const sub of ['.', './primitives', './forms', './icons', './icons/*']) expect(pkg.exports[sub]).toBeDefined();
    expect(pkg.types).toBe('./dist/index.d.ts');
    expect(pkg.main).toBe('./dist/index.js');
    // src/contracts/seed.tsx keeps its header and stays out of every shipped closure
    expect(graph.fileIsSeed(join(ROOT, 'src/contracts/seed.tsx'))).toBe(true);
  });
});
