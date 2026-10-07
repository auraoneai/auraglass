// tests/capability/verify-ledger.test.ts — REQ-SURF-180..186.
// One it per negative fixture: each must exit 1 naming the failing row.
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');
const SCRIPT = join(ROOT, 'scripts/surf/verify-capability-ledger.mjs');
const FX = join(ROOT, 'tests/capability/fixtures');

function run(args: string[]) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', cwd: ROOT });
}

const fixtures: Array<[string, string]> = [
  ['dup-owner.json', 'X-04'],
  ['owner-array.json', 'X-04'],
  ['missing-evidence.json', 'X-02'],
  ['bad-line.json', 'X-02'],
  ['rubric-false.json', 'X-03'],
  ['unknown-finding.json', 'X-05'],
  ['rejected-readd.json', 'X-09'],
  ['bad-reqref.json', 'X-08'],
];

describe('verify-capability-ledger negative fixtures', () => {
  for (const [file, rowId] of fixtures) {
    it(`${file} exits 1 naming ${rowId}`, () => {
      const r = run(['--ledger', join(FX, file)]);
      expect(r.status).toBe(1);
      expect(`${r.stdout}${r.stderr}`).toContain(rowId);
    });
  }

  it('real ledger exits 0', () => {
    const r = run([]);
    expect(r.status).toBe(0);
  });

  it('re-admitted GlassHologram cites X-R04', () => {
    const r = run(['--ledger', join(FX, 'rejected-readd.json')]);
    expect(r.status).toBe(1);
    expect(`${r.stdout}${r.stderr}`).toContain('X-R04 rejected:');
  });

  it('export added without a ledger row exits 1 naming it', () => {
    const r = run([
      '--exports', join(FX, 'exports-before.json'), join(FX, 'exports-after-orphan.json'),
    ]);
    expect(r.status).toBe(1);
    expect(`${r.stdout}${r.stderr}`).toContain('GhostExport');
    const clean = run([
      '--exports', join(FX, 'exports-before.json'), join(FX, 'exports-after-clean.json'),
    ]);
    expect(clean.status).toBe(0);
  });

  it('promotion with 9 demand links exits 1; with 10 exits 0', () => {
    const base = join(FX, 'promotion-base.json');
    const nine = run(['--ledger', join(FX, 'promotion-9.json'), '--promotion', base]);
    expect(nine.status).toBe(1);
    expect(`${nine.stdout}${nine.stderr}`).toContain('X-90');
    const ten = run(['--ledger', join(FX, 'promotion-10.json'), '--promotion', base]);
    expect(ten.status).toBe(0);
  });
});
