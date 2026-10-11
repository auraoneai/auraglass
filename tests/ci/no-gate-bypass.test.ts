/* @jest-environment node */
// REQ-FIN-22 (PLAT-015/039/051): no gate may be bypassed on a tag pipeline.
// - require-activated.mjs exits 1 on a synthetic 4x tag pipeline whose gates
//   keep allow_failure: true, and exits 0 on the live tree where the
//   $CI_COMMIT_TAG rules flip them to false.
// - ci/plat/activation.json rows are well-formed; an activated job must not
//   keep a blanket allow_failure: true on that line's yml.
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'yaml';

const SCRIPT = join(process.cwd(), 'scripts/ci/require-activated.mjs');
const GATES = [
  'plat:gate:glass-quality',
  'plat:integration:next',
  'plat:integration:vite',
  'plat:gate:change-class',
];

function run(root: string, env: NodeJS.ProcessEnv = {}) {
  try {
    const out = execFileSync('node', [SCRIPT, '--line', '4x', '--root', root], {
      encoding: 'utf8',
      env: { ...process.env, ...env },
    });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}

describe('require-activated.mjs', () => {
  it('fails a synthetic 4x tag pipeline when a gate keeps allow_failure: true', () => {
    const root = mkdtempSync(join(tmpdir(), 'no-gate-bypass-'));
    mkdirSync(join(root, 'ci'), { recursive: true });
    writeFileSync(
      join(root, 'ci/plat.gitlab-ci.yml'),
      [
        'plat:gate:glass-quality:',
        '  allow_failure: true',
        '  rules: [{ if: "$AG_SCOPE == \\"release\\"" }]',
        'plat:integration:next: { allow_failure: false, rules: [{ if: "$CI_COMMIT_TAG", allow_failure: false }] }',
        'plat:integration:vite: { allow_failure: false, rules: [{ if: "$CI_COMMIT_TAG", allow_failure: false }] }',
        'plat:gate:change-class: { allow_failure: false, rules: [{ if: "$CI_COMMIT_TAG", allow_failure: false }] }',
      ].join('\n'),
    );
    const r = run(root, { CI_COMMIT_TAG: 'v4.3.0' });
    expect(r.code).toBe(1);
    expect(r.out).toContain('plat:gate:glass-quality');
  });

  it('passes a synthetic tag pipeline whose gates flip to allow_failure: false', () => {
    const root = mkdtempSync(join(tmpdir(), 'no-gate-bypass-'));
    mkdirSync(join(root, 'ci'), { recursive: true });
    writeFileSync(
      join(root, 'ci/plat.gitlab-ci.yml'),
      GATES.map((j) =>
        `${j}: { allow_failure: true, rules: [{ if: "$CI_COMMIT_TAG", allow_failure: false }, { if: "$AG_SCOPE == \\"release\\"" }] }`,
      ).join('\n'),
    );
    const r = run(root, { CI_COMMIT_TAG: 'v4.3.0' });
    expect(r.code).toBe(0);
    expect(r.out).toContain(`${GATES.length} gates enforced`);
  });

  it('passes (no enforcement) on non-tag pipelines', () => {
    const root = mkdtempSync(join(tmpdir(), 'no-gate-bypass-'));
    mkdirSync(join(root, 'ci'), { recursive: true });
    writeFileSync(join(root, 'ci/plat.gitlab-ci.yml'), 'plat:gate:glass-quality: { allow_failure: true }\n');
    const r = run(root, { CI_COMMIT_TAG: '', AG_SCOPE: 'pr' });
    expect(r.code).toBe(0);
  });

  it('live ci/plat.gitlab-ci.yml gives every gate a $CI_COMMIT_TAG allow_failure:false rule', () => {
    const doc = yaml.parse(readFileSync('ci/plat.gitlab-ci.yml', 'utf8'));
    for (const job of GATES) {
      const rules = doc[job]?.rules ?? [];
      const has = rules.some(
        (r: any) => /\$CI_COMMIT_TAG/.test(String(r?.if ?? '')) && r.allow_failure === false,
      );
      expect({ job, hasTagRule: has }).toEqual({ job, hasTagRule: true });
    }
    expect(run('.', { CI_COMMIT_TAG: 'v9.9.9' }).code).toBe(0);
  });
});

describe('ci/plat/activation.json', () => {
  const activation = JSON.parse(readFileSync('ci/plat/activation.json', 'utf8'));
  it('every row is well-formed {job, line, firstGreenPipelineUrl|pipelineUrl, sha, date}', () => {
    expect(Array.isArray(activation.activations)).toBe(true);
    for (const row of activation.activations) {
      expect(typeof row.job).toBe('string');
      expect(['4x', '5x']).toContain(row.line);
      expect(typeof (row.firstGreenPipelineUrl ?? row.pipelineUrl)).toBe('string');
      expect(row.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
  it('an activated REQUIRED_JOBS gate carries no blanket allow_failure: true', () => {
    const doc = yaml.parse(readFileSync('ci/plat.gitlab-ci.yml', 'utf8'));
    const REQUIRED = ['plat:gate:glass-quality', 'plat:integration:next', 'plat:integration:vite', 'plat:gate:change-class'];
    for (const row of activation.activations) {
      if (!REQUIRED.includes(row.job)) continue;
      expect({ job: row.job, allow_failure: doc[row.job]?.allow_failure }).toEqual({ job: row.job, allow_failure: false });
    }
  });
});
