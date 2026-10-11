/* REQ-QUAL-63 ReleaseVerdict (S-55) and the GA checklist: 16 items G-01..G-16, ga only when all pass, external items
   pending without their owners' artifacts, L13/L14 gated at RC-1, advisory before GA, and the end-to-end
   `run.mjs --lane all --scope release --verdict` path on a synthetic evidence set. */
import { afterAll, afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import Ajv from 'ajv';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ReleaseVerdict } from '../../../src/contracts/testing.ts';
import { EXIT } from '../src/evidence/laneRunner.ts';
import type { ReviewSummary } from '../src/evidence/reviewRecord.ts';
import {
  buildVerdict, CHECKLIST, GA_ITEMS, humanRecordsRequired, isAdvisory, readExternalItems, releasePhase, renderChecklist, verdictProblems,
  type GaItem, type VerdictInput,
} from '../src/evidence/verdict.ts';
import { VERIFIED_LANES, type Verification } from '../src/evidence/verify.ts';
import { REPO, cleanupRepos, makeRepo, row, runFixture } from './helpers/laneFixture.ts';

afterAll(cleanupRepos);

const SHA = '5'.repeat(40);
const DOUBLE = JSON.parse(readFileSync(join(REPO, 'tests/contract-doubles/reports/release-verdict.json'), 'utf8')) as ReleaseVerdict;
const SCHEMA = JSON.parse(readFileSync(join(REPO, 'certification/schemas/release-verdict.schema.json'), 'utf8'));
const validate = new Ajv({ allErrors: true, strict: false }).compile(SCHEMA);

const passRows = [
  ...VERIFIED_LANES.map((lane) => ({ lane, state: 'pass', path: `gate-${lane}.mjs` })),
  { lane: 'L1', state: 'pass', path: 'tests/contract/**/*.test.ts*' },
  { lane: 'L1', state: 'pass', path: 'scripts/qual/deliverables/check.ts' },
];
const REVIEW: ReviewSummary = { version: 1, sha: SHA, required: 7, recorded: 7, passed: 7, missing: [], failing: [], invalid: [], unbound: [], compositeMismatch: [], problems: [], verdict: 'pass' };
const OK: Verification = { ok: true, sha: SHA, problems: [], lanes: {}, review: REVIEW };
const ext = (id: GaItem, over: Record<string, unknown> = {}) => ({ file: `plat/x/release-items/${id}.json`, value: { version: 1, id, sha: SHA, status: 'pass', evidence: ['https://gitlab.com/x/-/jobs/1'], ...over } });
const EXTERNAL = Object.fromEntries((['G-11', 'G-12', 'G-14', 'G-15', 'G-16'] as GaItem[]).map((id) => [id, ext(id)]));

function input(over: Partial<VerdictInput> = {}): VerdictInput {
  return { sha: SHA, tag: 'v5.0.0', line: '5x', results: passRows, verification: OK, l13: { file: 'a.json', value: { sha: SHA, verdict: 'pass' } },
    review: REVIEW, external: EXTERNAL, trackedPaths: [], ...over };
}
/** EXTERNAL without the given owner artifacts. */
const without = (...ids: GaItem[]) => Object.fromEntries(Object.entries(EXTERNAL).filter(([k]) => !ids.includes(k as GaItem))) as VerdictInput['external'];
const status = (v: ReturnType<typeof buildVerdict>, id: GaItem) => v.items.find((i) => i.id === id)!.status;

describe('ReleaseVerdict shape (S-55)', () => {
  it('has exactly G-01..G-16 in order, validates against the schema and the S-55 type, and matches the double', () => {
    const v = buildVerdict(input());
    expect(v.items.map((i) => i.id)).toEqual([...GA_ITEMS]);
    expect(verdictProblems(v)).toEqual([]);
    expect(validate(v)).toBe(true);
    const typed: ReleaseVerdict = v; // compile-time: tsc -p packages/qa/tsconfig.json
    expect(typed.version).toBe(1);
    // every key of the contract double exists with the same JSON type; item entries carry the double's keys
    for (const [k, val] of Object.entries(DOUBLE)) expect(typeof (v as unknown as Record<string, unknown>)[k]).toBe(typeof val);
    for (const k of Object.keys(DOUBLE.items[0]!)) expect(Object.keys(v.items[0]!)).toContain(k);
    expect(['pass', 'fail', 'pending']).toContain(DOUBLE.items[0]!.status);
    // the double (one item) is a valid S-55 value, but not a complete verdict
    expect(verdictProblems(DOUBLE)).toEqual([`items must be exactly ${GA_ITEMS.join(',')} in order`]);
  });
  it('ga is true only when all 16 items pass', () => {
    expect(buildVerdict(input()).ga).toBe(true);
    const v = buildVerdict(input({ external: without('G-11') }));
    expect(status(v, 'G-11')).toBe('pending');
    expect(v.ga).toBe(false);
    expect(verdictProblems({ ...v, ga: true })).toContain('ga is true while an item is not pass');
  });
  it('CHECKLIST mirrors certification/RELEASE_CHECKLIST.md (one row per item, same ids)', () => {
    const md = readFileSync(join(REPO, 'certification/RELEASE_CHECKLIST.md'), 'utf8');
    const rows = [...md.matchAll(/^\| (G-\d{2}) \|/gm)].map((m) => m[1]);
    expect(rows).toEqual(CHECKLIST.map((c) => c.id));
    expect(CHECKLIST.map((c) => c.id)).toEqual([...GA_ITEMS]);
  });
});

