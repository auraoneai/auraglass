/* @jest-environment node */
// REQ-FIN-110 / REQ-QUAL-72 (FIN-H H3-4): tests/a11y/manual/aggregate.mjs joins
// SrRecords against the matrix and writes the a11y-manual-<sha>.json summary
// FIN-G's ReleaseVerdict (REQ-FIN-103) consumes. Fixtures are built per test in
// a temp dir (never under records/, which holds tester-produced SrRecords only):
// a synthetic template that meets every minimum, and records for its rows.
import { afterEach, describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const SCRIPT = 'tests/a11y/manual/aggregate.mjs';
const SHA = '0123456789abcdef0123456789abcdef01234567';
const OTHER = 'fedcba9876543210fedcba9876543210fedcba98';
const SR_AT = ['voiceover-macos', 'voiceover-ios', 'nvda-chrome', 'talkback-chrome'];
const TOUCH_AT = ['touch-ios', 'touch-android'];
// Real AI subjects (src/ai/**/*.meta.ts, entry './ai'): the aggregator reads the
// AI set from the metas, so the fixture must use their ids.
const AI = ['thread', 'message', 'composer'];

type Stream = 'mat' | 'cmp' | 'surf';
type Pass = 'sr' | 'touch' | 'motion';
interface Row {
  subject: string; stream: Stream; flagship: number | null; pass: Pass; at: string;
  record: string; script: string; required: true;
}

function rowsFor(subject: string, stream: Stream, flagship: number | null): Row[] {
  const mk = (pass: Pass, at: string): Row => ({
    subject, stream, flagship, pass, at, required: true,
    script: `tests/a11y/manual/scripts/${stream}/${subject}.md`,
    record: `tests/a11y/manual/records/${stream}/${subject}-${at}${pass === 'motion' ? '-motion' : ''}.json`,
  });
  return [...SR_AT.map((at) => mk('sr', at)), ...TOUCH_AT.map((at) => mk('touch', at))];
}

/** 44 flagships (20 CMP, 24 SURF incl. 3 AI), 2 MAT subjects, 5 motion subjects x 4 SR ATs. */
function fixtureTemplate() {
  const rows: Row[] = [];
  for (let n = 1; n <= 44; n++) {
    if (n <= 20) rows.push(...rowsFor(`cmp-flagship-${n}`, 'cmp', n));
    else if (n <= 23) rows.push(...rowsFor(AI[n - 21], 'surf', n));
    else rows.push(...rowsFor(`surf-flagship-${n}`, 'surf', n));
  }
  rows.push(...rowsFor('surface-material-lab', 'mat', null), ...rowsFor('glass-preferences-panel', 'mat', null));
  for (let n = 1; n <= 5; n++) {
    for (const at of SR_AT) {
      const subject = `cmp-flagship-${n}`;
      rows.push({
        subject, stream: 'mat', flagship: n, pass: 'motion', at, required: true,
        script: 'tests/a11y/manual/scripts/mat/reduced-motion-pass.md',
        record: `tests/a11y/manual/records/mat/${subject}-${at}-motion.json`,
      });
    }
  }
  return { version: 1, rows };
}

function recordFor(row: Row, over: Record<string, unknown> = {}) {
  const touch = row.pass === 'touch';
  const mobile = touch || row.at === 'voiceover-ios' || row.at === 'talkback-chrome';
  return {
    sha: SHA, subject: row.subject, flagship: row.flagship, stream: row.stream, pass: row.pass, at: row.at,
    atVersion: touch ? 'none' : 'fixture AT 1.0', browser: 'Fixture', browserVersion: '1',
    os: 'FixtureOS', osVersion: '1', ...(mobile ? { device: 'fixture phone' } : {}),
    tester: 'fixture-tester', date: '2026-10-10', result: 'pass',
    steps: [{
      action: 'Tab to the control', expected: 'Name, role and state announced', announced: 'Name, button', pass: true,
      ...(touch ? { gesture: 'single tap', nonDragAlternative: 'tap the control' } : {}),
    }],
    storybookArtifactUrl: 'https://gitlab.com/example/-/jobs/1/artifacts/storybook-static/index.html',
    ...over,
  };
}

const dirs: string[] = [];
afterEach(() => { for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true }); });

/** Writes the fixture template plus one record per row (minus `skip`, with `edit` overrides). */
function setup({ skip = [] as string[], edit = {} as Record<string, Record<string, unknown>> } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'sr-aggregate-'));
  dirs.push(dir);
  const template = fixtureTemplate();
  const templatePath = join(dir, 'template.json');
  writeFileSync(templatePath, JSON.stringify(template));
  const records = join(dir, 'records');
  for (const row of template.rows) {
    const rel = row.record.replace('tests/a11y/manual/records/', '');
    if (skip.includes(rel)) continue;
    const file = join(records, rel);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(recordFor(row, edit[rel])));
  }
  return { dir, templatePath, records, out: join(dir, 'out.json'), rows: template.rows.length };
}

function run(...args: string[]) {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
  return { code: r.status ?? -1, out: r.stdout, err: r.stderr };
}

