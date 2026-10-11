/* REQ-QUAL-62 computed claims: written from verified, SHA-bound evidence only; any non-pass lane, failed verification
   or missing/unbound source writes no file and returns a non-zero code. */
import { afterAll, describe, expect, it } from '@jest/globals';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { ClaimsRefused, computeClaims, writeClaims, type ClaimsInput } from '../src/evidence/claims.ts';
import type { ReviewSummary } from '../src/evidence/reviewRecord.ts';
import { collectEvidence, VERIFIED_LANES, type Verification } from '../src/evidence/verify.ts';

const SHA = 'd'.repeat(40);
const dirs: string[] = [];
afterAll(() => { for (const d of dirs) rmSync(d, { recursive: true, force: true }); });
const write = (file: string, v: unknown) => { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, typeof v === 'string' ? v : JSON.stringify(v)); };

const REVIEW: ReviewSummary = { version: 1, sha: SHA, required: 3, recorded: 3, passed: 3, missing: [], failing: [], invalid: [], unbound: [], compositeMismatch: [], problems: [], verdict: 'pass' };
const OK: Verification = { ok: true, sha: SHA, problems: [], lanes: {}, review: REVIEW };

/** Evidence dir laid out like merged GitLab artifacts: one job dir per lane, each with its lane manifest. */
function evidence(over: { state?: string; perfSha?: string; dropDistPerf?: boolean; unboundMatrix?: boolean } = {}): { dir: string; input: ClaimsInput } {
  const dir = mkdtempSync(join(tmpdir(), 'ag-claims-'));
  dirs.push(dir);
  const manifest = (lane: string, extra: Record<string, unknown> = {}) => ({ version: 1, lane, sha: SHA, scope: 'release',
    results: [{ lane, stream: 'qual', kind: 'node-script', path: `g-${lane}.mjs`, scope: 'release', state: lane === 'L5' ? over.state ?? 'pass' : 'pass' }], cells: [], ...extra });
  for (const lane of VERIFIED_LANES) {
    const slug = `qual-certify-${lane.toLowerCase()}`;
    write(join(dir, 'qual', slug, 'lane-manifest.json'), manifest(lane, lane === 'L6'
      ? { cells: ['button--playground|photo|chromium|light', 'button--playground|photo|webkit|dark', 'button--playground|dense-text|firefox|light'] }
      : lane === 'L5' ? { browserVersions: { chromium: '140.0' } } : {}));
  }
  write(join(dir, 'qual/qual-certify-l1/inventory.json'), { version: 1, items: [{ name: 'Button', class: 'visual' }, { name: 'Dialog', class: 'visual' }, { name: 'ButtonAlias', class: 'alias' }, { name: 'useX', class: 'nonvisual' }] });
  write(join(dir, 'qual/qual-certify-l6/environment-visual/plan.json'), { version: 1, sha: SHA, cells: ['button--playground|photo|chromium|light', 'button--playground|photo|webkit|dark'], subjects: ['Button'] });
  write(join(dir, 'qual/qual-certify-l6/environment-visual/captures-7.jsonl'), [
    { id: 'button--playground|photo|chromium|light', gates: [{ gate: 'ocr-contrast', status: 'pass', value: 5.1, limit: 4.5 }] },
    { id: 'button--playground|photo|webkit|dark', gates: [{ gate: 'ocr-contrast', status: 'pass', value: 4.62, limit: 4.5 }, { gate: 'glass-over-nothing', status: 'pass' }] },
  ].map((r) => JSON.stringify(r)).join('\n'));
  write(join(dir, over.unboundMatrix ? 'mat/stray/contrast-matrix.json' : 'qual/qual-certify-l4/contrast-matrix.json'),
    { cells: { aura: { light: { regular: { minRatio: 4.8, pair: 'text' }, thick: { minRatio: 4.6, pair: 'text' }, ring: { minRatio: 3.2, pair: 'focus' } } } } });
  if (!over.dropDistPerf) write(join(dir, 'qual/qual-certify-l2/dist-perf.json'), { bytes: { Surface: 1834, Button: 2410 }, violations: [] });
  write(join(dir, 'qual/qual-certify-l10/perf-report.json'), { version: 1, sha: over.perfSha ?? SHA, subjects: [
    { subject: 'Button', profile: 'desktop-120hz', metrics: {}, grade: 'A' }, { subject: 'Dialog', profile: 'desktop-120hz', metrics: {}, grade: 'B' },
    { subject: 'Button', profile: 'mid-mobile', metrics: {}, grade: 'B' }] });
  write(join(dir, `qual/h-aggregate/a11y-manual-${SHA}.json`), { sha: SHA, verdict: 'pass', recorded: 220 });
  const set = collectEvidence(dir, { sha: SHA, recordsDir: join(dir, 'none'), loadRecords: () => [] });
  return { dir, input: { set, verification: OK, flagships: ['Button', 'Dialog'] } };
}

