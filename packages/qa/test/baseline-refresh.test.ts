/* G-14 / REQ-QUAL-25 (FIN-432): baseline refresh without blocking other streams.
   - certification/run.mjs L7 verdict: a non-QUAL PR diff is `pending` and exits 0; a `next-qual/baselines-<yyyymmdd>` diff
     without an L14 record fails (with one it passes); release scope with a changed cell fails; any other failure fails.
   - scripts/qual/baseline-refresh.mjs: candidate-vs-committed tree diff and baseline-diff-report.html.
   - ci/qual.gitlab-ci.yml carries qual:certify:baseline-refresh (manual on pr/main, scheduled nightly) and qual:certify:l7. */
import { afterEach, describe, expect, test } from '@jest/globals';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parse } from 'yaml';
// @ts-expect-error — plain ESM module without declarations
import { blockingExit, l7RowResult } from '../../../certification/run.mjs';
// @ts-expect-error — plain ESM module without declarations
import { diffBaselineTrees, renderDiffReport } from '../../../scripts/qual/baseline-refresh.mjs';
// @ts-expect-error — plain ESM module without declarations
import { baseRevArgs } from '../../../scripts/qual/l7-base.mjs';
// @ts-expect-error — plain ESM module without declarations
import { resolveRequest } from '../../../scripts/qual/serve-static.mjs';
import { allowedDiffPixels, baselinePath, l7Verdict, parseBaselinePath, REGRESSION_CONFIGS } from '../src/evidence/regression';
import { readPassingL14 } from '../src/evidence/l14Records';
import { compareRgba } from '../src/evidence/visualClass';
import { decodePng, encodePng, type RgbaImage } from '../src/pixel/png';

const ROOT = join(__dirname, '../../..');
const deps = { l7Verdict, readPassingL14 };
const tmp: string[] = [];
afterEach(() => { for (const d of tmp.splice(0)) rmSync(d, { recursive: true, force: true }); });
function scratch(): string { const d = mkdtempSync(join(tmpdir(), 'ag-l7-')); tmp.push(d); return d; }

const CELL = 'button--playground|photo|chromium|light.glass.default.standard.1440';
const CELL2 = 'button--playground|photo|webkit|light.glass.default.standard.1440';

/** Playwright JSON report with one test per (title, message|null). */
function report(tests: Array<[string, string | null]>) {
  return { suites: [{ title: 'regression.spec.ts', specs: [], suites: [{ title: 'L7 regression', specs: tests.map(([title, message]) => ({
    title, tests: [{ status: message ? 'unexpected' : 'expected', results: [message ? { status: 'failed', error: { message: `${message}\n    at x` } } : { status: 'passed' }] }],
  })) }] }] };
}

/** Lane evidence with regression cell rows as regression.spec.ts writes them. */
function evidence(cells: Array<{ id: string; outcome: 'match' | 'changed' | 'no-baseline'; state?: string }>): string {
  const dir = scratch();
  mkdirSync(join(dir, 'regression'), { recursive: true });
  writeFileSync(join(dir, 'regression', 'cells-1.jsonl'),
    cells.map((c) => JSON.stringify({ id: c.id, subject: 'Button', owner: 'CMP', state: c.state ?? 'default', outcome: c.outcome })).join('\n') + '\n');
  return dir;
}

function l14Root(records: Array<{ subject: string; state: string; scores: number[] }>): string {
  const root = scratch();
  const dir = join(root, 'certification/review/records');
  mkdirSync(dir, { recursive: true });
  records.forEach((r, i) => writeFileSync(join(dir, `${r.subject.toLowerCase()}-${r.state}-${i}.json`), JSON.stringify({
    version: 1, reviewer: 'Design Reviewer', sha: 'a'.repeat(40), item: { kind: 'subject-state', subject: r.subject, state: r.state },
    scores: Object.fromEntries(r.scores.map((s, k) => [`R${k + 1}`, s])), notes: '', compositeSha256: 'b'.repeat(64), reviewedAt: '2026-10-08T10:00:00Z',
  })));
  return root;
}

const changedRun = () => ({ report: report([[`${CELL} @engine-chromium`, `Error: l7-changed: ${CELL} differs from /certification/baselines/x.png (c): 412 pixels (ratio 0.03 of all image pixels) are different.`], [`${CELL2} @engine-webkit`, null]]), status: 1, evidenceDir: evidence([{ id: CELL, outcome: 'changed' }, { id: CELL2, outcome: 'match' }]) });

