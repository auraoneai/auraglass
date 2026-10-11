/* REQ-QUAL-73 agent part (REQ-FIN-111 tooling): review-record schema and validation (pass = every criterion ≥3, none
   1), required review items, PNG codec, review composites, and the scripts/qual/review-record.mjs CLI. */
import { afterAll, describe, expect, it } from '@jest/globals';
import Ajv from 'ajv';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { SCENES } from '../../../src/contracts/testing.ts';
import { buildComposite, CompositeInputError, diffHeatmap, type CompositeInput } from '../src/evidence/composite.ts';
import { blankReason, decodePng, encodePng, PngError, rasterStats } from '../src/evidence/png.ts';
import {
  failingCriteria, itemId, loadRecords, recordProblems, requiredItems, summarizeReview, type ReviewItemRef, type ReviewRecord,
} from '../src/evidence/reviewRecord.ts';

const REPO = resolve(__dirname, '../../..');
const SHA = '7'.repeat(40);
const SCHEMA = JSON.parse(readFileSync(join(REPO, 'certification/schemas/review-record.schema.json'), 'utf8'));
const schemaValid = new Ajv({ allErrors: true, strict: false }).compile(SCHEMA);
const dirs: string[] = [];
afterAll(() => { for (const d of dirs) rmSync(d, { recursive: true, force: true }); });
const tmp = () => { const d = mkdtempSync(join(tmpdir(), 'ag-review-')); dirs.push(d); return d; };
const write = (file: string, body: string | Uint8Array) => { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, body); };

function rec(item: ReviewItemRef, scores: Partial<Record<string, number>> = {}, over: Record<string, unknown> = {}): ReviewRecord {
  return { version: 1, reviewer: 'Design Reviewer', sha: SHA, item, notes: '', compositeSha256: 'c'.repeat(64), reviewedAt: '2026-10-09T10:00:00Z',
    scores: { R1: 3, R2: 3, R3: 3, R4: 3, R5: 3, R6: 3, ...(item.kind === 'showcase' ? { R7: 3 } : {}), ...scores }, ...over } as ReviewRecord;
}
const SUBJECT: ReviewItemRef = { kind: 'subject-state', subject: 'Button', state: 'open' };
const SHOWCASE: ReviewItemRef = { kind: 'showcase', subject: 'ops-console' };
const T0: ReviewItemRef = { kind: 't0-matrix', subject: 't0-matrix' };

describe('review record schema', () => {
  const valid = [rec(SUBJECT), rec(SHOWCASE, { R7: 4 }), rec(T0, { R1: 4 })];
  const invalid: Array<[string, unknown]> = [
    ['score 0', rec(SUBJECT, { R2: 0 })], ['score 5', rec(SUBJECT, { R2: 5 })], ['fractional score', rec(SUBJECT, { R2: 3.5 })],
    ['missing R6', { ...rec(SUBJECT), scores: { R1: 3, R2: 3, R3: 3, R4: 3, R5: 3 } }],
    ['R7 on a subject-state', rec(SUBJECT, { R7: 3 })], ['showcase without R7', { ...rec(SHOWCASE), scores: { R1: 3, R2: 3, R3: 3, R4: 3, R5: 3, R6: 3 } }],
    ['subject-state without state', rec({ kind: 'subject-state', subject: 'Button' })], ['state on a showcase', rec({ ...SHOWCASE, state: 'x' })],
    ['short SHA', rec(SUBJECT, {}, { sha: 'abc' })], ['no reviewer', rec(SUBJECT, {}, { reviewer: '' })],
    ['bad composite hash', rec(SUBJECT, {}, { compositeSha256: 'nothex' })], ['date only', rec(SUBJECT, {}, { reviewedAt: '2026-10-09' })],
    ['unknown field', rec(SUBJECT, {}, { approved: true })], ['version 2', rec(SUBJECT, {}, { version: 2 })], ['unknown kind', rec({ kind: 'page', subject: 'x' } as never)],
  ];
  it('accepts valid records (code and JSON schema agree)', () => {
    for (const r of valid) { expect(recordProblems(r)).toEqual([]); expect(schemaValid(r)).toBe(true); }
  });
  it.each(invalid)('rejects %s (code and JSON schema agree)', (_n, r) => {
    expect(recordProblems(r).length).toBeGreaterThan(0);
    expect(schemaValid(r)).toBe(false);
  });
  it('pass = every criterion ≥3: a 2 or a 1 fails', () => {
    expect(failingCriteria(rec(SUBJECT, { R1: 4 }))).toEqual([]);
    expect(failingCriteria(rec(SUBJECT, { R3: 2 }))).toEqual(['R3']);
    expect(failingCriteria(rec(SHOWCASE, { R7: 1, R5: 2 }))).toEqual(['R5', 'R7']);
  });
});

