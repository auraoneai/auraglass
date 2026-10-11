#!/usr/bin/env node
/* verify-branch-protection.mjs (PLAT-017/049/050, REQ-FIN-25). Read-only:
   diffs the GitHub branch-protection state of main, next, release/4.x and
   release/4.1.x against the payload in docs/release/branch-policy.md.
   NEVER run in CI (it would need a GitHub token); operator-run with the
   existing `gh` login.

   Usage: node scripts/release/verify-branch-protection.mjs
            [--branch b1,b2…] [--repo owner/repo] [--od9]

   For each branch, `gh api repos/<repo>/branches/<url-encoded>/protection`
   (release/4.x → release%2F4.x) must exist (a 404 fails) and satisfy:
     - required_approving_review_count >= 1
     - required_linear_history, enforce_admins, no force pushes/deletions
     - code-owner reviews + dismiss stale reviews, no push restrictions
     - --od9 (OD-9 on): the single pipeline status context is required
   Prints a per-branch failure counter; exit 0 = all protections match. */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

if (process.env.GITLAB_CI === 'true' || process.env.CI === 'true') {
  console.error('verify-branch-protection: never run under CI (§2.3 — no GitHub credentials in CI)');
  process.exit(2);
}

const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 ? process.argv[i + 1] : null;
};
const REPO = arg('repo') ?? process.env.AG_REPO ?? 'auraoneai/auraglass';
const STATUS_CONTEXT = 'gitlab-pipeline';
const od9 = process.argv.includes('--od9');
const BRANCHES = arg('branch')?.split(',').filter(Boolean) ?? [
  'main',
  'next',
  'release/4.x',
  'release/4.1.x',
];

const gh = (a) => execFileSync('gh', a, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });

const failures = {};
let checked = 0;
for (const branch of BRANCHES) {
  const fails = (failures[branch] = []);
  let got;
  try {
    got = JSON.parse(gh(['api', `repos/${REPO}/branches/${encodeURIComponent(branch)}/protection`]));
  } catch (e) {
    const msg = `${e?.message ?? e}${e?.stderr ?? ''}`;
    fails.push(`protection read failed (${/404|Not Found/.test(msg) ? '404 — not protected' : msg.split('\n')[0]})`);
    continue;
  }
  checked++;
  const reviews = got.required_pull_request_reviews?.required_approving_review_count ?? 0;
  const checks = {
    'required_approving_review_count >= 1': reviews >= 1,
    required_linear_history: got.required_linear_history?.enabled === true,
    enforce_admins: got.enforce_admins?.enabled === true,
    allow_force_pushes: got.allow_force_pushes?.enabled === false,
    allow_deletions: got.allow_deletions?.enabled === false,
    code_owner_reviews: got.required_pull_request_reviews?.require_code_owner_reviews === true,
    dismiss_stale: got.required_pull_request_reviews?.dismiss_stale_reviews === true,
    no_restrictions: got.restrictions === undefined || got.restrictions === null,
  };
  if (od9) {
    const contexts = got.required_status_checks?.contexts ?? [];
    checks[`required status context '${STATUS_CONTEXT}' (OD-9 on)`] = contexts.includes(STATUS_CONTEXT);
  }
  for (const [k, ok] of Object.entries(checks)) if (!ok) fails.push(k);
}

for (const [b, fs] of Object.entries(failures)) {
  if (fs.length) console.error(`branch-protection FAIL ${b} (${fs.length}): ${fs.join('; ')}`);
  else console.log(`branch-protection OK    ${b}`);
}
if (!existsSync('docs/release/branch-policy.md')) console.log('WARN: docs/release/branch-policy.md missing');
const total = Object.values(failures).reduce((n, f) => n + f.length, 0);
if (total) {
  console.error(`branch-protection: ${total} failure(s) across ${BRANCHES.length} branches`);
  process.exit(1);
}
console.log(`branch-protection: ${checked}/${BRANCHES.length} branches verified`);
