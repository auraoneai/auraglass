/* @jest-environment node */
/* REQ-MAT-39 (FIN-D D.3-03): the optics lint covers src/**, stories/**, tests/** and
   apps/** (stories and tests are not exempt; only this rule's own tests/lint/mat/**
   fixtures are), and scripts/mat/optics-lint.mjs ties the warnings to
   lint/rules/mat/optics-baseline.json: a new backdropFilter fails the ratchet.
   The CLI runs in a child process against a throwaway root using the repo's
   eslint.config.js, so the assertions exercise the real agConfig wiring. */
import { afterAll, describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const REPO = resolve(__dirname, '../../..');
const CLI = join(REPO, 'scripts/mat/optics-lint.mjs');
const TMP = mkdtempSync(join(tmpdir(), 'ag-optics-lint-'));
afterAll(() => rmSync(TMP, { recursive: true, force: true }));

const STORY_WITH_OPTICS = 'export const S = { args: { style: { backdropFilter: "blur(2px)" } } };\n';
const CLEAN = 'export const x = { padding: 8 };\n';

let n = 0;
const makeRoot = (files: Record<string, string>, baseline: object) => {
  const root = join(TMP, `root-${n++}`);
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), text);
  }
  writeFileSync(join(root, 'baseline.json'), JSON.stringify(baseline));
  return root;
};

const run = (root: string, extra: string[] = []) => {
  const r = spawnSync(process.execPath, [CLI, '--root', root, '--baseline', join(root, 'baseline.json'), ...extra], {
    encoding: 'utf8',
    cwd: REPO,
  });
  return { code: r.status, out: r.stdout, err: r.stderr };
};

const EMPTY = { maxWarnings: 0, files: {} };

describe('auraglass/no-optics-outside-material coverage and ratchet', () => {
  it('a new backdropFilter in a stories/ file fails the ratchet', () => {
    const root = makeRoot({ 'stories/mat/New.stories.tsx': STORY_WITH_OPTICS }, EMPTY);
    const r = run(root);
    expect(r.code).toBe(1);
    // the backdropFilter key and the blur() literal are both reported
    expect(r.err).toContain('ratchet regression: stories/mat/New.stories.tsx: 2 > baseline 0');
    expect(r.err).toContain('ratchet regression: total 2 > maxWarnings 0');
  });

  it.each([
    'src/components/Card/Card.tsx',
    'tests/components/card.test.tsx',
    'apps/docs/app/page.tsx',
  ])('%s is linted (not exempt)', (rel) => {
    const r = run(makeRoot({ [rel]: STORY_WITH_OPTICS }, EMPTY));
    expect(r.code).toBe(1);
    expect(r.err).toContain(`${rel}: 2 > baseline 0`);
  });

  it('src/material/** and tests/lint/mat/** are exempt; clean files pass', () => {
    const r = run(makeRoot({
      'src/material/Surface.tsx': STORY_WITH_OPTICS,
      'tests/lint/mat/fixture.ts': STORY_WITH_OPTICS,
      'stories/Clean.stories.tsx': CLEAN,
    }, EMPTY));
    expect(r.code).toBe(0);
    expect(r.out).toContain('optics-lint-findings: 0 in 0 files');
    expect(r.out).toContain('ratchet OK (0 <= 0)');
  });

  it('passes at the baseline and fails when a baselined file gains a finding', () => {
    const at = run(makeRoot({ 'stories/Old.stories.tsx': STORY_WITH_OPTICS },
      { maxWarnings: 2, files: { 'stories/Old.stories.tsx': 2 } }));
    expect(at.code).toBe(0);

    const over = run(makeRoot({
      'stories/Old.stories.tsx': `${STORY_WITH_OPTICS}export const T = "saturate(1.4)";\n`,
    }, { maxWarnings: 3, files: { 'stories/Old.stories.tsx': 2 } }));
    expect(over.code).toBe(1);
    expect(over.err).toContain('stories/Old.stories.tsx: 3 > baseline 2');
  });

  it('--update records the measured counts', () => {
    const root = makeRoot({ 'stories/A.stories.tsx': STORY_WITH_OPTICS, 'tests/b.test.ts': CLEAN }, EMPTY);
    expect(run(root, ['--update']).code).toBe(0);
    const recorded = JSON.parse(readFileSync(join(root, 'baseline.json'), 'utf8'));
    expect(recorded).toMatchObject({
      rule: 'auraglass/no-optics-outside-material',
      mode: 'ratchet',
      maxWarnings: 2,
      files: { 'stories/A.stories.tsx': 2 },
    });
    expect(run(root).code).toBe(0);
  });
});
