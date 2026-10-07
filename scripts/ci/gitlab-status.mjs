#!/usr/bin/env node
/* GitLab merge gate (§2.3): a PR merges on GitHub only after this reports 'success'.
   Usage: node scripts/ci/gitlab-status.mjs --sha <head sha>
   Public API, no token: GET /projects/87152036/pipelines?sha=<sha>. */
const PROJECT = process.env.AG_GITLAB_PROJECT ?? '87152036';
const BASE = process.env.AG_GITLAB_BASE ?? 'https://gitlab.com';
const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : null; };
const sha = arg('sha');
if (!sha) { console.error('usage: gitlab-status.mjs --sha <sha>'); process.exit(2); }

const res = await fetch(`${BASE}/api/v4/projects/${PROJECT}/pipelines?sha=${encodeURIComponent(sha)}&per_page=5`);
if (!res.ok) { console.error(`gitlab-status: API ${res.status}`); process.exit(2); }
const pipelines = await res.json();
if (!pipelines.length) { console.log('pending  no pipeline for this sha yet (mirror lag, §2.3 W-6)'); process.exit(1); }
const p = pipelines[0];
const url = p.web_url ?? `${BASE}/chahal-foundation-group/github-auraoneai/auraglass/-/pipelines/${p.id}`;
console.log(`${p.status}  ${url}`);
process.exit(p.status === 'success' ? 0 : 1);
