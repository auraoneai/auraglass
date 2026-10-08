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
const FORBIDDEN_CONTENT = [
  /actions\//,
  /GITHUB_WORKFLOW_REF/,
  /GITHUB_SHA\b/,
  /GITHUB_REF\b/,
  /GITHUB_EVENT_NAME/,
  /gh\s+run\b/,
  /secrets\./,
];

const EXCLUDE_PATH = [
  /^docs\//, // migration docs and decision records legitimately name the old system
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

  it('keeps only mirror-to-gitlab.yml under .github/workflows', () => {
    const dir = '.github/workflows';
    const files = existsSync(dir) ? readdirSync(dir) : [];
    expect([...files].sort()).toEqual(['mirror-to-gitlab.yml']);
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
      let text: string;
      try {
        text = readFileSync(file, 'utf8');
      } catch {
        continue; // binary/unreadable
      }
      for (const re of FORBIDDEN_CONTENT) {
        if (re.test(text)) {
          offenders.push(`${file}: ${re.source}`);
          break;
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
