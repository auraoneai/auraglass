// tests/capability/delivery.test.ts — REQ-SURF-181 (L2 delivery check).
// Rows 'delivered' with release ≤ package version must resolve every name in
// the packed exports manifest. Fixture manifests drive both outcomes.
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, existsSync } from 'node:fs';
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