describe('run.mjs L7 verdict (REQ-QUAL-25)', () => {
  test('non-QUAL PR (next-cmp/x): a diff is pending and the lane exits 0', async () => {
    const r = await l7RowResult({ ...changedRun(), scope: 'pr', branch: 'next-cmp/x', root: scratch() }, deps);
    expect(r.state).toBe('pending');
    expect(r.l7.changed).toEqual([CELL]);
    expect(r.reason).toMatch(/1 changed cell\(s\) over 1 subject-state\(s\).*awaiting a reviewed baselines PR/);
    expect(blockingExit([{ lane: 'L7', ...r }])).toBe(0);
  });

  test('non-QUAL FIN branch (next-fin/e-*) and main scope also never block on a diff', async () => {
    for (const [scope, branch] of [['pr', 'next-fin/e-cmp-08'], ['main', 'next'], ['nightly', 'next']] as const) {
      const r = await l7RowResult({ ...changedRun(), scope, branch, root: scratch() }, deps);
      expect([scope, r.state]).toEqual([scope, 'pending']);
    }
  });

  test('next-qual/baselines-20261008: a diff without an L14 record fails', async () => {
    const r = await l7RowResult({ ...changedRun(), scope: 'pr', branch: 'next-qual/baselines-20261008', root: scratch() }, deps);
    expect(r).toMatchObject({ state: 'fail', l7: { missingL14: ['Button/default'] } });
    expect(blockingExit([{ lane: 'L7', stream: 'qual', path: 'certification/lanes/regression.spec.ts', ...r }])).toBe(1);
  });

  test('next-qual/baselines-20261008: a failing L14 record (a score of 2) still fails; a passing one passes', async () => {
    const low = await l7RowResult({ ...changedRun(), scope: 'pr', branch: 'next-qual/baselines-20261008', root: l14Root([{ subject: 'Button', state: 'default', scores: [3, 3, 2, 4, 3, 3] }]) }, deps);
    expect(low.state).toBe('fail');
    const ok = await l7RowResult({ ...changedRun(), scope: 'pr', branch: 'next-qual/baselines-20261008', root: l14Root([{ subject: 'Button', state: 'default', scores: [3, 4, 3, 4, 3, 3] }]) }, deps);
    expect(ok.state).toBe('pass');
    expect(blockingExit([{ lane: 'L7', ...ok }])).toBe(0);
  });

  test('release scope: a changed cell fails, and so does a cell without a baseline', async () => {
    const r = await l7RowResult({ ...changedRun(), scope: 'release', branch: null, root: scratch() }, deps);
    expect(r.state).toBe('fail');
    expect(r.reason).toMatch(/release scope.*not pass/);
    const nb = await l7RowResult({
      report: report([[`${CELL} @engine-chromium`, `Error: l7-no-baseline: ${CELL} has no /certification/baselines/linux/chromium/Button/default__photo__light__1440.png`]]),
      status: 1, evidenceDir: evidence([{ id: CELL, outcome: 'no-baseline' }]), scope: 'release', branch: null, root: scratch(),
    }, deps);
    expect(nb.state).toBe('fail');
  });

  test('a QUAL branch (next-fin/g-*) diff outside a baselines PR fails; a missing baseline there is pending (bootstrap)', async () => {
    expect((await l7RowResult({ ...changedRun(), scope: 'pr', branch: 'next-fin/g-regression', root: scratch() }, deps)).state).toBe('fail');
    const nb = await l7RowResult({
      report: report([[`${CELL} @engine-chromium`, `Error: l7-no-baseline: ${CELL} has no baseline`]]),
      status: 1, evidenceDir: evidence([{ id: CELL, outcome: 'no-baseline' }]), scope: 'pr', branch: 'next-fin/g-regression', root: scratch(),
    }, deps);
    expect(nb).toMatchObject({ state: 'pending', l7: { noBaseline: [CELL] } });
  });

  test('a failure that is not a baseline diff (crash, unstable capture) fails on every branch', async () => {
    const r = await l7RowResult({
      report: report([[`${CELL} @engine-chromium`, 'Error: Timeout 5000ms exceeded while generating screenshot because the page kept changing']]),
      status: 1, evidenceDir: evidence([]), scope: 'pr', branch: 'next-cmp/x', root: scratch(),
    }, deps);
    expect(r.state).toBe('fail');
  });

  test('the diff evidence must match the failed tests (no silent loss of a changed cell)', async () => {
    const r = await l7RowResult({ report: changedRun().report, status: 1, evidenceDir: evidence([{ id: CELL2, outcome: 'match' }]), scope: 'pr', branch: 'next-cmp/x', root: scratch() }, deps);
    expect(r).toMatchObject({ state: 'fail', reason: expect.stringMatching(/0 changed\/no-baseline cell row\(s\) for 1 failed diff test/) });
  });

  test('all cells match → pass; a pending producer next to a match is pending below release', async () => {
    const pass = await l7RowResult({ report: report([[`${CELL} @engine-chromium`, null]]), status: 0, evidenceDir: evidence([{ id: CELL, outcome: 'match' }]), scope: 'pr', branch: 'next-cmp/x', root: scratch() }, deps);
    expect(pass.state).toBe('pass');
    const pend = await l7RowResult({
      report: report([[`${CELL} @engine-chromium`, null], ['merge-base Storybook for the visual-class report @engine-chromium', 'AgPendingProducer: pending: AG_L7_BASE not set (producer: qual:certify:l7 job)']]),
      status: 1, evidenceDir: evidence([{ id: CELL, outcome: 'match' }]), scope: 'pr', branch: 'next-cmp/x', root: scratch(),
    }, deps);
    expect(pend).toMatchObject({ state: 'pending', reason: expect.stringContaining('pending: AG_L7_BASE not set') });
  });

  test('a retried cell counts once (last row wins)', async () => {
    const dir = evidence([{ id: CELL, outcome: 'changed' }, { id: CELL2, outcome: 'match' }]);
    writeFileSync(join(dir, 'regression', 'cells-2.jsonl'), `${JSON.stringify({ id: CELL, subject: 'Button', owner: 'CMP', state: 'default', outcome: 'changed' })}\n`);
    const r = await l7RowResult({ report: changedRun().report, status: 1, evidenceDir: dir, scope: 'pr', branch: 'next-cmp/x', root: scratch() }, deps);
    expect(r.l7.changed).toEqual([CELL]);
  });
});

