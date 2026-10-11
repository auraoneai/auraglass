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
const QUAL_ONLY = ['qual:test:selftest', 'qual:certify:l10-gpu', 'qual:certify:baseline-refresh', 'qual:certify:review-record',
  'qual:certify:known-failures', 'qual:certify:release-matrix', 'qual:certify:devices'];

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
    expect(script.filter((l) => l.includes('certification/run.mjs'))).toHaveLength(1);
  });

  it('runs L1–L4 and L12 on .ag-node and the browser lanes L5–L11 on .ag-playwright', () => {
    for (const n of [1, 2, 3, 4, 12]) {
      expect(parents(`qual:certify:l${n}`)).toContain('.ag-node');
      expect(parents(`qual:certify:l${n}`)).not.toContain('.ag-playwright');
    }
    for (const n of [5, 6, 7, 8, 9, 10, 11]) expect(parents(`qual:certify:l${n}`)).toContain('.ag-playwright');
  });

  it('adds the seven QUAL-only jobs on their runners', () => {
    for (const j of QUAL_ONLY) expect(jobs).toContain(j);
    expect(parents('qual:certify:l10-gpu')).toContain('.ag-gpu');
    expect(parents('qual:certify:devices')).toContain('.ag-aws-remote');
    // dynamic child trigger is G-04's + a FIN-B bridge-job exemption; until then the job fails closed at release
    expect(eff('qual:certify:release-matrix', 'script')).toEqual(expect.arrayContaining([expect.stringContaining('scripts/qual/shard-plan.mjs')]));
    expect(eff('qual:certify:release-matrix', 'allow_failure')).toBeUndefined();
    expect(eff('qual:test:selftest', 'script')).toEqual(expect.arrayContaining(['node node_modules/jest/bin/jest.js -c jest.qual.config.js --ci',
      expect.stringContaining('scripts/qual/devices/device-farm-run.mjs --self-check')]));
    for (const j of ['qual:certify:baseline-refresh', 'qual:certify:review-record']) {
      expect(doc[j]!.rules!.every((r) => r.when === 'manual')).toBe(true);
    }
    expect(JSON.stringify(eff('qual:certify:known-failures', 'rules'))).toContain('$AG_SCOPE == \\"nightly\\"');
  });

  it('every job extends a root template, has rules on $AG_SCOPE and $AG_LINE == "5x"', () => {
    for (const j of jobs) {
      expect([j, parents(j).some((p) => ROOT_TEMPLATES.includes(p))]).toEqual([j, true]);
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
