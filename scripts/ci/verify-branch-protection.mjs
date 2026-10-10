#!/usr/bin/env node
/* REQ-FIN-25 (REQ-PLAT-17): verify GitHub branch protection per line.
   Usage: node scripts/ci/verify-branch-protection.mjs [--branch b…]
          [--repo owner/repo] [--od9]
   For each branch (main, next, release/4.x, release/4.1.x) checks via
   `gh api repos/<repo>/branches/<url-encoded>/protection`:
     - exists (a 404 fails)
     - required_approving_review_count >= 1
     - when --od9: the single pipeline status context is present in
       required_status_checks.contexts
   Prints a per-branch failure counter; exits 1 if any branch fails. */
import { execFileSync } from 'node:child_process';

const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 ? process.argv[i + 1] : null;
};
const REPO = arg('repo') ?? 'auraoneai/auraglass';
const STATUS_CONTEXT = 'gitlab-pipeline';
const od9 = process.argv.includes('--od9');
const branches = arg('branch')?.split(',') ?? ['main', 'next', 'release/4.x', 'release/4.1.x'];

const gh = (a) =>
  execFileSync('gh', a, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });

const failures = {};
let checked = 0;
for (const b of branches) {
  failures[b] = [];
  let prot;
  try {
    prot = JSON.parse(gh(['api', `repos/${REPO}/branches/${encodeURIComponent(b)}/protection`]));
  } catch (e) {
    failures[b].push(`protection query failed (${String(e).includes('404') ? '404 — not protected' : 'gh error'})`);
    continue;
  }
  checked++;
  const reviews =
    prot.required_pull_request_reviews?.required_approving_review_count ??
    prot.required_pull_request_reviews?.requiredApprovingReviewCount ??
    0;
  if (!reviews || reviews < 1) failures[b].push('required_approving_review_count < 1');
  if (od9) {
    const contexts = prot.required_status_checks?.contexts ?? [];
    if (!contexts.includes(STATUS_CONTEXT)) {
      failures[b].push(`required status context '${STATUS_CONTEXT}' missing (OD-9 on)`);
    }
  }
}

for (const [b, fs] of Object.entries(failures)) {
  if (fs.length) console.error(`branch-protection FAIL ${b} (${fs.length}): ${fs.join('; ')}`);
  else console.log(`branch-protection OK    ${b}`);
}
const total = Object.values(failures).reduce((n, f) => n + f.length, 0);
if (total) {
  console.error(`branch-protection: ${total} failure(s) across ${branches.length} branches`);
  process.exit(1);
}
console.log(`branch-protection: ${checked}/${branches.length} branches verified`);
