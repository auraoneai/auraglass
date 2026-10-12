/* REQ-QUAL-64 CI fragment (and the REQ-QUAL-06 rules it carries): ci/qual.gitlab-ci.yml parsed with `yaml`.
   Complements PLAT's contract:ci-fragments (scripts/ci/verify-ci-fragments.mjs), which this test also runs. */
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'yaml';
import { CERT_JOBS, CI_JOBS, LANE_COMMAND } from '../../../src/contracts/testing.ts';
import { REPO } from './helpers/laneFixture.ts';

type Job = Record<string, unknown> & { extends?: string | string[]; rules?: Array<Record<string, unknown>>; needs?: unknown[]; script?: string[]; allow_failure?: unknown };

const text = readFileSync(join(REPO, 'ci/qual.gitlab-ci.yml'), 'utf8');
const doc = yaml.parse(text) as Record<string, Job>;
const root = yaml.parse(readFileSync(join(REPO, '.gitlab-ci.yml'), 'utf8')) as Record<string, Job>;
const jobs = Object.keys(doc).filter((k) => !k.startsWith('.'));
const ROOT_TEMPLATES = ['.ag-node', '.ag-playwright', '.ag-gpu', '.ag-aws-remote'];
const QUAL_ONLY = ['qual:test:selftest', 'qual:test:story-contract', 'qual:certify:l10-gpu', 'qual:certify:baseline-refresh', 'qual:certify:review-record',
  'qual:certify:known-failures', 'qual:certify:release-matrix', 'qual:certify:devices'];
const TESSERACT_INSTALL = 'command -v tesseract >/dev/null || (apt-get update -qq && apt-get install -y -qq --no-install-recommends tesseract-ocr tesseract-ocr-eng)';

const parents = (name: string): string[] => {
  const d = doc[name] ?? root[name];
  if (!d?.extends) return [];
  return ([] as string[]).concat(d.extends).flatMap((p) => [p, ...parents(p)]);
};
/** Effective scalar with GitLab extends semantics (own value, then parents in reverse order: the last listed wins). */
function eff(name: string, key: string): unknown {
  const d = doc[name] ?? root[name];
  if (!d) return undefined;
  if (key in d) return d[key];
  for (const p of ([] as string[]).concat(d.extends ?? []).reverse()) { const v = eff(p, key); if (v !== undefined) return v; }
  return undefined;
}

