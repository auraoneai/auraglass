// tests/capability/export-budget.test.ts — REQ-SURF-184.
// Ledger-declared export deltas stay inside the package ceilings (root ≤160,
// total ≤250). `--budget <packed>` enumerates the packed value exports and
// fails when a ceiling breaks or when the ledger-derived count differs from
// the enumerated count (printing both); `--ga` additionally needs ≥1 root and
// ≥4 subpath slots free for 5.1. Promotion of a registry item to an export
// needs demand links and the contract name.
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = join(__dirname, '../..');
const SCRIPT = join(ROOT, 'scripts/surf/verify-capability-ledger.mjs');
const FX = join(ROOT, 'tests/capability/fixtures');
const ledger = JSON.parse(readFileSync(join(ROOT, 'docs/auraglass-5/capability-ledger.json'), 'utf8'));
const RUBRIC = { r1: true, r2: true, r3: true, r4: true, r5: true, r6: true };

const run = (args: string[]) =>
  spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', cwd: ROOT, env: { ...process.env, CI_COMMIT_TAG: '' } });

describe('export budget (ledger sums)', () => {
  const live = ledger.rows.filter((r: any) => r.status !== 'rejected');
  const root = live.reduce((n: number, r: any) => n + r.exportDelta.root, 0);
  const sub = live.reduce((n: number, r: any) => n + r.exportDelta.subpath, 0);

  it('sum(exportDelta.root) ≤ 160', () => expect(root).toBeLessThanOrEqual(160));
  it('sum(exportDelta.root + exportDelta.subpath) ≤ 250', () => {
    expect(root + sub).toBeLessThanOrEqual(250);
  });
  it('every export-form row declares a positive delta and a subpath', () => {
    const bad = live.filter(
      (r: any) => r.form.includes('export') && ((r.exportDelta.root + r.exportDelta.subpath) === 0 || typeof r.subpath !== 'string')
    );
    expect(bad.map((r: any) => r.id)).toEqual([]);
  });
});

describe('--budget against enumerated packed exports', () => {
  // Ledger with one shipped root row (2 names) and one shipped subpath row.
  const rows = [
    { id: 'X-08', capability: 'cmd', area: 'navigation', priority: 'P0', owner: 'SURF', collaborators: [], form: ['export'],
      names: ['Command', 'CommandPalette'], subpath: '.', release: '5.0', evidence: ['exception:fixture'], findings: [], reqRefs: [],
      rubric: RUBRIC, exportDelta: { root: 2, subpath: 0 }, budgetKb: 6, status: 'planned', artifacts: [], demand: [], stories: [] },
    { id: 'X-15', capability: 'time', area: 'inputs', priority: 'P1', owner: 'SURF', collaborators: [], form: ['export'],
      names: ['TimePicker'], subpath: './date', release: '5.0', evidence: ['exception:fixture'], findings: [], reqRefs: [],
      rubric: RUBRIC, exportDelta: { root: 0, subpath: 1 }, budgetKb: 6, status: 'planned', artifacts: [], demand: [], stories: [] },
  ];
  const names = (prefix: string, n: number) => Array.from({ length: n }, (_, i) => `${prefix}${i}`);
  function fixture(entries: object[]) {
    const dir = mkdtempSync(join(tmpdir(), 'ledger-budget-'));
    writeFileSync(join(dir, 'capability-ledger.json'), JSON.stringify({ $schema: './capability-ledger.schema.json', version: '1', rows }));
    writeFileSync(join(dir, 'packed.json'), JSON.stringify({ version: '5.0.0', entries }));
    return dir;
  }
  const go = (dir: string, extra: string[] = []) =>
    run(['--ledger', join(dir, 'capability-ledger.json'), '--budget', join(dir, 'packed.json'), '--evidence-dir', join(dir, 'ev'), ...extra]);

  it('passes when ledger and enumerated counts agree and ceilings hold', () => {
    const dir = fixture([
      { subpath: '.', exports: ['Command', 'CommandPalette', ...names('R', 50)] },
      { subpath: './date', exports: ['TimePicker', ...names('D', 10)] },
    ]);
    const r = go(dir, ['--ga']);
    expect(`${r.stdout}${r.stderr}`).toContain('ledger 2+1 vs enumerated 2+1');
    expect(r.status).toBe(0);
    const ev = JSON.parse(readFileSync(join(dir, 'ev', 'budget.json'), 'utf8'));
    expect(ev).toMatchObject({ root: 52, total: 63, ga: { rootFree: 108, subFree: 186 } });
  });
  it('ledger and manifest differing by 1 exits 1 printing both numbers', () => {
    const dir = fixture([
      { subpath: '.', exports: ['Command', ...names('R', 50)] },
      { subpath: './date', exports: ['TimePicker'] },
    ]);
    const r = go(dir);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('ledger root exportDelta 2 != enumerated ledger root exports 1 (difference 1)');
  });
  it('root above 160 or total above 250 exits 1', () => {
    const root = go(fixture([{ subpath: '.', exports: ['Command', 'CommandPalette', ...names('R', 159)] }, { subpath: './date', exports: ['TimePicker'] }]));
    expect(root.status).toBe(1);
    expect(root.stderr).toContain('root value exports 161 exceed 160');
    const total = go(fixture([
      { subpath: '.', exports: ['Command', 'CommandPalette'] },
      { subpath: './date', exports: ['TimePicker', ...names('D', 248)] },
    ]));
    expect(total.status).toBe(1);
    expect(total.stderr).toContain('total value exports 251 exceed 250');
  });
  it("'0 subpath slots free at --ga' exits 1", () => {
    // total 249: within the ceiling, but after the reserved root slot 0 subpath slots remain.
    const dir = fixture([
      { subpath: '.', exports: ['Command', 'CommandPalette'] },
      { subpath: './date', exports: ['TimePicker', ...names('D', 246)] },
    ]);
    expect(go(dir).status).toBe(0);
    const r = go(dir, ['--ga']);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('budget --ga: 0 subpath slots free, need ≥4');
  });
  it("'0 root slots free at --ga' exits 1", () => {
    const dir = fixture([{ subpath: '.', exports: ['Command', 'CommandPalette', ...names('R', 158)] }, { subpath: './date', exports: ['TimePicker'] }]);
    const r = go(dir, ['--ga']);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('budget --ga: 0 root slots free, need ≥1');
  });
});

describe('promotion gate', () => {
  const base = join(FX, 'promotion-base.json');
  const entries = join(FX, 'promotion-entries.txt');
  it("'promotion without demand' exits 1", () => {
    const dir = mkdtempSync(join(tmpdir(), 'ledger-promo-'));
    const l = JSON.parse(readFileSync(join(FX, 'promotion-10.json'), 'utf8'));
    l.rows.find((r: any) => r.id === 'X-90').demand = [];
    writeFileSync(join(dir, 'ledger.json'), JSON.stringify(l));
    const r = run(['--ledger', join(dir, 'ledger.json'), '--promotion', base, '--entries', entries]);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('X-90: promotion needs ≥10 distinct demand links, has 0');
  });
  it('promotion whose name is not in the contract exits 1 (contract PR first)', () => {
    const r = run(['--ledger', join(FX, 'promotion-10.json'), '--promotion', base]);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('X-90: promoted name fixture-thing is not in the contract');
  });
  it('10 demand links plus the contract name exits 0', () => {
    const r = run(['--ledger', join(FX, 'promotion-10.json'), '--promotion', base, '--entries', entries]);
    expect(`${r.stdout}${r.stderr}`).toContain('capability-ledger: ok');
    expect(r.status).toBe(0);
  });
});
