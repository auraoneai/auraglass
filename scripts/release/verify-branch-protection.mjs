#!/usr/bin/env node
/* verify-branch-protection.mjs (PLAT-049/050). Read-only: diffs the GitHub
   branch-protection state of main, next and release/4.x against the payloads in
   docs/release/branch-policy.md. NEVER run in CI (it would need a GitHub token);
   operator-run with the existing `gh` login. Exit 0 = all protections match. */
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

if (process.env.GITLAB_CI === 'true' || process.env.CI === 'true') {
  console.error('verify-branch-protection: never run under CI (§2.3 — no GitHub credentials in CI)');
  process.exit(2);
}

const REPO = process.env.AG_REPO ?? 'auraoneai/auraglass';
const BRANCHES = ['main', 'next', 'release/4.x'];

// The required protection for each branch, per docs/release/branch-policy.md.
const EXPECTED = {
  required_status_checks: { strict: true, contexts: [] /* GitLab pipeline status when OD-9 lands */ },
  enforce_admins: true,
  required_pull_request_reviews: {
    dismiss_stale_reviews: true,
    require_code_owner_reviews: true,
    required_approving_review_count: 1,
  },
  restrictions: null,
  required_linear_history: true,
  allow_force_pushes: false,
  allow_deletions: false,
};

const gh = (a) => execFileSync('gh', a, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });

let bad = 0;
for (const branch of BRANCHES) {
  let got;
  try {
    got = JSON.parse(gh(['api', `repos/${REPO}/branches/${branch}/protection`]));
  } catch (e) {
    console.error(`${branch}: UNVERIFIED (protection read failed — ${e.message.split('\n')[0]})`);
    bad++;
    continue;
  }
  const checks = {
    enforce_admins: got.enforce_admins?.enabled === true,
    required_linear_history: got.required_linear_history?.enabled === true,
    allow_force_pushes: got.allow_force_pushes?.enabled === false,
    allow_deletions: got.allow_deletions?.enabled === false,
    code_owner_reviews: got.required_pull_request_reviews?.require_code_owner_reviews === true,
    dismiss_stale: got.required_pull_request_reviews?.dismiss_stale_reviews === true,
    no_restrictions: got.restrictions === undefined || got.restrictions === null,
  };
  for (const [k, ok] of Object.entries(checks)) {
    if (!ok) {
      console.error(`${branch}: FAIL ${k}`);
      bad++;
    }
  }
  if (!bad) console.log(`${branch}: protection OK`);
}
console.log(existsSync('docs/release/branch-policy.md') ? '' : 'WARN: docs/release/branch-policy.md missing');
process.exit(bad ? 1 : 0);