describe('l7Verdict branch classes', () => {
  const cells = [{ id: CELL, subject: 'Button', state: 'default', outcome: 'changed' as const }];
  test('only next-qual/baselines-<8 digits> is a baselines branch', () => {
    expect(l7Verdict({ scope: 'pr', branch: 'next-qual/baselines-2026108', cells, l14: new Set() }).state).toBe('fail'); // QUAL branch, not a baselines PR
    expect(l7Verdict({ scope: 'pr', branch: 'next-qual/baselines-20261008', cells, l14: new Set(['Button/default']) }).state).toBe('pass');
    expect(l7Verdict({ scope: 'pr', branch: 'next-surf/x', cells, l14: new Set() }).state).toBe('pending');
  });
});

// ---- baseline-refresh.mjs ------------------------------------------------------------------------------------------
function solid(w: number, h: number, rgb: [number, number, number]): RgbaImage {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < data.length; i += 4) { data[i] = rgb[0]; data[i + 1] = rgb[1]; data[i + 2] = rgb[2]; data[i + 3] = 255; }
  return { width: w, height: h, data };
}
function put(dir: string, rel: string, img: RgbaImage) { mkdirSync(join(dir, rel, '..'), { recursive: true }); writeFileSync(join(dir, rel), encodePng(img)); }