describe('ci/qual.gitlab-ci.yml', () => {
  it('contains only qual:<stage>:<name> jobs and .qual-* templates', () => {
    for (const k of Object.keys(doc)) expect(k).toMatch(/^(\.qual-[a-z-]+|qual:(build|test|certify):[a-z0-9-]+)$/);
  });

  it('defines every CERT_JOBS lane and every CI_JOBS.qual name as a YAML key', () => {
    expect(CERT_JOBS).toHaveLength(12);
    for (const j of [...CERT_JOBS, ...CI_JOBS.qual]) expect(jobs).toContain(j);
    expect(jobs.filter((j) => /^qual:certify:l(1[0-2]|[1-9])$/.test(j))).toHaveLength(12);
    expect(text.match(/^qual:certify:l(1[0-2]|[1-9]):/gm)).toHaveLength(12);
  });

  it.each(CERT_JOBS.map((j, i) => [j, i + 1] as const))('%s runs exactly LANE_COMMAND for L%i', (job, n) => {
    const script = eff(job, 'script') as string[];
    expect(script).toContain(LANE_COMMAND.replace('<id>', `L${n}`));
    expect(script.filter((l) => l.includes('certification/run.mjs') && !l.includes('--line 4x'))).toHaveLength(1);
    // REQ-QUAL-33: L2/L3/L11 also run the 4.x tarballs at main scope, before LANE_COMMAND; no other lane runs 4.x
    const v4 = script.filter((l) => l.includes('--line 4x'));
    if ([2, 3, 11].includes(n)) {
      expect(v4).toEqual([`if [ "$AG_SCOPE" = "main" ]; then node certification/run.mjs --lane L${n} --scope main --line 4x; fi`]);
      expect(script.indexOf(v4[0]!)).toBeLessThan(script.indexOf(LANE_COMMAND.replace('<id>', `L${n}`)));
    } else expect(v4).toEqual([]);
  });

  it('qual:certify:nightly runs L2/L3/L11 against the 4.x tarballs before the nightly matrix (REQ-QUAL-33)', () => {
    const script = eff('qual:certify:nightly', 'script') as string[];
    const v4 = script.indexOf('node certification/run.mjs --lane all --scope nightly --line 4x');
    expect(v4).toBeGreaterThanOrEqual(0);
    expect(v4).toBeLessThan(script.indexOf('node certification/run.mjs --lane all --scope nightly'));
  });

  it('runs L1–L4 and L12 on .ag-node and the browser lanes L5–L11 on .ag-playwright', () => {
    for (const n of [1, 2, 3, 4, 12]) {
      expect(parents(`qual:certify:l${n}`)).toContain('.ag-node');
      expect(parents(`qual:certify:l${n}`)).not.toContain('.ag-playwright');
    }
    for (const n of [5, 6, 7, 8, 9, 10, 11]) expect(parents(`qual:certify:l${n}`)).toContain('.ag-playwright');
  });

  it('installs tesseract 5 in every L6 capture job so ocr-contrast certifies instead of staying pending (REQ-QUAL-13)', () => {
    for (const j of ['qual:certify:l6', 'qual:certify:nightly', 'qual:certify:release']) {
      const script = eff(j, 'script') as string[];
      expect([j, script]).toEqual([j, expect.arrayContaining([TESSERACT_INSTALL, 'tesseract --version'])]);
      expect(script.indexOf(TESSERACT_INSTALL)).toBeLessThan(script.findIndex((l) => l.includes('certification/run.mjs')));
    }
    // the generated release shards copy the effective qual:certify:l6 script (shard-plan childPipeline),
    // so the shard template needs no tesseract line of its own — asserted in shard-plan.test.ts.
  });

  it('fetches both Node lines before the L2 lane run (REQ-QUAL-47)', () => {
    const script = eff('qual:certify:l2', 'script') as string[];
    const fetchNode = 'eval "$(node scripts/qual/fetch-node.mjs 20.19.0 22)"';
    expect(script).toContain(fetchNode);
    expect(script.indexOf(fetchNode)).toBeLessThan(script.indexOf(LANE_COMMAND.replace('<id>', 'L2')));
  });

  it('runs the perf profiles at nightly and release so perf-grade has (a)/(b) inputs there (REQ-QUAL-37)', () => {
    for (const j of ['qual:certify:l10', 'qual:certify:l10-gpu']) {
      const rules = JSON.stringify(eff(j, 'rules') ?? []);
      for (const scope of ['nightly', 'release']) expect([j, scope, rules.includes(`$AG_SCOPE == \\"${scope}\\"`)]).toEqual([j, scope, true]);
    }
    const gradeRules = JSON.stringify(eff('qual:certify:perf-grade', 'rules') ?? []);
    for (const scope of ['main', 'nightly', 'release']) expect(gradeRules).toContain(`$AG_SCOPE == \\"${scope}\\"`);
    expect(doc['qual:certify:perf-grade']!.needs).toEqual(expect.arrayContaining([
      { job: 'qual:certify:l10', artifacts: true, optional: true },
      { job: 'qual:certify:l10-gpu', artifacts: true, optional: true },
    ]));
  });

  it('runs the story gates as their own job (REQ-QUAL-50)', () => {
    expect(eff('qual:test:story-contract', 'script')).toEqual(expect.arrayContaining(['node scripts/storybook/story-contract.mjs']));
    expect(parents('qual:test:story-contract')).toContain('.ag-node');
    // starts allow_failure: true like every job (activation rule); the flip to blocking is its
    // ci/plat/activation.json row after the first green run, independent of qual:build:storybook.
    expect(eff('qual:test:story-contract', 'allow_failure')).toBe(true);
  });

  it('adds the QUAL-only jobs on their runners', () => {
    for (const j of QUAL_ONLY) expect(jobs).toContain(j);
    expect(parents('qual:certify:l10-gpu')).toContain('.ag-gpu');
    expect(parents('qual:certify:devices')).toContain('.ag-aws-remote');
    // REQ-QUAL-65: the dynamic child pipeline from the release plan's artifact; strategy: depend mirrors the child's status
    expect(doc['qual:certify:release-matrix']).toMatchObject({
      stage: 'certify',
      needs: [{ job: 'qual:certify:release-plan', artifacts: true }],
      variables: { PARENT_PIPELINE_ID: '$CI_PIPELINE_ID' },
      trigger: { include: [{ artifact: '.artifacts/qual/qual-certify-release-plan/shards.gitlab-ci.yml', job: 'qual:certify:release-plan' }], strategy: 'depend' },
    });
    expect(Object.keys(doc['qual:certify:release-matrix']!).sort()).toEqual(['needs', 'rules', 'stage', 'trigger', 'variables']);
    expect(eff('qual:certify:release-matrix', 'allow_failure')).toBeUndefined();
    expect(eff('qual:test:selftest', 'script')).toEqual(expect.arrayContaining(['node node_modules/jest/bin/jest.js -c jest.qual.config.js --ci']));
    expect(doc['qual:certify:review-record']!.rules!.every((r) => r.when === 'manual')).toBe(true);
    // REQ-QUAL-25 (G-14): baseline-refresh is "manual or scheduled": manual on pr/main, automatic only on the nightly schedule.
    expect(doc['qual:certify:baseline-refresh']!.rules!.every((r) => r.when === 'manual'
      || /^\$AG_LINE == "5x" && \$AG_SCOPE == "nightly"$/.test(String(r.if)))).toBe(true);
    expect(JSON.stringify(eff('qual:certify:known-failures', 'rules'))).toContain('$AG_SCOPE == \\"nightly\\"');
  });

  it('every job extends a root template (the trigger job: none, see contract:ci-fragments bridge exemption), has rules on $AG_SCOPE and $AG_LINE == "5x"', () => {
    for (const j of jobs) {
      expect([j, parents(j).some((p) => ROOT_TEMPLATES.includes(p))]).toEqual([j, !('trigger' in doc[j]!)]);
      const rules = JSON.stringify(eff(j, 'rules') ?? []);
      expect([j, /\$AG_SCOPE/.test(rules), /\$AG_LINE == \\"5x\\"/.test(rules)]).toEqual([j, j === 'qual:build:storybook' ? false : true, true]);
    }
  });

  it('cross-stream needs name only CI_JOBS entries with optional: true; no cross-stream dependencies', () => {
    const foreign = Object.entries(CI_JOBS).filter(([s]) => s !== 'qual').flatMap(([, v]) => v as readonly string[]);
    for (const [name, def] of Object.entries(doc)) {
      for (const n of (def.needs ?? []) as Array<string | { job: string; optional?: boolean }>) {
        const job = typeof n === 'string' ? n : n.job;
        if (job.startsWith('qual:')) continue;
        expect([name, job, foreign.includes(job), typeof n === 'object' && n.optional === true]).toEqual([name, job, true, true]);
      }
      expect([name, def.dependencies]).toEqual([name, undefined]);
    }
    expect(doc['.qual-tarball-lane']!.needs).toEqual(expect.arrayContaining([{ job: 'plat:package:pack', artifacts: true, optional: true }]));
  });

  it('starts every job allow_failure: true (activation rule) except qual:certify:release, which never allows failure', () => {
    for (const j of [...CERT_JOBS, 'qual:build:storybook', 'qual:certify:nightly', 'qual:test:selftest', 'qual:certify:known-failures']) {
      expect([j, eff(j, 'allow_failure')]).toEqual([j, true]);
    }
    // REQ-QUAL-64: every other job too — by allow_failure: true on the job (or a template), on every rule, or by every
    // rule being `when: manual` (GitLab's manual default); only the three release-gating jobs never allow failure.
    const RELEASE_GATING = ['qual:certify:release-plan', 'qual:certify:release-matrix', 'qual:certify:release'];
    for (const j of jobs.filter((x) => !RELEASE_GATING.includes(x))) {
      const rules = (eff(j, 'rules') ?? []) as Array<Record<string, unknown>>;
      const starts = eff(j, 'allow_failure') === true || (rules.length > 0 && rules.every((r) => r.allow_failure === true || (r.when === 'manual' && r.allow_failure !== false)));
      expect([j, starts]).toEqual([j, true]);
    }
    for (const j of RELEASE_GATING) {
      expect([j, eff(j, 'allow_failure')]).toEqual([j, undefined]);
      expect(JSON.stringify(eff(j, 'rules'))).not.toContain('allow_failure');
    }
    expect(eff('qual:certify:release', 'allow_failure')).toBeUndefined();
    expect(parents('qual:certify:release').some((p) => 'allow_failure' in (doc[p] ?? root[p] ?? {}))).toBe(false);
    expect(JSON.stringify(doc['qual:certify:release']!.rules)).not.toContain('allow_failure');
  });

  it('has no fail-opens, credentials or GitHub machinery', () => {
    expect(text).not.toMatch(/\|\|\s*(true\b|echo\b|:(\s|$))/m);
    expect(text).not.toMatch(/2>\/dev\/null/);
    expect(text).not.toMatch(/GITHUB_|\bgh\s|actions\/|CI_JOB_JWT|merge_request_event|secrets\.|NPM_TOKEN|NODE_AUTH_TOKEN/);
    expect(text).not.toMatch(/--maxWorkers[= ](1[7-9]|[2-9]\d)|workers:\s*(1[7-9]|[2-9]\d)/);
  });

  it('passes PLAT contract:ci-fragments', () => {
    const r = spawnSync(process.execPath, ['scripts/ci/verify-ci-fragments.mjs', '--files', 'ci/qual.gitlab-ci.yml'], { cwd: REPO, encoding: 'utf8' });
    expect([r.status, r.stdout.trim()]).toEqual([0, 'contract:ci-fragments OK']);
  });
});
