/** @jest-environment node */
/* tests/perf/qual/budgets-frozen.test.ts — REQ-QUAL-39 calibration freeze (QUAL, D-26; logic in packages/qa/src/perf/freeze.ts).

   - certification/calibration.json `sha: null` → the live comparison is pending: calibration has not happened (it happens
     once, at the first 5.0 pre-release where Button and Dialog carry no seed marker, written by
     scripts/qual/perf/record-calibration.mjs). During that window a stream may raise its own rows once with the
     `Perf-Budget-Raise:` trailer to min(provisional, ceil(measured × 1.10)) (bytes rounded up to 256).
   - sha set → loadFragments('perf-budgets') and loadFragments('size-budgets') at HEAD are compared with the merge base
     (AG_BASE_REF, default origin/next): a raised max/limitBytes, a deleted row, or a remaining `provisional: true` fails; the
     recorded sha must be seed-free for Button and Dialog. Needs no PLAT code. Registered on L12 (pr, main, release). */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import { calibrationCeiling, frozenViolations, parseCalibration, raised, type PerfRowLike, type SizeRowLike } from '../../../packages/qa/src/perf/freeze';
import { parsePerfThresholds } from '../../../packages/qa/src/perf/budgets';

const ROOT = join(__dirname, '../../..');
const calibration = parseCalibration(JSON.parse(readFileSync(join(ROOT, 'certification/calibration.json'), 'utf8')));
const perf = parsePerfThresholds(JSON.parse(readFileSync(join(ROOT, 'certification/thresholds.json'), 'utf8')));

const git = (args: string[]) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();

/** Writes fragments/<kind>/* as they are at `rev` into a scratch root, so loadFragments evaluates the merge-base rows. */
function materialize(rev: string, kinds: string[]): string {
  const dir = mkdtempSync(join(tmpdir(), 'ag-frozen-'));
  for (const kind of kinds) {
    const names = git(['ls-tree', '--name-only', `${rev}:fragments/${kind}`]).split('\n').filter(Boolean);
    for (const n of names) {
      const target = join(dir, 'fragments', kind, n);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, git(['show', `${rev}:fragments/${kind}/${n}`]));
    }
  }
  return dir;
}

/* scripts/qual/perf/freeze-inputs.mjs runs loadFragments (S-50) and the seed check in a child node process, so this file
   imports no ESM module under the lane runner's --experimental-vm-modules jest. */
const INPUTS = join(ROOT, 'scripts/qual/perf/freeze-inputs.mjs');
const inputs = <T>(flag: string, value: string): T => JSON.parse(execFileSync(process.execPath, [INPUTS, flag, value], { cwd: ROOT, encoding: 'utf8' })) as T;
type Rows = { perf: PerfRowLike[]; size: SizeRowLike[] };
const rowsAt = (root: string): Rows => inputs<Rows>('--rows', root);

