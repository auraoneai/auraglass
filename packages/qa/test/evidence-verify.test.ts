/* REQ-QUAL-61 evidence verifier: one complete synthetic evidence set passes; each omission fails with its own code. */
import { afterAll, describe, expect, it } from '@jest/globals';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { encodePng } from '../src/evidence/png.ts';
import { loadRecords, type ReviewRecord } from '../src/evidence/reviewRecord.ts';
import {
  baselinesSha256, collectEvidence, recomputeHashes, verifyEvidence, VERIFIED_LANES,
  type EvidenceSet, type ProblemCode, type VerifyOptions,
} from '../src/evidence/verify.ts';

const SHA = 'a'.repeat(40);
const OTHER = 'b'.repeat(40);
const NOW = new Date('2026-10-10T12:00:00Z');
const HASHES = { thresholdsSha256: '1'.repeat(64), scenesSha256: '2'.repeat(64), inventorySha256: '3'.repeat(64), baselinesSha256: '4'.repeat(64) };
const CELLS = ['button--playground|photo|chromium|light', 'button--playground|flat-white|chromium|dark'];

const dirs: string[] = [];
afterAll(() => { for (const d of dirs) rmSync(d, { recursive: true, force: true }); });
const tmp = () => { const d = mkdtempSync(join(tmpdir(), 'ag-verify-')); dirs.push(d); return d; };
const write = (file: string, body: string | Uint8Array) => { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, body); };

/** A rendered-looking 64×48 RGBA gradient (not blank). */
function gradient(w = 64, h = 48): Uint8Array {
  const d = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; d[i] = x * 4; d[i + 1] = y * 5; d[i + 2] = (x + y) * 2; d[i + 3] = 255; }
  return encodePng({ width: w, height: h, data: d });
}
const blank = (w = 64, h = 48) => encodePng({ width: w, height: h, data: new Uint8Array(w * h * 4).fill(255) });

function record(item: ReviewRecord['item'], over: Partial<ReviewRecord> = {}): ReviewRecord {
  const scores: ReviewRecord['scores'] = { R1: 4, R2: 3, R3: 3, R4: 4, R5: 3, R6: 3, ...(item.kind === 'showcase' ? { R7: 4 } : {}) };
  return { version: 1, reviewer: 'Design Reviewer', sha: SHA, item, scores, notes: '', compositeSha256: 'c'.repeat(64), reviewedAt: '2026-10-09T10:00:00Z', ...over };
}

interface Built { set: EvidenceSet; opts: VerifyOptions; dir: string; records: string }

/** The complete set: one `--lane all` manifest, L6 plan + captures with PNGs, inventory, L13 aggregate, L14 records. */
function complete(): Built {
  const dir = tmp();
  const ev = join(dir, '.artifacts');
  const results = VERIFIED_LANES.map((lane) => ({ lane, stream: 'qual', kind: 'node-script', path: `gate-${lane}.mjs`, scope: 'release', state: 'pass' }));
  write(join(ev, 'qual/qual-certify-release/lane-manifest.json'), JSON.stringify({ version: 1, lane: 'all', sha: SHA, scope: 'release', results, cells: CELLS, subjects: ['Button'], ...HASHES }));
  const vis = join(ev, 'qual/qual-certify-release/environment-visual');
  write(join(vis, 'plan.json'), JSON.stringify({ version: 1, sha: SHA, cells: CELLS, subjects: ['Button'] }));
  write(join(vis, 'png/a.png'), gradient());
  write(join(vis, 'png/b.png'), gradient());
  write(join(vis, 'captures-1.jsonl'), [
    { id: CELLS[0], subject: 'Button', pngs: [{ path: 'png/a.png', width: 64, height: 48 }] },
    { id: CELLS[1], subject: 'Button', pngs: [{ path: 'png/b.png', width: 64, height: 48 }] },
  ].map((r) => JSON.stringify(r)).join('\n'));
  write(join(ev, 'qual/qual-certify-l1/inventory.json'), JSON.stringify({ version: 1, items: [{ name: 'Button', class: 'visual' }, { name: 'useGlass', class: 'nonvisual' }] }));
  write(join(ev, `qual/h-aggregate/a11y-manual-${SHA}.json`), JSON.stringify({ sha: SHA, verdict: 'pass', required: 5, recorded: 5, passed: 5, missing: [] }));
  const records = join(dir, 'records');
  write(join(records, 'button-open.json'), JSON.stringify(record({ kind: 'subject-state', subject: 'Button', state: 'open' })));
  write(join(records, 't0-matrix.json'), JSON.stringify(record({ kind: 't0-matrix', subject: 't0-matrix' })));
  write(join(records, 'showcase-ops-console.json'), JSON.stringify(record({ kind: 'showcase', subject: 'ops-console' })));
  write(join(records, 'README.md'), '# not a record\n');
  const set = collectEvidence(ev, { sha: SHA, recordsDir: records, loadRecords });
  const opts: VerifyOptions = {
    sha: SHA, now: NOW, recomputed: { ...HASHES }, flagships: [{ name: 'Button', states: ['open'] }], s1Showcases: ['ops-console'],
    requireHumanRecords: true, exemptions: [], consoleAllowlist: [], quarantine: [],
    readFile: (p) => { try { return readFileSync(p); } catch { return null; } },
  };
  return { set, opts, dir, records };
}

