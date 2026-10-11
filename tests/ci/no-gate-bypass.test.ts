/* @jest-environment node */
/**
 * PLAT-068 / REQ-FIN-22 (PLAT-015/039/051) — no gate bypass on release/4.x CI.
 *
 * Fails when:
 *  - '|| true' or '--no-verify' appears anywhere in the PLAT CI file or the
 *    package.json scripts,
 *  - a job with a ci/plat/activation.json row for this line still has
 *    allow_failure: true (activation = first green pipeline; the flip lands in
 *    the same PR as the row),
 *  - at tag scope one of the four release gates (plat:gate:glass-quality,
 *    plat:integration:{next,vite}, plat:gate:change-class) has an effective
 *    allow_failure other than false — checked through require-activated.mjs on
 *    synthetic and live CI files,
 *  - plat:gate:glass-quality does not run `npm run lint:check`,
 *  - package.json `lint` mutates (--fix belongs to `lint:fix` only),
 *  - the no-inline-glass baseline is missing, unsorted, or duplicated.
 * Jobs without an activation row may keep allow_failure: true outside tag
 * scope (they are still being lifted, REQ-FIN-22 procedure).
 */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'yaml';

const ROOT = join(__dirname, '..', '..');
const CI_FILE = join(ROOT, 'ci', 'plat.gitlab-ci.yml');
const ACTIVATION_FILE = join(ROOT, 'ci', 'plat', 'activation.json');
const SCRIPT = join(ROOT, 'scripts', 'ci', 'require-activated.mjs');
const LINE = '4x';

const GATES = [
  'plat:gate:glass-quality',
  'plat:integration:next',
  'plat:integration:vite',
  'plat:gate:change-class',
];

type Activation = {
  job: string;
  line: string;
  firstGreenPipelineUrl?: string;
  pipelineUrl?: string;
  sha?: string;
  date: string;
};

function run(root: string, env: NodeJS.ProcessEnv = {}) {
  try {
    const out = execFileSync('node', [SCRIPT, '--line', LINE, '--root', root], {
      encoding: 'utf8',
      env: { ...process.env, ...env },
    });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}

function synthetic(ciText: string) {
  const root = mkdtempSync(join(tmpdir(), 'no-gate-bypass-'));
  mkdirSync(join(root, 'ci'), { recursive: true });
  writeFileSync(join(root, 'ci/plat.gitlab-ci.yml'), ciText);
  return root;
}

describe('no gate bypass (PLAT-068)', () => {
  const ciText = readFileSync(CI_FILE, 'utf8');
  const doc = yaml.parse(ciText);
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

  it("contains no '|| true' or '--no-verify' anywhere in the CI file", () => {
    expect(ciText).not.toMatch(/\|\|\s*true/);
    expect(ciText).not.toContain('--no-verify');
  });

  it("package.json scripts contain no '|| true' or '--no-verify'", () => {
    const offenders = (Object.entries(pkg.scripts) as [string, string][])
      .filter(([, cmd]) => /\|\|\s*true/.test(cmd) || cmd.includes('--no-verify'))
      .map(([name]) => name);
    expect(offenders).toEqual([]);
  });

  it('every release gate exists in ci/plat.gitlab-ci.yml', () => {
    expect(GATES.filter((job) => !doc[job])).toEqual([]);
  });

  it('plat:gate:glass-quality runs npm run lint:check', () => {
    const script = [doc['plat:gate:glass-quality']?.script ?? []].flat().join('\n');
    expect(script).toContain('npm run lint:check');
  });

  it('package.json lint is non-mutating (no --fix)', () => {
    expect(pkg.scripts.lint).toBe('eslint src');
    expect(pkg.scripts.lint).not.toContain('--fix');
    expect(pkg.scripts['lint:fix']).toBe('eslint src --fix');
  });

  it('no-inline-glass baseline exists and is sorted + de-duplicated', () => {
    const p = join(ROOT, 'eslint', 'no-inline-glass-baseline.json');
    expect(existsSync(p)).toBe(true);
    const list: string[] = JSON.parse(readFileSync(p, 'utf8'));
    expect(list).toEqual([...list].sort());
    expect(new Set(list).size).toBe(list.length);
  });
});

describe('ci/plat/activation.json (REQ-FIN-22 activation procedure)', () => {
  const activation = JSON.parse(readFileSync(ACTIVATION_FILE, 'utf8'));
  const doc = yaml.parse(readFileSync(CI_FILE, 'utf8'));
  const rows: Activation[] = activation.activations;

  it('every row is well-formed {job, line, firstGreenPipelineUrl|pipelineUrl, sha, date}', () => {
    expect(Array.isArray(rows)).toBe(true);
    for (const row of rows) {
      expect(typeof row.job).toBe('string');
      expect(['4x', '5x']).toContain(row.line);
      expect(String(row.firstGreenPipelineUrl ?? row.pipelineUrl)).toMatch(
        /^https:\/\/gitlab\.com\/.+\/-\/pipelines\/\d+/,
      );
      expect(row.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('every activated job on this line exists and has allow_failure: false (job-level and in every rule)', () => {
    const bad: string[] = [];
    for (const row of rows.filter((r) => r.line === LINE)) {
      const job = doc[row.job];
      if (!job) {
        bad.push(`${row.job}: activation row for a job that does not exist`);
        continue;
      }
      if (job.allow_failure !== false) bad.push(`${row.job}: allow_failure=${job.allow_failure}`);
      for (const r of job.rules ?? []) {
        if (r?.allow_failure === true) bad.push(`${row.job}: rule ${JSON.stringify(r.if)} allow_failure: true`);
      }
    }
    expect(bad).toEqual([]);
  });
});

describe('tag scope: the four release gates (require-activated.mjs)', () => {
  it('fails a synthetic 4x tag pipeline when a gate keeps allow_failure: true', () => {
    const root = synthetic(
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
    const root = synthetic(
      GATES.map(
        (j) =>
          `${j}: { allow_failure: true, rules: [{ if: "$CI_COMMIT_TAG", allow_failure: false }, { if: "$AG_SCOPE == \\"release\\"" }] }`,
      ).join('\n'),
    );
    const r = run(root, { CI_COMMIT_TAG: 'v4.3.0' });
    expect(r.code).toBe(0);
    expect(r.out).toContain(`${GATES.length} gates enforced`);
  });

  it('does not enforce on non-tag pipelines', () => {
    const root = synthetic('plat:gate:glass-quality: { allow_failure: true }\n');
    const r = run(root, { CI_COMMIT_TAG: '', AG_SCOPE: 'pr' });
    expect(r.code).toBe(0);
  });

  it('live ci/plat.gitlab-ci.yml gives every gate a $CI_COMMIT_TAG allow_failure:false rule', () => {
    const doc = yaml.parse(readFileSync(CI_FILE, 'utf8'));
    for (const job of GATES) {
      const rules = doc[job]?.rules ?? [];
      const has = rules.some(
        (r: any) => /\$CI_COMMIT_TAG/.test(String(r?.if ?? '')) && r.allow_failure === false,
      );
      expect({ job, hasTagRule: has }).toEqual({ job, hasTagRule: true });
    }
    expect(run(ROOT, { CI_COMMIT_TAG: 'v9.9.9' }).code).toBe(0);
  });

  it('require-activated.mjs is the first script line of plat:package:pack', () => {
    const doc = yaml.parse(readFileSync(CI_FILE, 'utf8'));
    const first = String([doc['plat:package:pack']?.script ?? []].flat()[0] ?? '');
    expect(first).toMatch(/^node scripts\/ci\/require-activated\.mjs --line "?\$AG_LINE"?$/);
  });
});
