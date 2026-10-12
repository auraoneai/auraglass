/** @jest-environment node */
/* tests/perf/qual/grade.test.mjs — REQ-QUAL-37 PRD-named test location. The grade boundaries and the
   release gate are covered by packages/qa/test/grade.test.ts; this file pins the PRD-named CLI
   (tests/perf/harness/grade.mjs) to the implementation the certify jobs run
   (scripts/qual/perf/grade.mjs), including direct CLI invocation failing closed without results. */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from '@jest/globals';
import * as harnessGrade from '../harness/grade.mjs';
import * as implGrade from '../../../scripts/qual/perf/grade.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const HARNESS_GRADE = join(ROOT, 'tests/perf/harness/grade.mjs');

describe('tests/perf/harness/grade.mjs (REQ-QUAL-37)', () => {
  it('re-exports the implementation the qual:certify:perf-grade job runs', () => {
    expect(harnessGrade.gradeCli).toBe(implGrade.gradeCli);
    expect(harnessGrade.parseArgs).toBe(implGrade.parseArgs);
    expect(harnessGrade.previousTag).toBe(implGrade.previousTag);
    expect(harnessGrade.GRADE_JOB).toBe('qual:certify:perf-grade');
    expect(harnessGrade.GRADE_JOB_SLUG).toBe(implGrade.GRADE_JOB_SLUG);
  });

  it('parseArgs requires --results and defaults a release run to the previous-tag gate', () => {
    expect(() => harnessGrade.parseArgs([])).toThrow(/--results is required/);
    expect(harnessGrade.parseArgs(['--results', 'x.json', '--scope', 'release']).previous).toBe('auto');
    expect(() => harnessGrade.parseArgs(['--results', 'x.json', '--scope', 'bogus'])).toThrow(/--scope must be/);
  });

  it('previousTag picks the greatest earlier v5 tag', () => {
    expect(harnessGrade.previousTag('v5.2.0', ['v5.2.0', 'v5.1.0', 'v4.9.0', 'v5.0.1'])).toBe('v5.1.0');
    expect(harnessGrade.previousTag(null, ['v5.0.1', 'v5.1.0'])).toBe('v5.1.0');
    expect(harnessGrade.previousTag('v5.0.0', ['v5.0.0'])).toBeNull();
  });

  it('direct CLI invocation fails closed (usage 64) with no --results', () => {
    const r = spawnSync(process.execPath, [HARNESS_GRADE], { cwd: ROOT, encoding: 'utf8' });
    expect(r.status).toBe(64);
    expect(r.stdout + r.stderr).toContain('--results is required');
  });
});