describe('freeze rules (fixtures)', () => {
  const base = {
    perf: [{ subject: 'Dialog', profile: 'mid-mobile', metric: 'blurred-surfaces', max: 2, provisional: false },
      { subject: 'Button', profile: 'desktop-120hz', metric: 'grade', max: 'B', provisional: false }] as PerfRowLike[],
    size: [{ id: 'Button', import: "{ Button } from 'aura-glass'", limitBytes: 10240, kind: 'js' }] as SizeRowLike[],
  };
  it('unchanged or tightened rows pass', () => {
    expect(frozenViolations(base, base)).toEqual([]);
    const tighter = { perf: [{ ...base.perf[0], max: 1 }, { ...base.perf[1], max: 'A' }], size: [{ ...base.size[0], limitBytes: 9216 }] } as typeof base;
    expect(frozenViolations(base, tighter)).toEqual([]);
  });
  it('a raised perf max fails', () => {
    const v = frozenViolations(base, { ...base, perf: [{ ...base.perf[0], max: 3 }, base.perf[1]] } as typeof base);
    expect(v).toEqual(['perf-budgets row Dialog|mid-mobile|blurred-surfaces raised 2 → 3 after calibration']);
  });
  it('a worse grade letter fails', () => {
    expect(raised('B', 'C')).toBe(true);
    expect(raised('B', 'A')).toBe(false);
    expect(frozenViolations(base, { ...base, perf: [base.perf[0], { ...base.perf[1], max: 'C' }] } as typeof base)).toHaveLength(1);
  });
  it('a raised size limit, a deleted row and a provisional row fail', () => {
    const head = { perf: [{ ...base.perf[1], provisional: true }], size: [{ ...base.size[0], limitBytes: 10241 }] } as typeof base;
    expect(frozenViolations(base, head)).toEqual([
      'perf-budgets row Dialog|mid-mobile|blurred-surfaces (max 2) deleted after calibration',
      'perf-budgets row Button|desktop-120hz|grade is still provisional: true after calibration',
      'size-budgets row Button raised 10240 → 10241 B after calibration',
    ]);
  });
  it('the calibration window raise is min(provisional, ceil(measured × 1.10)), bytes rounded up to 256', () => {
    expect(calibrationCeiling('bytes', 10240, 9000)).toBe(9984);   // 9900 → 39 × 256
    expect(calibrationCeiling('bytes', 10240, 9500)).toBe(10240);  // 10450 capped at provisional
    expect(calibrationCeiling('perf', 25, 12)).toBe(13.2);
  });
  it('a recorded calibration needs a 40-hex sha, the pre-release tag and both lane artifact URLs', () => {
    expect(() => parseCalibration({ sha: 'abc' })).toThrow(/40-hex/);
    expect(() => parseCalibration({ sha: 'a'.repeat(40), tag: 'v5.0.0-alpha.1' })).toThrow(/evidence/);
    expect(() => parseCalibration({ sha: 'a'.repeat(40), tag: 'v5.0.0', evidence: { l10: 'https://x/1', l2: 'https://x/2' } })).toThrow(/pre-release/);
    expect(parseCalibration({ sha: 'a'.repeat(40), tag: 'v5.0.0-alpha.1', evidence: { l10: 'https://x/1', l2: 'https://x/2' } }).sha).toBe('a'.repeat(40));
  });
});

describe('fixture: calibration set + a raised max', () => {
  it('fails when the head fragment raises a max the merge base had', () => {
    const baseRoot = mkdtempSync(join(tmpdir(), 'ag-frozen-base-'));
    const headRoot = mkdtempSync(join(tmpdir(), 'ag-frozen-head-'));
    const row = { subject: 'Dialog', profile: 'desktop-120hz', metric: 'frame-p95-ms', max: 12, provisional: false };
    for (const [root, max] of [[baseRoot, 12], [headRoot, 14]] as const) {
      mkdirSync(join(root, 'fragments/perf-budgets'), { recursive: true });
      mkdirSync(join(root, 'fragments/size-budgets'), { recursive: true });
      writeFileSync(join(root, 'fragments/perf-budgets/cmp.json'), JSON.stringify([{ ...row, max }]));
      writeFileSync(join(root, 'fragments/size-budgets/cmp.json'), '[]');
    }
    expect(frozenViolations(rowsAt(baseRoot), rowsAt(headRoot))).toEqual(['perf-budgets row Dialog|desktop-120hz|frame-p95-ms raised 12 → 14 after calibration']);
  });
});

describe('budgets frozen at the calibration sha', () => {
  if (calibration.sha === null) {
    it('pending: calibration.json sha is null — no pre-release has calibrated yet (Perf-Budget-Raise window open)', () => {
      expect(calibration.sha).toBeNull();
      expect(perf.calibration.seedFreeSubjects).toEqual(['Button', 'Dialog']);
      expect(perf.calibration.marker).toBe('perf-budget-raise');
    });
  } else {
    describeFrozen(calibration.sha);
  }
});

function describeFrozen(sha: string): void {
  it(`Button and Dialog carried no seed marker at the calibration sha ${sha.slice(0, 12)}`, () => {
    const r = inputs<{ dirs: string[]; markers: string[] }>('--seed-check', sha);
    expect(r.dirs).toHaveLength(perf.calibration.seedFreeSubjects.length);
    expect(r.markers).toEqual([]);
  });
  it('no fragment row raises a max, is deleted, or stays provisional vs the merge base', () => {
    const baseRef = process.env.AG_BASE_REF ?? 'origin/next';
    const mergeBase = git(['merge-base', baseRef, 'HEAD']);
    const baseRoot = materialize(mergeBase, ['perf-budgets', 'size-budgets']);
    expect(frozenViolations(rowsAt(baseRoot), rowsAt(ROOT))).toEqual([]);
  });
}
