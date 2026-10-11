/* REQ-QUAL-60 Evidence is artifacts, never commits — packages/qa/test/no-committed-evidence.test.ts.
   (1) this checkout tracks no evidence (shipping PNGs under src/**\/assets/ wait on OD-19 in the
   expiring baseline); (2) a throwaway git repo proves the guard fails once reports/x.json is git-added;
   (3) every qual:* job names its artifact evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA with the
   EVIDENCE.expireIn retention of its scope. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import yaml from 'yaml';
import { EVIDENCE } from '../../../src/contracts/testing.ts';
import {
  COMMITTED_EVIDENCE_BASELINE, gitTrackedPaths, parseOd19, readOd19, scanTrackedPaths, type EvidenceOffender,
} from '../src/evidence/committedEvidence.ts';
import { baselineFailures, checkBaseline, readBaseline, type BaselineRow } from '../src/evidence/expiringBaseline.ts';

const REPO = resolve(__dirname, '../../..');
const PENDING = { recorded: false, admitSrcAssets: false, status: 'awaiting-owner' } as const;

function gate(root: string, baseline: unknown[], scope: string | undefined): string[] {
  const offenders = scanTrackedPaths(gitTrackedPaths(root), readOd19(root));
  // Only src/**/assets/ PNGs waiting on OD-19 may be baselined; evidence paths never can.
  const bad = baseline.filter((r) => {
    const o = r as Record<string, unknown>;
    return o.rule !== 'png-outside-allowlist' || o.pendingOn !== 'OD-19' || !/^src\/(?:.+\/)?assets\/.+\.png$/i.test(String(o.file));
  });
  const check = checkBaseline(baseline, offenders, (r: BaselineRow) => `${r.file}\u0000${r.rule}`, (o: EvidenceOffender) => `${o.file}\u0000${o.rule}`, scope);
  return [
    ...bad.map((r) => `no-committed-evidence: baseline row not allowed (only OD-19 src/**/assets PNGs): ${JSON.stringify(r)}`),
    ...baselineFailures('no-committed-evidence', check, (o) => `${o.rule} ${o.file}`),
  ];
}

describe('tracked paths of this checkout', () => {
  it('track no evidence; only OD-19-pending shipping PNGs are baselined', () => {
    expect(gate(REPO, readBaseline(join(REPO, COMMITTED_EVIDENCE_BASELINE)), process.env.AG_SCOPE)).toEqual([]);
  });
});