describe('required items and summaries', () => {
  it('enumerates every flagship subject-state, the T0 matrix, the S1 showcases and refreshed subjects', () => {
    const r = requiredItems({ flagships: [{ name: 'Button', states: ['open', 'disabled'] }, { name: 'Surface', states: [] }, { name: 'DataGrid', states: null }],
      s1Showcases: ['ops-console', 'ai-command-center'], changedSubjects: ['Button', 'Tooltip'] });
    expect(r.items.map(itemId)).toEqual(['button-open', 'button-disabled', 'surface-default', 't0-matrix', 'showcase-ops-console', 'showcase-ai-command-center', 'tooltip-default']);
    expect(r.problems).toEqual(['flagship DataGrid: ComponentMeta.states is not a static string array; its review items cannot be enumerated']);
  });

  const required = [SUBJECT, T0, SHOWCASE];
  const loaded = (records: ReviewRecord[]) => records.map((r) => ({ file: `${itemId(r.item)}.json`, raw: r, record: r, problems: [] }));
  it('pass when every required item has a passing record on the RC SHA', () => {
    expect(summarizeReview({ sha: SHA, required, records: loaded([rec(SUBJECT), rec(T0), rec(SHOWCASE)]) }).verdict).toBe('pass');
  });
  it.each([
    ['a missing record → incomplete', [rec(SUBJECT), rec(T0)], 'incomplete'],
    ['a score of 2 → fail', [rec(SUBJECT, { R4: 2 }), rec(T0), rec(SHOWCASE)], 'fail'],
    ['a score of 1 → fail', [rec(SUBJECT), rec(T0), rec(SHOWCASE, { R7: 1 })], 'fail'],
    ['a record on another SHA → fail', [rec(SUBJECT, {}, { sha: '8'.repeat(40) }), rec(T0), rec(SHOWCASE)], 'fail'],
    ['a record for no required item → fail', [rec(SUBJECT), rec(T0), rec(SHOWCASE), rec({ kind: 'subject-state', subject: 'Ghost', state: 'x' })], 'fail'],
    ['two records for one item → fail', [rec(SUBJECT), rec(SUBJECT, { R1: 4 }), rec(T0), rec(SHOWCASE)], 'fail'],
  ] as Array<[string, ReviewRecord[], string]>)('%s', (_n, records, verdict) => {
    expect(summarizeReview({ sha: SHA, required, records: loaded(records) }).verdict).toBe(verdict);
  });
  it('binds a record to the composite the reviewer saw', () => {
    const records = loaded([rec(SUBJECT), rec(T0), rec(SHOWCASE)]);
    const good = new Map(required.map((i) => [itemId(i), 'c'.repeat(64)]));
    expect(summarizeReview({ sha: SHA, required, records, composites: good }).verdict).toBe('pass');
    const bad = new Map(good).set('t0-matrix', 'd'.repeat(64));
    const s = summarizeReview({ sha: SHA, required, records, composites: bad });
    expect([s.verdict, s.compositeMismatch.map((c) => c.item)]).toEqual(['fail', ['t0-matrix']]);
  });
  it('loadRecords enforces the file-name rule and reports invalid JSON', () => {
    const dir = tmp();
    write(join(dir, 'button-open.json'), JSON.stringify(rec(SUBJECT)));
    write(join(dir, 'wrong-name.json'), JSON.stringify(rec(T0)));
    write(join(dir, 'broken.json'), '{');
    write(join(dir, 'README.md'), '# ignored');
    const r = loadRecords(dir);
    expect(r.map((x) => [x.file.slice(dir.length + 1), !!x.record])).toEqual([['broken.json', false], ['button-open.json', true], ['wrong-name.json', false]]);
    expect(r[2]!.problems).toEqual(['file name must be t0-matrix.json']);
  });
});

/** w×h RGBA gradient keyed by `seed`, so different captures differ. */
function img(w: number, h: number, seed = 0) {
  const data = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; data[i] = (x + seed) & 255; data[i + 1] = (y * 3 + seed) & 255; data[i + 2] = (x ^ y) & 255; data[i + 3] = 255; }
  return { width: w, height: h, data };
}

describe('PNG codec (port of the legacy verifier decoder)', () => {
  it('round-trips RGBA and rejects non-PNG / truncated input', () => {
    const a = img(37, 21, 5);
    const back = decodePng(encodePng(a));
    expect([back.width, back.height]).toEqual([37, 21]);
    expect(Buffer.from(back.data).equals(Buffer.from(a.data))).toBe(true);
    expect(() => decodePng(Buffer.from('hello world, definitely not a png file'))).toThrow(PngError);
    const png = encodePng(a);
    expect(() => decodePng(png.subarray(0, png.length - 20))).toThrow(PngError);
  });
  it('flags blank and transparent images, passes rendered ones', () => {
    expect(blankReason(rasterStats(img(32, 32)))).toBeNull();
    expect(blankReason(rasterStats({ width: 8, height: 8, data: new Uint8Array(256).fill(255) }))).toMatch(/blank/);
    expect(blankReason(rasterStats({ width: 8, height: 8, data: new Uint8Array(256) }))).toMatch(/transparent/);
  });
});

