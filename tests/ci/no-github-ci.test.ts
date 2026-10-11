/* @jest-environment node */
// PLAT-003/PLAT-004: the five legacy GHA workflows are deleted and nothing
// in the repo references GitHub Actions machinery. The mirror workflow is
// the only file allowed under .github/workflows/.
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const FORBIDDEN_WORKFLOWS = [
  'ci.yml',
  'release.yml',
  'canary.yml',
  'visual.yml',
  'nightly.yml',
];

// Tokens that indicate GitHub Actions machinery. Docs that describe the
// migration (docs/, legacy/) may name them; code and CI may not.
// REQ-FIN-21: the contract token set plus `actions/`; `gh run` matches a
// space or a flag/continuation after `gh run`.
const FORBIDDEN_CONTENT = [
  /actions\//,
  /GITHUB_WORKFLOW_REF/,
  /GITHUB_SHA\b/,
  /GITHUB_REF\b/,
  /GITHUB_EVENT_NAME/,
  /gh\s+run\b/,
  /secrets\./,
];

// Explicit list of contract/PRD files describing the migration (allowed to
// name the old system), per REQ-FIN-21.
const MIGRATION_DOCS = new Set([
  'docs/auraglass-5/AURAGLASS_5_CONTRACTS.md',
  'docs/auraglass-5/AURAGLASS_5_IMPLEMENTATION_TASKLIST.csv',
  'docs/auraglass-5/AURAGLASS_5_IMPLEMENTATION_TASKLIST.md',
  'docs/auraglass-5/AURAGLASS_5_MASTER_PRD.md',
  'docs/auraglass-5/AURAGLASS_CURRENT_STATE_AUTOPSY.md',
  'docs/auraglass-5/prd/AURAGLASS_PLATFORM_RELEASE_PRD.md',
  'docs/auraglass-5/prd/_completeness-review.md',
  'docs/auraglass-5/prompts/PROMPT_2_MAT.md',
  'docs/auraglass-5/prompts/PROMPT_3_CMP.md',
  'docs/auraglass-5/prompts/PROMPT_4_SURF.md',
  'docs/auraglass-5/prompts/PROMPT_5_QUAL.md',
  'docs/auraglass-5/tasks/CMP.json',
  'docs/auraglass-5/tasks/MAT.json',
  'docs/auraglass-5/tasks/PLAT.json',
  'docs/auraglass-5/tools/build-stream-prompts.mjs',
  'docs/auraglass-5/tools/relocate-archived-paths.mjs',
  'docs/auraglass-5/autopsy/inventory/shard-01.json',
  'docs/auraglass-5/autopsy/inventory/shard-13.json',
  'docs/auraglass-5/autopsy/inventory/shard-27.json',
  'docs/auraglass-5/autopsy/qa-certification.md',
  'docs/auraglass-5/component-inventory.json',
  'docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md',
  'docs/auraglass-5/tasks/SURF.json',
]);

const EXCLUDE_PATH = [
  /^docs\/auraglass-5\/archive\//, // archived PRDs name the old system
  /^legacy\//,
  /^reports\//, // generated audit output (fixture names like "--with-actions/")
  /^\.github\/workflows\/mirror-to-gitlab\.yml$/,
  /^tests\/ci\/no-github-ci\.test\.ts$/,
  /^tests\/ci\/fixtures\//,
  /^scripts\/ci\/verify-ci-fragments\.mjs$/,
];
const EXCLUDE_EXT = /\.(png|jpe?g|gif|webp|ico|woff2?|ttf|otf|eot|map|tsbuildinfo|snap)$/;

function trackedFiles(): string[] {
  const out = execFileSync('git', ['ls-files'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return out.split('\n').filter(Boolean);
}

describe('GHA removal (PLAT-003)', () => {
  it('deletes all five legacy workflows', () => {
    for (const f of FORBIDDEN_WORKFLOWS) {
      expect(existsSync(`.github/workflows/${f}`)).toBe(false);
    }
  });

  it('keeps only mirror-to-gitlab.yml under .github/workflows (when the dir exists)', () => {
    const dir = '.github/workflows';
    const files = existsSync(dir) ? readdirSync(dir) : [];
    expect(files.filter((f) => f !== 'mirror-to-gitlab.yml')).toEqual([]);
  });

  it('has no new workflow files vs the line base', () => {
    // compare against merge-base to catch files deleted-then-readded
    let mergeBase = '';
    for (const base of ['origin/next', 'origin/release/4.x', 'origin/main']) {
      try {
        mergeBase = execFileSync('git', ['merge-base', base, 'HEAD'], { encoding: 'utf8' }).trim();
        if (mergeBase) break;
      } catch {
        /* try next base */
      }
    }
    if (!mergeBase) return; // shallow clone: assert current state only
    const diff = execFileSync(
      'git',
      ['diff', '--name-only', '--diff-filter=AM', mergeBase, 'HEAD', '--', '.github/workflows/'],
      { encoding: 'utf8' },
    );
    const added = diff.split('\n').filter(Boolean);
    expect(added).toEqual([]);
  });
});

describe('no GHA references (PLAT-004)', () => {
  it('scans tracked non-doc files for GHA tokens', () => {
    const offenders: string[] = [];
    for (const file of trackedFiles()) {
      if (EXCLUDE_EXT.test(file)) continue;
      if (EXCLUDE_PATH.some((re) => re.test(file))) continue;
      if (MIGRATION_DOCS.has(file)) continue;
      let text: string;
      try {
        text = readFileSync(file, 'utf8');
      } catch {
        continue; // binary/unreadable
      }
      for (const re of FORBIDDEN_CONTENT) {
        if (re.test(text)) {
          offenders.push(file);
          break;
        }
      }
    }
    // expiring baseline (§4.3 rule 3): every current offender has a row; a new
    // offender, a stale row, or a malformed row fails the gate. expires='RC-1'.
    const baseline = JSON.parse(
      readFileSync('scripts/integration/baselines/no-github-ci.json', 'utf8'),
    ) as Array<{ file: string; owner: string; reqFin: string; expires: string }>;
    const covered = new Set<string>();
    for (const row of baseline) {
      const ok =
        typeof row.file === 'string' &&
        typeof row.owner === 'string' &&
        typeof row.reqFin === 'string' &&
        row.expires === 'RC-1';
      expect(ok).toBe(true);
      covered.add(row.file);
    }
    const fresh = offenders.filter((f) => !covered.has(f));
    const stale = baseline.map((r) => r.file).filter((f) => !offenders.includes(f));
    expect(fresh.join(', ')).toBe(''); // new GHA-reference offender(s)
    expect(stale.join(', ')).toBe(''); // stale baseline rows — file no longer offends
  });
});
