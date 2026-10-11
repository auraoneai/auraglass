// tests/capability/delivery.test.ts — REQ-SURF-181 (L2 delivery check).
// Rows 'delivered' with release ≤ package version must resolve every name in
// the packed exports manifest. Fixture manifests drive both outcomes.
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = join(__dirname, '../..');
const SCRIPT = join(ROOT, 'scripts/surf/verify-capability-ledger.mjs');

const LEDGER = {
  $schema: './capability-ledger.schema.json',
  version: '1',
  rows: [{
    id: 'X-05', capability: 'Meter', area: 'foundation', priority: 'P1',
    owner: 'CMP', collaborators: [], form: ['export'], names: ['Meter'],
    subpath: '.', release: '5.0', evidence: ['exception:fixture'],
    findings: [], reqRefs: [], rubric: { r1: true, r2: true, r3: true, r4: true, r5: true, r6: true },
    exportDelta: { root: 1, subpath: 0 }, status: 'delivered',
  }],
};

function fixtureDir(manifest: object) {
  const dir = mkdtempSync(join(tmpdir(), 'ledger-delivery-'));
  writeFileSync(join(dir, 'capability-ledger.json'), JSON.stringify(LEDGER));
  writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifest));
  return dir;
}

describe('delivery check against the packed manifest', () => {
  it('passes when the manifest exports every delivered name', () => {
    const dir = fixtureDir({ entries: [{ subpath: '.', exports: ['Meter', 'Kbd'] }] });
    const r = spawnSync(process.execPath,
      [SCRIPT, '--ledger', join(dir, 'capability-ledger.json'), '--manifest', join(dir, 'manifest.json'), '--pkg-version', '5.0.0'],
      { encoding: 'utf8', cwd: ROOT });
    expect(r.status).toBe(0);
  });
  it('exits 1 naming the row when a delivered name is absent', () => {
    const dir = fixtureDir({ entries: [{ subpath: '.', exports: ['Kbd'] }] });
    const r = spawnSync(process.execPath,
      [SCRIPT, '--ledger', join(dir, 'capability-ledger.json'), '--manifest', join(dir, 'manifest.json'), '--pkg-version', '5.0.0'],
      { encoding: 'utf8', cwd: ROOT });
    expect(r.status).toBe(1);
    expect(`${r.stdout}${r.stderr}`).toContain('X-05');
  });
  it('skips rows whose release exceeds the package version', () => {
    const dir = fixtureDir({ entries: [{ subpath: '.', exports: [] }] });
    const r = spawnSync(process.execPath,
      [SCRIPT, '--ledger', join(dir, 'capability-ledger.json'), '--manifest', join(dir, 'manifest.json'), '--pkg-version', '4.9.9'],
      { encoding: 'utf8', cwd: ROOT });
    expect(r.status).toBe(0);
  });
});

// REQ-SURF-164: X-28 (Chart, ./charts) moves to 'delivered' only when the L2
// size artifact shows { Chart } <=15 KB min+gz with d3 external.
describe('X-28 delivery is guarded by the L2 size artifact', () => {
  const real = JSON.parse(readFileSync(join(ROOT, 'docs/auraglass-5/capability-ledger.json'), 'utf8')) as { rows: { id: string; status: string }[] };
  const x28 = real.rows.find((r) => r.id === 'X-28')!;

  function run(status: string, sizeReport: object | null) {
    const dir = mkdtempSync(join(tmpdir(), 'ledger-x28-'));
    writeFileSync(join(dir, 'capability-ledger.json'), JSON.stringify({ ...LEDGER, rows: [{ ...x28, status }] }));
    const args = [SCRIPT, '--ledger', join(dir, 'capability-ledger.json'), '--size-report', join(dir, 'size-budgets.json')];
    if (sizeReport !== null) writeFileSync(join(dir, 'size-budgets.json'), JSON.stringify(sizeReport));
    return spawnSync(process.execPath, args, { encoding: 'utf8', cwd: ROOT });
  }
  const chartRow = (extra: object) => ({ id: 'SB-SURF-W2-CHART-51', import: "{ Chart } from 'aura-glass/charts'", limitBytes: 15360, kind: 'js', ...extra });

  it('the committed X-28 row is not delivered', () => {
    expect(x28).toBeDefined();
    expect(x28.status).not.toBe('delivered');
  });
  it('a non-delivered X-28 needs no artifact', () => {
    expect(run(x28.status, null).status).toBe(0);
  });
  it('fails when X-28 is delivered without the artifact', () => {
    const r = run('delivered', null);
    expect(r.status).toBe(1);
    expect(`${r.stdout}${r.stderr}`).toContain('X-28: delivered without the L2 size artifact');
  });
  it('fails when the Chart measurement is pending or missing', () => {
    expect(run('delivered', { rows: [chartRow({ status: 'pending', measuredBytes: null, externals: ['d3-*'] })] }).status).toBe(1);
    expect(run('delivered', { rows: [] }).status).toBe(1);
  });
  it('fails when Chart is over 15 KB min+gz', () => {
    const r = run('delivered', { rows: [chartRow({ status: 'pass', measuredBytes: 15361, externals: ['d3-*'] })] });
    expect(r.status).toBe(1);
    expect(`${r.stdout}${r.stderr}`).toContain('15361 B > 15360 B');
  });
  it('fails when the artifact does not show d3 external', () => {
    const r = run('delivered', { rows: [chartRow({ status: 'pass', measuredBytes: 9000 })] });
    expect(r.status).toBe(1);
    expect(`${r.stdout}${r.stderr}`).toContain('does not record d3-scale as external');
  });
  it('passes only with a passing <=15 KB measurement and both d3 peers external', () => {
    expect(run('delivered', { rows: [chartRow({ status: 'pass', measuredBytes: 15360, externals: ['d3-scale', 'd3-shape'] })] }).status).toBe(0);
    expect(run('delivered', { rows: [chartRow({ status: 'pass', measuredBytes: 9000 })], externals: ['react', 'd3-*'] }).status).toBe(0);
  });
});