const codes = (b: Built) => [...new Set(verifyEvidence(b.set, b.opts).problems.map((p) => p.code))].sort();

describe('verifyEvidence', () => {
  it('a complete synthetic evidence set passes', () => {
    const b = complete();
    const v = verifyEvidence(b.set, b.opts);
    expect(v.problems).toEqual([]);
    expect(v.ok).toBe(true);
    expect(Object.keys(v.lanes)).toEqual([...VERIFIED_LANES]);
    expect(v.review?.verdict).toBe('pass');
    // collectEvidence read every kind of evidence from disk
    expect([b.set.manifests.length, b.set.plans.length, b.set.captures.length, b.set.l14.length]).toEqual([1, 1, 2, 3]);
    expect(b.set.inventory && b.set.l13).toBeTruthy();
  });

  const cases: Array<[string, (b: Built) => void, ProblemCode[]]> = [
    ['no lane manifest at all', (b) => { b.set.manifests = []; }, ['lane-missing']],
    ['a lane with 0 results (L7 dropped)', (b) => { const m = b.set.manifests[0]!.manifest; m.results = m.results.filter((r) => r.lane !== 'L7'); }, ['lane-empty']],
    ['a manifest bound to another SHA', (b) => { b.set.manifests[0]!.manifest.sha = OTHER; }, ['lane-missing', 'sha-mismatch']],
    ['thresholds sha256 differs from the checkout', (b) => { b.opts.recomputed.thresholdsSha256 = 'f'.repeat(64); }, ['hash-mismatch']],
    ['the manifest ran without baselines (null hash)', (b) => { b.set.manifests[0]!.manifest.baselinesSha256 = null; }, ['hash-missing']],
    ['scenes manifest absent from the checkout', (b) => { b.opts.recomputed.scenesSha256 = null; }, ['hash-missing']],
    ['no inventory.json', (b) => { b.set.inventory = null; }, ['inventory-missing']],
    ['a visual subject with no planned cell', (b) => { b.set.inventory!.value.items.push({ name: 'Dialog', class: 'visual' }); }, ['subject-unplanned']],
    ['a planned cell without a capture result', (b) => { b.set.captures.pop(); }, ['cell-missing']],
    ['a declared PNG missing from the set', (b) => { b.set.captures[0]!.row.pngs = [{ path: 'png/none.png', width: 64, height: 48 }]; }, ['png-missing']],
    ['a corrupt PNG', (b) => { write(join(dirname(b.set.captures[0]!.file), 'png/a.png'), 'not a png at all, just text bytes here'); }, ['png-invalid']],
    ['a PNG of the wrong size', (b) => { b.set.captures[0]!.row.pngs = [{ path: 'png/a.png', width: 1440, height: 900 }]; }, ['png-size']],
    ['a blank PNG', (b) => { write(join(dirname(b.set.captures[0]!.file), 'png/a.png'), blank()); }, ['png-blank']],
    ['no L13 aggregate', (b) => { b.set.l13 = null; }, ['l13-missing']],
    ['an L13 aggregate for another SHA', (b) => { b.set.l13!.value.sha = OTHER; }, ['l13-unbound']],
    ['an incomplete L13 aggregate', (b) => { b.set.l13!.value.verdict = 'incomplete'; }, ['l13-not-pass']],
    ['no L14 record for an S1 showcase', (b) => { b.set.l14 = b.set.l14.filter((r) => !r.file.includes('showcase-')); }, ['l14-incomplete']],
    ['an L14 record scored 2', (b) => { b.set.l14[0]!.record!.scores.R3 = 2; }, ['l14-fail']],
    ['an L14 record on an earlier SHA with baseline diffs', (b) => { b.set.l14[0]!.record!.sha = OTHER; }, ['l14-fail']],
    ['an expired exemption', (b) => { b.opts.exemptions = [{ subject: 'Button', gate: 'pixel', cells: ['*'], rationale: 'r', approvedBy: 'o', expires: '2026-10-01' }]; }, ['exemption-expired']],
    ['an expired console-allowlist entry', (b) => { b.opts.consoleAllowlist = [{ regex: 'x', owner: 'cmp', expires: '2026-09-30', reason: 'temporary noise' }]; }, ['allowlist-expired']],
    ['a quarantined cell in quarantine.json', (b) => { b.opts.quarantine = [{ cell: CELLS[0], issue: '#1', expires: '2026-10-12' }]; }, ['quarantined']],
    ['a quarantined lane result', (b) => { b.set.manifests[0]!.manifest.results[0]!.state = 'quarantined'; }, ['quarantined']],
  ];
  it.each(cases)('fails on omission: %s', (_name, mutate, expected) => {
    const b = complete();
    mutate(b);
    expect(codes(b)).toEqual(expected);
    expect(verifyEvidence(b.set, b.opts).ok).toBe(false);
  });

  it('an earlier-SHA L14 record binds only when the subject is unchanged since that SHA', () => {
    const b = complete();
    b.set.l14[0]!.record!.sha = OTHER;
    expect(verifyEvidence(b.set, { ...b.opts, unchangedSince: (item, from) => item.subject === 'Button' && from === OTHER }).ok).toBe(true);
    expect(verifyEvidence(b.set, { ...b.opts, unchangedSince: () => false }).ok).toBe(false);
  });

  it('before RC-1 (requireHumanRecords false) missing L13/L14 records are not verifier failures', () => {
    const b = complete();
    b.set.l13 = null;
    b.set.l14 = [];
    expect(verifyEvidence(b.set, { ...b.opts, requireHumanRecords: false }).problems).toEqual([]);
  });

  it('a missing exemptions file (undefined) fails closed', () => {
    const b = complete();
    expect(codes({ ...b, opts: { ...b.opts, exemptions: undefined } })).toEqual(['exemption-invalid']);
  });
});

describe('checkout hashes', () => {
  it('baselinesSha256 covers every file path and content under certification/baselines (null when absent)', () => {
    const root = tmp();
    expect(baselinesSha256(root)).toBeNull();
    write(join(root, 'certification/baselines/linux/button.png'), gradient());
    const h1 = baselinesSha256(root);
    write(join(root, 'certification/baselines/linux/button.png'), blank());
    const h2 = baselinesSha256(root);
    write(join(root, 'certification/baselines/linux/dialog.png'), blank());
    const h3 = baselinesSha256(root);
    expect(new Set([h1, h2, h3]).size).toBe(3);
    expect(h1).toMatch(/^[0-9a-f]{64}$/);
  });
  it('recomputeHashes reads thresholds, scenes, the SubjectIndex and baselines from the checkout', () => {
    const root = tmp();
    write(join(root, 'certification/thresholds.json'), '{}');
    const r = recomputeHashes(root);
    expect(r.thresholdsSha256).toBe('44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a');
    expect([r.scenesSha256, r.inventorySha256, r.baselinesSha256]).toEqual([null, null, null]);
  });
});