describe('items', () => {
  it('G-01 fails on any non-pass result, a lane without results, or a failed evidence verification', () => {
    expect(status(buildVerdict(input({ results: passRows.map((r) => (r.lane === 'L9' ? { ...r, state: 'fail' } : r)) })), 'G-01')).toBe('fail');
    expect(status(buildVerdict(input({ results: passRows.filter((r) => r.lane !== 'L4') })), 'G-01')).toBe('fail');
    const bad = buildVerdict(input({ verification: { ...OK, ok: false, problems: [{ code: 'png-blank', message: 'x.png blank' }] } }));
    expect(status(bad, 'G-01')).toBe('fail');
    expect(bad.items[0]!.reason).toMatch(/evidence verifier: png-blank/);
  });
  it('lane items read their lanes; G-13 needs L2 and L10', () => {
    const v = buildVerdict(input({ results: passRows.map((r) => (r.lane === 'L10' ? { ...r, state: 'fail' } : r)) }));
    expect(['G-02', 'G-05', 'G-07', 'G-08'].map((id) => status(v, id as GaItem))).toEqual(['pass', 'pass', 'pass', 'pass']);
    expect(status(v, 'G-13')).toBe('fail');
  });
  it('G-03/G-06/G-04 are pending until their rows are registered in the release run', () => {
    const v = buildVerdict(input({ results: passRows.filter((r) => !/tests\/contract|deliverables/.test(r.path)) }));
    expect([status(v, 'G-03'), status(v, 'G-04'), status(v, 'G-06')]).toEqual(['pending', 'pending', 'pending']);
    expect(v.items.find((i) => i.id === 'G-04')!.reason).toMatch(/G-19/);
  });
  it('external items: absent → pending, other SHA → pending, malformed or evidence-less pass → fail, owner fail → fail', () => {
    const v = buildVerdict(input({ external: { ...without('G-14'), 'G-15': ext('G-15', { sha: '6'.repeat(40) }), 'G-16': ext('G-16', { status: 'maybe' }), 'G-11': ext('G-11', { evidence: [] }), 'G-12': ext('G-12', { status: 'fail' }) } }));
    expect(['G-14', 'G-15', 'G-16', 'G-11', 'G-12'].map((id) => status(v, id as GaItem))).toEqual(['pending', 'pending', 'fail', 'fail', 'fail']);
  });
  it('G-12 fails while the checkout tracks legacy/ or reports/, whatever the owner artifact says', () => {
    const v = buildVerdict(input({ trackedPaths: ['reports/3.2-release/vite-integration.json'] }));
    expect(status(v, 'G-12')).toBe('fail');
  });
  it('L13/L14 (G-09, G-10): missing is pending before RC-1 and fail from RC-1', () => {
    const none = { l13: null, review: { ...REVIEW, missing: ['t0-matrix', 'showcase-ops-console'], recorded: 5, passed: 5, verdict: 'incomplete' as const } };
    const beta = buildVerdict(input({ ...none, tag: 'v5.0.0-beta.2' }));
    expect([status(beta, 'G-09'), status(beta, 'G-10')]).toEqual(['pending', 'pending']);
    const rc = buildVerdict(input({ ...none, tag: 'v5.0.0-rc.1' }));
    expect([status(rc, 'G-09'), status(rc, 'G-10')]).toEqual(['fail', 'fail']);
    const scored2 = buildVerdict(input({ review: { ...REVIEW, failing: [{ item: 'showcase-ops-console', file: 'f', criteria: ['R7'] }], verdict: 'fail' } }));
    expect(status(scored2, 'G-10')).toBe('fail');
    expect(status(buildVerdict(input({ l13: { file: 'a.json', value: { sha: '0'.repeat(40), verdict: 'pass' } } })), 'G-09')).toBe('fail');
  });
});

describe('phases', () => {
  it.each([
    ['v5.0.0-alpha.3', '5x', 'alpha', false, true], ['v5.0.0-beta.1', '5x', 'beta', false, true], ['v5.0.0-rc.1', '5x', 'rc', true, true],
    ['v5.0.0', '5x', 'ga', true, false], ['v5.1.2', '5x', 'ga', true, false], ['v4.2.0', '5x', '4x', false, true], ['v5.0.0', '4x', '4x', false, true],
    ['', '5x', 'untagged', false, true],
  ] as const)('%s on %s → %s (human records %s, advisory %s)', (tag, line, phase, human, advisory) => {
    expect(releasePhase(tag, line)).toBe(phase);
    expect(humanRecordsRequired(phase)).toBe(human);
    expect(isAdvisory(phase)).toBe(advisory);
  });
});

