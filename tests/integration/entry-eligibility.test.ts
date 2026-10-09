/** @jest-environment node */
import { test, expect, beforeAll, afterAll } from '@jest/globals';
/* REQ-FIN-06: entry eligibility gate — line-1 seed headers only, --check names
   every excluded entry with seed file + owner + removing REQ-FIN, ga:'5.1'
   rows dropped on 5.0.x, top-level "types" regenerated. */
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

describe('entry eligibility (REQ-FIN-06)', () => {
  test('seed marker counts only at line 1', () => {
    expect(graph.fileIsSeed(join(FIXTURE, 'src/seeded.ts'))).toBe(true);
    // mid-file @ag-contract-seed prose is not a seed marker
    expect(graph.fileIsSeed(join(FIXTURE, 'src/notaseed.ts'))).toBe(false);
  });

  test('pending entries are partitioned with reasons', () => {
    const { keep, pending } = graph.buildableEntries(FIXTURE);
    const keepSubs = keep.map((e) => e.subpath).sort();
    const pendSubs = pending.map((e) => e.subpath).sort();
    expect(keepSubs).toEqual(['.', './midfile']);
    expect(pendSubs).toEqual(['./future', './missing', './seeded']);
    const seeded = pending.find((e) => e.subpath === './seeded');
    expect(seeded.seedFiles.map((f) => f.replace(/\\/g, '/').split('/src/').pop())).toEqual(['seeded.ts']);
    const future = pending.find((e) => e.subpath === './future');
    expect(future.gaDropped).toBe(true);
    expect(future.reason).toContain("ga:'5.1'");
  });

  test('--check names every excluded entry with seed file, owner, removing REQ-FIN', () => {
    const report = gen.exclusionReport(FIXTURE);
    const seeded = report.find((r) => r.subpath === './seeded');
    expect(seeded.seedFiles).toHaveLength(1);
    expect(seeded.seedFiles[0].file).toBe('src/seeded.ts');
    expect(seeded.seedFiles[0].owner).toBe('MAT');
    expect(seeded.seedFiles[0].removingReqFin).toContain('REQ-FIN-52');
    const missing = report.find((r) => r.subpath === './missing');
    expect(missing.reason).toContain('missing source');
  });

  test('desired exports drop seeded, ga-gated and missing entries', () => {
    const want = gen.desiredExports(FIXTURE);
    expect(Object.keys(want).sort()).toEqual(['.', './data.css', './midfile']);
    expect(want['.']).toEqual({ types: './dist/index.d.ts', default: './dist/index.js' });
    expect(gen.desiredTypes(FIXTURE)).toBe('./dist/index.d.ts');
  });

  test('--check exits 1 only on stale exclusions; --write converges', () => {
    // copy fixture to a tmp dir: --write mutates package.json
    const tmp = mkdtempSync(join(tmpdir(), 'seed-fix-'));
    cpSync(FIXTURE, tmp, { recursive: true });
    try {
      const stale = spawnSync('node', [SCRIPT, '--check', '--root', tmp], { cwd: ROOT, encoding: 'utf8' });
      expect(stale.status).toBe(1);
      expect(stale.stderr + stale.stdout).toContain('DRIFT');
      expect(stale.stdout).toContain('src/seeded.ts');
      expect(stale.stdout).toContain('REQ-FIN-52');
      execFileSync('node', [SCRIPT, '--write', '--root', tmp], { cwd: ROOT });
      const pkg = JSON.parse(readFileSync(join(tmp, 'package.json'), 'utf8'));
      expect(pkg.types).toBe('./dist/index.d.ts');
      expect(Object.keys(pkg.exports).sort()).toEqual(['.', './data.css', './midfile']);
      const ok = spawnSync('node', [SCRIPT, '--check', '--root', tmp], { cwd: ROOT, encoding: 'utf8' });
      expect(ok.status).toBe(0);
      expect(ok.stdout).toContain('match the manifest');
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test('the real repo: exports match, exclusions attributed, charts ga-dropped', () => {
    const ok = spawnSync('node', [SCRIPT, '--check'], { cwd: ROOT, encoding: 'utf8' });
    expect(ok.status).toBe(0);
    expect(ok.stdout).toContain("ga:'5.1' > 5.0");
    expect(ok.stdout).toContain('src/theme/createGlassTheme.ts');
    expect(ok.stdout).toContain('REQ-FIN-52');
  });
});