describe('review composite', () => {
  // Real sizes would be 1440 / 390 wide captures; widths are what the composite checks, heights are kept small.
  const input = (over: Partial<CompositeInput> = {}): CompositeInput => ({
    item: 'button-open',
    scenes: Object.fromEntries(SCENES.map((s, i) => [s, { light: img(1440, 12, i), dark: img(1440, 12, i + 50) }])) as CompositeInput['scenes'],
    mobile: img(390, 30, 3), baseline: img(1440, 12, 0), current: img(1440, 12, 9), ...over,
  });
  it('lays out 16 scene tiles, the 390 cell, baseline, current and the diff heat-map; deterministic sha256', () => {
    const a = buildComposite(input());
    const b = buildComposite(input());
    expect(a.sha256).toBe(b.sha256);
    expect(a.tiles.map((t) => t.label)).toEqual([...SCENES.flatMap((s) => [`${s} light @1440`, `${s} dark @1440`]), 'photo @390', 'previous baseline', 'current', 'diff heat-map']);
    expect(a.diffRatio).toBeGreaterThan(0);
    const png = decodePng(a.png);
    expect([png.width, png.height]).toEqual([a.width, a.height]);
    expect(blankReason(rasterStats(png))).toBeNull();
    expect(buildComposite(input({ current: img(1440, 12, 1) })).sha256).not.toBe(a.sha256);
  });
  it('with no approved baseline the slots stay empty (no invented pixels)', () => {
    const c = buildComposite(input({ baseline: null }));
    expect(c.diffRatio).toBeNull();
    expect(c.tiles.filter((t) => t.source === null).map((t) => t.label)).toEqual(['previous baseline (none approved yet)', 'diff heat-map (no baseline)']);
  });
  it('rejects a missing scene, a wrong width and a baseline/current size mismatch', () => {
    const scenes = { ...input().scenes } as Record<string, unknown>;
    delete scenes['hf-pattern'];
    expect(() => buildComposite(input({ scenes: scenes as CompositeInput['scenes'] }))).toThrow(/hf-pattern\/light capture missing/);
    expect(() => buildComposite(input({ mobile: img(400, 10) }))).toThrow(CompositeInputError);
    expect(() => diffHeatmap(img(10, 10), img(10, 11))).toThrow(/differ in size/);
    expect(diffHeatmap(img(10, 10, 2), img(10, 10, 2)).ratio).toBe(0);
  });
});

describe('scripts/qual/review-record.mjs', () => {
  const cli = (args: string[], env: Record<string, string> = {}) => spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', join(REPO, 'scripts/qual/review-record.mjs'), ...args],
    { cwd: REPO, encoding: 'utf8', env: { ...process.env, ...env }, timeout: 120_000 });

  it('composites: builds one PNG per item and an index with sha256', () => {
    const dir = tmp();
    const caps = join(dir, 'caps');
    const file = (name: string, w: number, h: number, seed: number) => { write(join(caps, name), encodePng(img(w, h, seed))); return name; };
    const scenes = Object.fromEntries(SCENES.map((s, i) => [s, { light: file(`${s}-l.png`, 1440, 8, i), dark: file(`${s}-d.png`, 1440, 8, i + 9) }]));
    write(join(caps, 'review-inputs.json'), JSON.stringify({ version: 1, sha: SHA, items: [{ item: 't0-matrix', scenes, mobile: file('m.png', 390, 20, 1), baseline: null, current: file('c.png', 1440, 8, 4) }] }));
    const r = cli(['composites', '--inputs', join(caps, 'review-inputs.json'), '--out', join(dir, 'out')]);
    expect(r.stderr).toBe('');
    expect(r.status).toBe(0);
    const index = JSON.parse(readFileSync(join(dir, 'out/index.json'), 'utf8'));
    expect(index.items.map((i: { item: string }) => i.item)).toEqual(['t0-matrix']);
    expect(createHash('sha256').update(readFileSync(join(dir, 'out/t0-matrix.png'))).digest('hex')).toBe(index.items[0].sha256);
  });
  it('composites: a missing review-inputs.json fails (no composite from nothing)', () => {
    const r = cli(['composites', '--inputs', join(tmp(), 'none.json'), '--out', join(tmp(), 'o')]);
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/not found/);
  });
  it('validate: writes the summary and exits 1 while required records are missing or invalid', () => {
    const dir = tmp();
    write(join(dir, 'records/t0-matrix.json'), JSON.stringify(rec(T0, { R2: 1 })));
    const out = join(dir, 'summary.json');
    const r = cli(['validate', '--sha', SHA, '--records', join(dir, 'records'), '--out', out]);
    expect(r.status).toBe(1);
    const s = JSON.parse(readFileSync(out, 'utf8'));
    expect(s.verdict).toBe('fail');
    expect(s.failing).toEqual([expect.objectContaining({ item: 't0-matrix', criteria: ['R2'] })]);
    expect(s.required).toBeGreaterThan(3);
    expect(s.missing.length).toBe(s.required - 1);
  });
  it('usage errors exit 64', () => {
    expect(cli(['score']).status).toBe(64);
    expect(cli(['validate', '--records']).status).toBe(64);
    expect(cli(['composites', '--sha', SHA]).status).toBe(64);
  });
});