describe('guard behaviour on a real git index', () => {
  it('passes on a clean repo and fails once reports/x.json is git-added', () => {
    const root = mkdtempSync(join(tmpdir(), 'qa-evidence-'));
    const git = (...a: string[]) => execFileSync('git', a, { cwd: root, stdio: 'pipe' });
    const put = (p: string, s: string) => { mkdirSync(dirname(join(root, p)), { recursive: true }); writeFileSync(join(root, p), s); };
    try {
      git('init', '-q');
      put('src/index.ts', 'export {};\n');
      put('certification/scenes/photo.png', 'png');
      put('showcase/music/assets/cover.png', 'png');
      put('docs/guide/assets/shot.png', 'png');
      git('add', '.');
      expect(gate(root, [], 'pr')).toEqual([]);

      put('reports/x.json', '{}');
      git('add', 'reports/x.json');
      expect(gate(root, [], 'pr')).toEqual(['no-committed-evidence: new offender evidence-path reports/x.json']);
      // An untracked file is not a commit: removing it from the index clears the failure.
      git('rm', '-q', '--cached', 'reports/x.json');
      expect(gate(root, [], 'pr')).toEqual([]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe('scanTrackedPaths rules', () => {
  it('rejects every evidence directory and *-snapshots/ directories', () => {
    const paths = ['reports/a.json', 'certification/out/a.png', 'test-results/r.xml', 'playwright-report/index.html', 'coverage/lcov.info',
      '.artifacts/qual/x.json', 'storybook-static/index.json', 'tests/e2e/foo.spec.ts-snapshots/a.png', 'src/x/__image-snapshots/b.txt'];
    expect(scanTrackedPaths(paths, PENDING).map((o) => o.rule)).toEqual([
      'evidence-path', 'evidence-path', 'evidence-path', 'evidence-path', 'evidence-path', 'evidence-path', 'evidence-path', 'snapshot-dir', 'snapshot-dir']);
  });
  it('allows PNGs only under baselines, scenes, showcase assets and docs assets', () => {
    const ok = ['certification/baselines/chromium/a.png', 'certification/scenes/photo.png', 'showcase/music/assets/a.png', 'docs/assets/a.png', 'docs/x/y/assets/a.PNG'];
    const bad = ['src/material/assets/lens/a.png', 'showcase/music/a.png', 'stories/a.png', 'docs/x/a.png', 'showcase/a/b/assets/c.png'];
    expect(scanTrackedPaths(ok, PENDING)).toEqual([]);
    expect(scanTrackedPaths(bad, PENDING).map((o) => o.file)).toEqual(bad);
  });
  it('admits src/**/assets/ only after the owner records OD-19', () => {
    const p = ['src/material/assets/lens/a.png', 'src/x.png'];
    const fm = (body: string) => `---\nid: OD-19\n${body}\n---\n# OD-19\n`;
    expect(parseOd19(null)).toEqual({ recorded: false, admitSrcAssets: false, status: 'absent' });
    expect(parseOd19(fm('status: awaiting-owner')).admitSrcAssets).toBe(false);
    const defaulted = parseOd19(fm('status: defaulted'));
    expect(scanTrackedPaths(p, defaulted).map((o) => o.file)).toEqual(['src/x.png']);
    expect(parseOd19(fm('status: decided\npngAllowlist: allow-src-assets')).admitSrcAssets).toBe(true);
    expect(parseOd19(fm('status: decided\npngAllowlist: relocate')).admitSrcAssets).toBe(false);
    expect(() => parseOd19(fm('status: decided'))).toThrow(/pngAllowlist/);
  });
  it('baseline rows go stale when OD-19 admits the PNGs, and expire at RC-1', () => {
    const row = { file: 'src/a/assets/b.png', owner: 'MAT', reqFin: 'REQ-FIN-103', expires: 'RC-1', rule: 'png-outside-allowlist', pendingOn: 'OD-19' };
    const key = (r: { file: string; rule?: string }) => `${r.file}|${r.rule ?? ''}`;
    const pending = scanTrackedPaths([row.file], PENDING);
    expect(checkBaseline([row], pending, key, key, 'pr')).toMatchObject({ fresh: [], stale: [], expired: [] });
    const admitted = scanTrackedPaths([row.file], { recorded: true, admitSrcAssets: true, status: 'defaulted' });
    expect(checkBaseline([row], admitted, key, key, 'pr').stale).toEqual([row]);
    expect(checkBaseline([row], pending, key, key, 'release').expired).toEqual([row]);
  });
});

// ---- CI artifacts (EVIDENCE.artifactName / expireIn) ----------------------------------------

type Job = Record<string, unknown> & { extends?: string | string[]; artifacts?: Record<string, unknown>; rules?: unknown };

function isPlain(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}
/** GitLab `extends` semantics: hashes deep-merge, everything else (arrays, scalars) is replaced. */
function deepMerge(a: Record<string, unknown>, b: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = isPlain(out[k]) && isPlain(v) ? deepMerge(out[k] as Record<string, unknown>, v) : v;
  return out;
}
function effective(name: string, defs: Record<string, Job>, depth = 0): Job {
  const def = defs[name];
  if (!def) throw new Error(`unknown template ${name}`);
  if (depth > 10) throw new Error(`extends cycle at ${name}`);
  const parents = def.extends === undefined ? [] : Array.isArray(def.extends) ? def.extends : [def.extends];
  let acc: Record<string, unknown> = {};
  for (const p of parents) acc = deepMerge(acc, effective(p, defs, depth + 1));
  const { extends: _ignored, ...own } = def;
  return deepMerge(acc, own) as Job;
}

describe('qual:* job artifacts', () => {
  const root = yaml.parse(readFileSync(join(REPO, '.gitlab-ci.yml'), 'utf8')) as Record<string, Job>;
  const qual = yaml.parse(readFileSync(join(REPO, 'ci/qual.gitlab-ci.yml'), 'utf8')) as Record<string, Job>;
  const defs = { ...root, ...qual };
  const jobs = Object.keys(qual).filter((k) => k.startsWith('qual:'));

  it('defines qual jobs', () => {
    expect(jobs).toEqual(expect.arrayContaining(['qual:build:storybook', 'qual:certify:l1', 'qual:certify:nightly', 'qual:certify:release']));
  });

  it.each(jobs)('%s: evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA, when: always, expire_in per scope', (job) => {
    const eff = effective(job, defs);
    const rules = (Array.isArray(eff.rules) ? eff.rules : []).map((r) => String((r as { if?: unknown }).if ?? '')).join(' || ');
    const scope = /\$AG_SCOPE == "release"/.test(rules) ? 'release' : /\$AG_SCOPE == "nightly"/.test(rules) ? 'nightly' : 'pr';
    expect(eff.artifacts).toBeDefined();
    expect(eff.artifacts!.name).toBe(EVIDENCE.artifactName);
    expect(eff.artifacts!.when).toBe('always');
    expect(eff.artifacts!.expire_in).toBe(EVIDENCE.expireIn[scope as keyof typeof EVIDENCE.expireIn]);
    const paths = eff.artifacts!.paths as string[];
    expect(paths.length).toBeGreaterThan(0);
    for (const p of paths) {
      const allowed = job === 'qual:build:storybook' ? p === 'storybook-static/'
        : scope === 'release' ? p === '.artifacts/' : p === '.artifacts/qual/$CI_JOB_NAME_SLUG/';
      expect(`${job} ${p} ${allowed}`).toBe(`${job} ${p} true`);
    }
  });
});