describe('computeClaims', () => {
  it('writes every claim with value, unit and a SHA-bound source', () => {
    const { dir, input } = evidence();
    const out = join(dir, 'qual/claims.json');
    const r = writeClaims(input, out);
    expect(r).toEqual({ code: 0, file: out, reasons: [] });
    const claims = JSON.parse(readFileSync(out, 'utf8'));
    expect(Object.keys(claims).sort()).toEqual(['cells-per-lane', 'engines', 'failures', 'flagships-certified', 'import-bytes', 'ocr-contrast-worst',
      'perf-grades', 'results-per-lane', 'review-records', 'token-contrast-min', 'visual-components']);
    expect(claims['visual-components'].value).toBe(2);
    expect(claims['flagships-certified'].value).toBe(2);
    expect(claims.failures.value).toBe(0);
    expect(claims['cells-per-lane'].value.L6).toBe(3);
    expect(claims['results-per-lane'].value).toEqual(Object.fromEntries(VERIFIED_LANES.map((l) => [l, 1])));
    expect(claims['ocr-contrast-worst']).toMatchObject({ value: 4.62, unit: 'contrast ratio (:1)', source: { artifact: 'qual/qual-certify-l6/environment-visual/captures-7.jsonl', sha: SHA } });
    expect(claims['token-contrast-min'].value).toEqual({ focus: 3.2, text: 4.6 });
    expect(claims['import-bytes'].value).toEqual({ Button: 2410, Surface: 1834 });
    expect(claims['perf-grades'].value).toEqual({ 'desktop-120hz': { A: 1, B: 1, C: 0, D: 0, F: 0 }, 'mid-mobile': { A: 0, B: 1, C: 0, D: 0, F: 0 } });
    expect(claims.engines.value).toEqual(['chromium', 'firefox', 'webkit']);
    expect(claims['review-records'].value).toEqual({ l13: 220, l14: 3 });
    for (const c of Object.values(claims) as Array<{ source: { sha: string; artifact: string; path: string } }>) {
      expect(c.source.sha).toBe(SHA);
      expect(existsSync(join(dir, c.source.artifact))).toBe(true);
      expect(c.source.path).toMatch(/^\$/);
    }
  });

  it('one non-pass lane: exit non-zero and no file (a stale file from an earlier run is removed)', () => {
    const { dir, input } = evidence({ state: 'pending' });
    const out = join(dir, 'qual/claims.json');
    write(out, '{"stale":true}');
    const r = writeClaims(input, out);
    expect(r.code).toBe(1);
    expect(r.file).toBeNull();
    expect(existsSync(out)).toBe(false);
    expect(r.reasons.join('\n')).toMatch(/\[L5\] g-L5\.mjs is pending, not pass/);
  });

  it.each([
    ['verification failed', (i: ClaimsInput) => { i.verification = { ...OK, ok: false, problems: [{ code: 'cell-missing', message: 'planned cell x has no capture result' }] }; }, /verify cell-missing/],
    ['no L13/L14 review (before RC-1)', (i: ClaimsInput) => { i.verification = { ...OK, review: null }; }, /flagships-certified: L13 aggregate and L14 review are required/],
    ['a failing lane result', (i: ClaimsInput) => { i.set.manifests[0]!.manifest.results[0]!.state = 'fail'; }, /is fail, not pass/],
  ])('refuses when %s', (_n, mutate, re) => {
    const { input } = evidence();
    mutate(input);
    expect(() => computeClaims(input)).toThrow(ClaimsRefused);
    try { computeClaims(input); } catch (e) { expect((e as ClaimsRefused).reasons.join('\n')).toMatch(re); }
  });

  it('refuses when a source artifact is missing or not bound to the SHA', () => {
    const missing = evidence({ dropDistPerf: true });
    expect(() => computeClaims(missing.input)).toThrow(/import-bytes: no dist-perf\.json/);
    const stale = evidence({ perfSha: 'e'.repeat(40) });
    expect(() => computeClaims(stale.input)).toThrow(/perf-grades: .* sha e{40} != d{40}/);
    const unbound = evidence({ unboundMatrix: true });
    expect(() => computeClaims(unbound.input)).toThrow(/token-contrast-min: mat\/stray\/contrast-matrix\.json is not in a job dir bound to the SHA/);
  });
});