describe('rendered checklist', () => {
  it('ticks exactly the items that pass in the verdict', () => {
    const v = buildVerdict(input({ external: without('G-15') }));
    const md = renderChecklist(v);
    expect(md.match(/^\| \[x\] \|/gm)).toHaveLength(15);
    expect(md).toMatch(/^\| \[ \] \| G-15 \|.*\| pending \|/m);
    expect(md).toContain(`@ ${SHA}`);
  });
});

describe('certification/run.mjs --lane all --scope release --verdict (synthetic evidence set)', () => {
  const builtins = `[${VERIFIED_LANES.map((lane) => row({ lane, kind: 'node-script', path: 'ok.mjs', scope: 'release' })).join(',')}]`;
  // L2–L4 consume a tarball (REQ-QUAL-28): the synthetic set provides one through AURAGLASS_TARBALL.
  const files = { 'ok.mjs': '', 'pkg.tgz': 'synthetic tarball', 'certification/exemptions.json': '[]' };
  const env = (tag: string) => ({ CI_COMMIT_SHA: SHA, CI_COMMIT_TAG: tag, AURAGLASS_TARBALL: 'pkg.tgz' });
  beforeEach(() => { jest.spyOn(console, 'log').mockImplementation(() => {}); jest.spyOn(console, 'error').mockImplementation(() => {}); });
  afterEach(() => { jest.restoreAllMocks(); });

  it('emits 16 items and ga=false while any item is pending; pre-release is advisory (exit 0)', async () => {
    const root = makeRepo({ builtins, files });
    const r = await runFixture(root, { lane: 'all', scope: 'release', extraArgs: ['--verdict', 'out/verdict.json'], env: env('v5.0.0-rc.1') });
    expect(r.code).toBe(EXIT.ok);
    const v = JSON.parse(readFileSync(join(root, 'out/verdict.json'), 'utf8'));
    expect(v.items).toHaveLength(16);
    expect(v.items.map((i: { id: string }) => i.id)).toEqual([...GA_ITEMS]);
    expect(v.items.some((i: { status: string }) => i.status === 'pending')).toBe(true);
    expect(v).toMatchObject({ version: 1, sha: SHA, tag: 'v5.0.0-rc.1', ga: false, phase: 'rc', advisory: true });
    expect(validate(v)).toBe(true);
    // lanes all pass, but the synthetic set has no thresholds/scenes/inventory/baselines → G-01 fails on provenance
    expect(v.items[0]).toMatchObject({ id: 'G-01', status: 'fail' });
    expect(v.items[0].reason).toMatch(/hash-missing/);
    expect(['G-11', 'G-14', 'G-15', 'G-16'].map((id) => v.items.find((i: { id: string }) => i.id === id).status)).toEqual(['pending', 'pending', 'pending', 'pending']);
    expect(existsSync(join(root, 'out/release-checklist.md'))).toBe(true);
    expect(existsSync(join(root, '.artifacts/qual/claims.json'))).toBe(false); // incomplete evidence → no claims
  });

  it('a GA tag fails the job while ga is false', async () => {
    const root = makeRepo({ builtins, files });
    const r = await runFixture(root, { lane: 'all', scope: 'release', extraArgs: ['--verdict', 'v.json'], env: env('v5.0.0') });
    expect(r.code).toBe(EXIT.fail);
    expect((r.manifest?.summary as Record<string, number>).fail).toBe(0); // every lane passed: the open GA items fail it
    expect(JSON.parse(readFileSync(join(root, 'v.json'), 'utf8')).ga).toBe(false);
  });

  it('reads owner artifacts release-items/G-NN.json from the evidence dir', async () => {
    const root = makeRepo({ builtins, files: {
      ...files,
      '.artifacts/plat/plat-release-p0/release-items/G-11.json': JSON.stringify({ version: 1, id: 'G-11', sha: SHA, status: 'pass', evidence: ['https://gitlab.com/q'] }),
    } });
    expect(Object.keys(readExternalItems(join(root, '.artifacts')))).toEqual(['G-11']);
    await runFixture(root, { lane: 'all', scope: 'release', extraArgs: ['--verdict', 'v.json'], env: env('v5.0.0-beta.1') });
    const v = JSON.parse(readFileSync(join(root, 'v.json'), 'utf8'));
    expect(v.items.find((i: { id: string }) => i.id === 'G-11')).toMatchObject({ status: 'pass', source: ['plat/plat-release-p0/release-items/G-11.json', 'https://gitlab.com/q'] });
  });
});