describe('baseline-refresh tree diff and report', () => {
  test('new / changed / unchanged / removed with base, candidate and diff images', () => {
    const base = scratch(); const cand = scratch(); const out = scratch();
    const [c1, c2] = [REGRESSION_CONFIGS[0]!, REGRESSION_CONFIGS[1]!];
    const rel = (s: string, st: string, c = c1) => baselinePath(s, st, c, '.', 'linux').slice(2);
    put(base, rel('Button', 'default'), solid(100, 100, [10, 10, 10]));
    const changed = solid(100, 100, [10, 10, 10]);
    for (let i = 0; i < 300 * 4; i += 4) changed.data[i] = 250; // 300 px > 20 allowed
    put(cand, rel('Button', 'default'), changed);
    put(base, rel('Button', 'hover'), solid(100, 100, [5, 5, 5]));
    const tiny = solid(100, 100, [5, 5, 5]);
    for (let i = 0; i < 10 * 4; i += 4) tiny.data[i] = 250; // 10 px ≤ 20 allowed
    put(cand, rel('Button', 'hover'), tiny);
    put(cand, rel('Dialog', 'open', c2), solid(50, 50, [1, 1, 1]));
    put(base, rel('Old', 'default'), solid(10, 10, [1, 1, 1]));
    const deps2 = { decodePng, encodePng, compareRgba, allowedDiffPixels, parseBaselinePath };
    const entries = diffBaselineTrees(base, cand, out, deps2) as Array<Record<string, unknown>>;
    expect(entries.map((e) => [e.file, e.status])).toEqual([
      [rel('Button', 'default'), 'changed'], [rel('Button', 'hover'), 'unchanged'], [rel('Dialog', 'open', c2), 'new'], [rel('Old', 'default'), 'removed'],
    ]);
    const ch = entries[0]!;
    expect(ch).toMatchObject({ diffPixels: 300, allowedDiffPixels: 20, subject: 'Button', state: 'default' });
    for (const k of ['base', 'candidate', 'diff']) expect(existsSync(join(out, ch[k] as string))).toBe(true);
    expect(entries[1]).toMatchObject({ diffPixels: 10 });
    expect(entries[1]!.base).toBeUndefined();
    const html = renderDiffReport({ sha: 'c'.repeat(40), entries, violations: [{ code: 'file-too-large', message: 'x <b>' }] }) as string;
    expect(html).toContain('new 1 · changed 1 · removed 1 · unchanged 1');
    expect(html).toContain(`src="${ch.diff as string}"`);
    expect(html).toContain('x &lt;b&gt;');
    expect(html).not.toContain(rel('Button', 'hover')); // unchanged files are not listed
    expect(html).toMatch(/<html lang="en">/);
  });
});

// ---- CI wiring -----------------------------------------------------------------------------------------------------
describe('ci/qual.gitlab-ci.yml', () => {
  const ci = parse(readFileSync(join(ROOT, 'ci/qual.gitlab-ci.yml'), 'utf8')) as Record<string, Record<string, unknown>>;

  test('qual:certify:baseline-refresh: manual on pr/main, scheduled nightly, AG_PLAYWRIGHT_IMAGE, artifacts with expire_in', () => {
    const job = ci['qual:certify:baseline-refresh']!;
    expect(job).toBeDefined();
    expect(job.extends).toBe('.ag-playwright');
    const rules = job.rules as Array<Record<string, string>>;
    expect(rules).toEqual([
      { if: '$AG_LINE == "5x" && $AG_SCOPE == "nightly"' },
      { if: '$AG_LINE == "5x" && ($AG_SCOPE == "pr" || $AG_SCOPE == "main")', when: 'manual' },
    ]);
    expect(job.script).toEqual(expect.arrayContaining([expect.stringMatching(/^node scripts\/qual\/baseline-refresh\.mjs /)]));
    expect(job.artifacts).toMatchObject({ when: 'always', expire_in: '30 days' });
    expect(JSON.stringify(job)).not.toMatch(/\|\| true|GITHUB_|merge_request_event/);
  });

  test('qual:certify:l7 runs the L7 lane with a merge-base Storybook at pr, main and nightly', () => {
    const job = ci['qual:certify:l7']!;
    expect(job.extends).toBe('.qual-lane');
    expect((job.variables as Record<string, string>).LANE).toBe('L7');
    expect(job.script).toEqual(expect.arrayContaining([
      expect.stringMatching(/^node scripts\/qual\/l7-base\.mjs --scope "\$AG_SCOPE"/), 'node certification/run.mjs --lane L7 --scope "$AG_SCOPE"']));
    expect((job.rules as Array<{ if: string }>)[0]!.if).toMatch(/nightly/);
    expect(JSON.stringify(job)).not.toMatch(/\|\| true|GITHUB_|merge_request_event/);
  });
});

describe('job helpers', () => {
  test('merge-base for PRs, first parent otherwise', () => {
    expect(baseRevArgs('pr')).toEqual(['merge-base', 'origin/next', 'HEAD']);
    expect(baseRevArgs('main')).toEqual(['rev-parse', 'HEAD^1']);
  });

  test('serve-static never resolves outside its root', () => {
    const root = scratch();
    writeFileSync(join(root, 'index.json'), '{}');
    mkdirSync(join(root, 'sb'));
    writeFileSync(join(root, 'sb', 'index.html'), '<!doctype html>');
    expect(resolveRequest(root, '/index.json')).toBe(join(root, 'index.json'));
    expect(resolveRequest(root, '/sb/')).toBe(join(root, 'sb', 'index.html'));
    expect(resolveRequest(root, '/../../etc/passwd')).toBeNull();
    expect(resolveRequest(root, '/%2e%2e/%2e%2e/etc/passwd')).toBeNull();
    expect(resolveRequest(root, '/missing.js')).toBeNull();
  });
});