function aggregate(f: ReturnType<typeof setup>, sha = SHA) {
  const r = run('--sha', sha, '--records', f.records, '--template', f.templatePath, '--out', f.out);
  return { ...r, summary: JSON.parse(readFileSync(f.out, 'utf8')) };
}

describe('aggregate.mjs', () => {
  it('complete passing record set: verdict pass, exit 0, full output shape', () => {
    const f = setup();
    const { code, err, summary } = aggregate(f);
    expect(err).toBe('');
    expect(code).toBe(0);
    expect(summary).toMatchObject({
      sha: SHA, required: f.rows, recorded: f.rows, passed: f.rows, failed: 0,
      missing: [], failures: [], invalid: [], excluded: [], verdict: 'pass',
    });
    expect(Number.isNaN(Date.parse(summary.generatedAt))).toBe(false);
    expect(summary.byStream).toEqual({
      mat: { required: 32, recorded: 32, passed: 32, failed: 0, missing: 0 },
      cmp: { required: 120, recorded: 120, passed: 120, failed: 0, missing: 0 },
      surf: { required: 144, recorded: 144, passed: 144, failed: 0, missing: 0 },
    });
    expect(summary.byPass).toEqual({
      sr: { required: 184, recorded: 184, passed: 184, failed: 0, missing: 0 },
      touch: { required: 92, recorded: 92, passed: 92, failed: 0, missing: 0 },
      motion: { required: 20, recorded: 20, passed: 20, failed: 0, missing: 0 },
    });
    expect(summary.minimums.map((m: { id: string; ok: boolean }) => [m.id, m.ok])).toEqual([
      ['flagships', true], ['mat', true], ['surf-flagships', true], ['ai', true], ['motion', true],
    ]);
    expect(summary.minimums.find((m: { id: string }) => m.id === 'ai').have.subjects).toEqual([...AI].sort());
  });

  it('one failing record: verdict fail, exit 1, failed 1 with the failing steps', () => {
    const rel = 'surf/thread-nvda-chrome.json';
    const f = setup({
      edit: {
        [rel]: {
          result: 'fail', notes: 'aria-busy announced twice',
          steps: [
            { action: 'Tab to the log', expected: 'Conversation, log', announced: 'Conversation, log', pass: true },
            { action: 'Send a message', expected: 'Reply announced once', announced: 'Reply announced twice', pass: false },
          ],
        },
      },
    });
    const { code, summary, err } = aggregate(f);
    expect(code).toBe(1);
    expect(summary.verdict).toBe('fail');
    expect(summary.failed).toBe(1);
    expect(summary.passed).toBe(f.rows - 1);
    expect(summary.failures).toEqual([{
      subject: 'thread', stream: 'surf', flagship: 21, pass: 'sr', at: 'nvda-chrome', record: rel,
      tester: 'fixture-tester', date: '2026-10-10', notes: 'aria-busy announced twice',
      failedSteps: [{ step: 2, action: 'Send a message', expected: 'Reply announced once', announced: 'Reply announced twice' }],
    }]);
    expect(summary.byStream.surf.failed).toBe(1);
    expect(summary.byPass.sr.failed).toBe(1);
    expect(err).toContain(`FAIL ${rel}`);
  });

  it('one missing row: verdict incomplete, exit 1, row listed in missing[]', () => {
    const rel = 'cmp/cmp-flagship-7-touch-android.json';
    const f = setup({ skip: [rel] });
    const { code, summary } = aggregate(f);
    expect(code).toBe(1);
    expect(summary.verdict).toBe('incomplete');
    expect(summary.recorded).toBe(f.rows - 1);
    expect(summary.failed).toBe(0);
    expect(summary.missing).toEqual([{
      subject: 'cmp-flagship-7', stream: 'cmp', flagship: 7, pass: 'touch', at: 'touch-android',
      record: `tests/a11y/manual/records/${rel}`, script: 'tests/a11y/manual/scripts/cmp/cmp-flagship-7.md',
    }]);
    expect(summary.byPass.touch.missing).toBe(1);
    // touch on the other device still gives flagship 7 its 5 passes: the floor holds, the row does not
    expect(summary.minimums.every((m: { ok: boolean }) => m.ok)).toBe(true);
  });

  it('record on another SHA is excluded and counted as missing', () => {
    const rel = 'mat/surface-material-lab-voiceover-macos.json';
    const f = setup({ edit: { [rel]: { sha: OTHER } } });
    const { code, summary } = aggregate(f);
    expect(code).toBe(1);
    expect(summary.verdict).toBe('incomplete');
    expect(summary.excluded).toEqual([{ record: rel, reason: `sha ${OTHER} != ${SHA}` }]);
    expect(summary.missing.map((m: { record: string }) => m.record)).toEqual([`tests/a11y/manual/records/${rel}`]);
    expect(summary.invalid).toEqual([]);
  });

  it('every record bound to another SHA: nothing counts, all rows missing', () => {
    const f = setup();
    const { code, summary } = aggregate(f, OTHER);
    expect(code).toBe(1);
    expect(summary.verdict).toBe('incomplete');
    expect(summary.recorded).toBe(0);
    expect(summary.missing).toHaveLength(f.rows);
    expect(summary.excluded).toHaveLength(f.rows);
    expect(summary.minimums.every((m: { ok: boolean }) => !m.ok)).toBe(true);
  });

  it('schema-invalid, misplaced and unmatched records make the verdict fail', () => {
    const bad = 'cmp/cmp-flagship-1-nvda-chrome.json';
    const f = setup({ edit: { [bad]: { at: 'jaws' } } });
    mkdirSync(join(f.records, 'surf'), { recursive: true });
    writeFileSync(join(f.records, 'surf', 'not-in-matrix-voiceover-macos.json'),
      JSON.stringify(recordFor({ ...fixtureTemplate().rows[0], subject: 'not-in-matrix', stream: 'surf', flagship: null })));
    const { code, summary } = aggregate(f);
    expect(code).toBe(1);
    expect(summary.verdict).toBe('fail');
    const byRecord = Object.fromEntries(summary.invalid.map((i: { record: string; errors: string[] }) => [i.record, i.errors.join('\n')]));
    expect(byRecord[bad]).toMatch(/\/at: "jaws" not in voiceover-macos\|/);
    expect(byRecord[bad]).toContain('must be at <records>/cmp/cmp-flagship-1-jaws.json');
    expect(byRecord['surf/not-in-matrix-voiceover-macos.json']).toContain('no required template row');
    // the invalid record does not fill its row
    expect(summary.missing.map((m: { record: string }) => m.record)).toContain(`tests/a11y/manual/records/${bad}`);
  });

  it('a short template cannot pass: the minimums hold even when every row passes', () => {
    const f = setup();
    const t = fixtureTemplate();
    const short = { ...t, rows: t.rows.filter((r) => r.flagship !== 44 && r.stream !== 'mat') };
    writeFileSync(f.templatePath, JSON.stringify(short));
    rmSync(join(f.records, 'mat'), { recursive: true, force: true });
    rmSync(join(f.records, 'surf'), { recursive: true, force: true });
    mkdirSync(join(f.records, 'surf'));
    for (const r of short.rows.filter((x) => x.stream === 'surf')) {
      writeFileSync(join(f.records, r.record.replace('tests/a11y/manual/records/', '')), JSON.stringify(recordFor(r)));
    }
    const { code, summary } = aggregate(f);
    expect(summary.missing).toEqual([]);
    expect(summary.failed).toBe(0);
    expect(code).toBe(1);
    expect(summary.verdict).toBe('incomplete');
    const m = Object.fromEntries(summary.minimums.map((x: { id: string; ok: boolean; have: unknown }) => [x.id, x]));
    expect(m.flagships.ok).toBe(false);
    expect(m.flagships.have.uncovered).toEqual([44]);
    expect(m.mat.ok).toBe(false);
    expect(m.motion.ok).toBe(false);
    expect(m['surf-flagships'].ok).toBe(false);
    expect(m.ai.ok).toBe(true);
  });

  it('the generated sr-matrix.template.json with no records is incomplete, every row missing', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sr-aggregate-real-'));
    dirs.push(dir);
    const out = join(dir, 'out.json');
    const r = run('--sha', SHA, '--records', dir, '--out', out);
    const summary = JSON.parse(readFileSync(out, 'utf8'));
    const template = JSON.parse(readFileSync('tests/a11y/manual/sr-matrix.template.json', 'utf8'));
    expect(r.code).toBe(1);
    expect(summary.verdict).toBe('incomplete');
    expect(summary.template).toBe('tests/a11y/manual/sr-matrix.template.json');
    expect(summary.required).toBe(template.rows.length);
    expect(summary.missing).toHaveLength(template.rows.length);
    // flagship numbers with no meta (template.missingFlagships) can never be covered
    const uncovered = summary.minimums.find((m: { id: string }) => m.id === 'flagships').have.uncovered;
    for (const n of template.missingFlagships) expect(uncovered).toContain(n);
  });

  it('usage errors exit 64 and write nothing', () => {
    expect(run().code).toBe(64);
    expect(run('--sha').code).toBe(64);
    expect(run('--sha', '--records', 'x').code).toBe(64);
    expect(run('--sha', 'not-a-sha').code).toBe(64);
    expect(run('--sha', SHA, '--bogus', 'x').code).toBe(64);
    const missingDir = run('--sha', SHA, '--records', join(tmpdir(), 'sr-aggregate-does-not-exist'));
    expect(missingDir.code).toBe(64);
    expect(missingDir.err).toContain('does not exist');
  });

  it('defaults --out to .artifacts/qual/a11y-manual-<sha>.json under the cwd', () => {
    const f = setup();
    const r = spawnSync(process.execPath, [join(process.cwd(), SCRIPT), '--sha', SHA, '--records', f.records, '--template', f.templatePath],
      { encoding: 'utf8', cwd: f.dir });
    expect(r.status).toBe(0);
    const summary = JSON.parse(readFileSync(join(f.dir, '.artifacts', 'qual', `a11y-manual-${SHA}.json`), 'utf8'));
    expect(summary.verdict).toBe('pass');
  });
});
