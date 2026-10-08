// tests/capability/ci-fragment.test.ts — AC-SURF-31 / G-16 (REQ-SURF-195).
// Structural checks on ci/surf.gitlab-ci.yml so every job stays inside the
// contract §4.13.4 vocabulary, plus the no-.github/workflows invariant for
// SURF branches. Dependency-free line parser (fragments stay include-safe).

import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const FRAGMENT = 'ci/surf.gitlab-ci.yml';
const JOB_NAME = /^surf:(build|test|certify|package|publish):[a-z0-9-]+$/;
const TEMPLATE_NAME = /^\.surf-[a-z0-9-]+$/;

// Split the fragment into top-level blocks: { name, lines } where `lines` are
// the block's body lines (indented or blank), comments stripped.
function parseFragment(text: string) {
  const blocks: { name: string; lines: string[] }[] = [];
  let current: { name: string; lines: string[] } | null = null;
  for (const raw of text.split('\n')) {
    const noComment = raw.replace(/\s+#.*$/, '').replace(/^#.*$/, '');
    if (!noComment.trim()) {
      if (current) current.lines.push('');
      continue;
    }
    const m = noComment.match(/^([^\s].*):$/);
    if (m) {
      current = { name: m[1]!.trim(), lines: [] };
      blocks.push(current);
    } else if (current) {
      current.lines.push(noComment);
    }
    // a non-indented line that is not a key is illegal YAML at top level — ignore
  }
  return blocks;
}

function gitDiffNames(): string[] | null {
  try {
    // G-16 bans ADDING .github/workflows files; deletions (e.g. C0's cleanup)
    // are fine — restrict the name list to added/modified paths.
    const out = execFileSync('git', ['diff', '--name-only', '--diff-filter=AM', 'origin/next...HEAD'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.split('\n').filter(Boolean);
  } catch {
    return null;
  }
}

describe('ci/surf.gitlab-ci.yml fragment contract (AC-SURF-31)', () => {
  const text = readFileSync(join(ROOT, FRAGMENT), 'utf8');
  const blocks = parseFragment(text);
  const jobs = blocks.filter((b) => !b.name.startsWith('.'));

  it('only declares hidden templates and surf:<stage>:<name> jobs', () => {
    expect(blocks.length).toBeGreaterThan(0);
    for (const b of blocks) {
      if (b.name.startsWith('.')) {
        expect(b.name).toMatch(TEMPLATE_NAME);
      } else {
        expect(b.name).toMatch(JOB_NAME);
      }
    }
  });

  it('every job extends a root or stream template and scopes on $AG_SCOPE', () => {
    for (const job of jobs) {
      const body = job.lines.join('\n');
      expect(body).toMatch(/^\s+extends:\s*\.(ag|surf)-[a-z0-9-]+/m);
      expect(body).toMatch(/rules:/);
      expect(body).toContain('$AG_SCOPE');
      expect(body).toContain('$AG_LINE');
    }
  });

  it('collects artifacts only under .artifacts/surf/ with expire_in', () => {
    for (const job of jobs) {
      const body = job.lines.join('\n');
      const artifactPaths = [...body.matchAll(/^\s+-\s+(\.artifacts\/\S+)/gm)].map((m) => m[1]);
      for (const p of artifactPaths) {
        expect(p).toMatch(/^\.artifacts\/surf\//);
      }
      if (/artifacts:/.test(body)) {
        expect(body).toMatch(/expire_in:/);
      }
    }
  });

  it('holds no credentials in job variables', () => {
    for (const job of jobs) {
      for (const line of job.lines) {
        expect(line).not.toMatch(/[A-Z0-9_]*(TOKEN|SECRET|PASSWORD|PRIVATE_KEY)[A-Z0-9_]*\s*:/);
      }
    }
  });

  it('contains no merge_request event rules (the mirror has no MRs)', () => {
    expect(text).not.toContain('merge_request_event');
    expect(text).not.toContain('CI_MERGE_REQUEST_');
  });

  it('adds no .github/workflows files on this branch (G-16)', () => {
    const names = gitDiffNames();
    if (names) {
      for (const n of names) {
        expect(n).not.toMatch(/^\.github\/workflows\//);
      }
    } else {
      // local fallback: only the org-managed mirror file may exist
      let listed: string[] = [];
      try {
        listed = execFileSync('git', ['ls-files', '.github/workflows/*'], {
          cwd: ROOT,
          encoding: 'utf8',
        })
          .split('\n')
          .filter(Boolean);
      } catch {
        return;
      }
      expect(listed).toEqual(['.github/workflows/mirror-to-gitlab.yml']);
    }
  });
});
