#!/usr/bin/env node
/* GitLab merge gate (§2.3): a PR merges on GitHub only after this reports 'success'.
   Usage: node scripts/ci/gitlab-status.mjs --sha <head sha> [--wait <minutes>] [--json]
   Public API, no token: GET /projects/<id>/pipelines?sha=<sha>, then the jobs API to
   print each non-allow_failure failed job. With a `glab` login `glab ci status` is the
   human-friendly equivalent (used only if the API is unreachable and glab exists). */
import { execFileSync } from 'node:child_process';

const PROJECT = process.env.AG_GITLAB_PROJECT ?? '87152036';
const BASE = process.env.AG_GITLAB_BASE ?? 'https://gitlab.com';
const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 ? process.argv[i + 1] : null;
};
const sha = arg('sha');
const waitMin = Number(arg('wait') ?? 0);
const wantJson = process.argv.includes('--json');
const fetcher = arg('api-base')
  ? { base: arg('api-base') }
  : null;
if (!sha) {
  console.error('usage: gitlab-status.mjs --sha <sha> [--wait <minutes>] [--json]');
  process.exit(2);
}

const api = (fetcher?.base ?? BASE) + `/api/v4/projects/${PROJECT}`;
const apiGet = async (path) => {
  const res = await fetch(`${api}${path}`);
  if (!res.ok) throw new Error(`API ${res.status} for ${path}`);
  return res.json();
};

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000));
const deadline = Date.now() + waitMin * 60 * 1000;

let pipeline = null;
for (;;) {
  let pipelines;
  try {
    pipelines = await apiGet(`/pipelines?sha=${encodeURIComponent(sha)}&per_page=5`);
  } catch (e) {
    // fallback: glab CLI if the operator has a login
    try {
      const out = execFileSync('glab', ['ci', 'status', '--branch', sha, '--output', 'json'], {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      const parsed = JSON.parse(out);
      pipelines = parsed ? [parsed] : [];
    } catch {
      console.error(`gitlab-status: ${e.message} (no glab fallback)`);
      process.exit(2);
    }
  }
  if (!pipelines.length) {
    if (Date.now() < deadline) {
      console.log('pending  no pipeline for this sha yet (mirror lag, §2.3 W-6); waiting');
      await sleep(30);
      continue;
    }
    console.log('pending  no pipeline for this sha yet (mirror lag, §2.3 W-6)');
    process.exit(1);
  }
  pipeline = pipelines[0];
  if (['created', 'waiting_for_resource', 'preparing', 'pending', 'running'].includes(pipeline.status)) {
    if (Date.now() < deadline) {
      console.log(`${pipeline.status}  ${pipeline.web_url ?? ''} — waiting`);
      await sleep(30);
      continue;
    }
    console.log(`${pipeline.status}  ${pipeline.web_url ?? ''}`);
    process.exit(1);
  }
  break;
}

const url =
  pipeline.web_url ??
  `${BASE}/chahal-foundation-group/github-auraoneai/auraglass/-/pipelines/${pipeline.id}`;

if (pipeline.status !== 'success') {
  // print each failed job that is not allow_failure
  try {
    const jobs = await apiGet(`/pipelines/${pipeline.id}/jobs?per_page=100`);
    const bad = jobs.filter((j) => j.status === 'failed' && !j.allow_failure);
    for (const j of bad) {
      console.log(`failed(required)  ${j.name}  ${j.web_url ?? ''}`);
    }
    if (!bad.length) {
      for (const j of jobs.filter((x) => x.status === 'failed')) {
        console.log(`failed(allowed)   ${j.name}`);
      }
    }
  } catch (e) {
    console.error(`gitlab-status: could not list jobs (${e.message})`);
  }
}

if (wantJson) {
  console.log(JSON.stringify({ status: pipeline.status, url, id: pipeline.id, sha }, null, 2));
} else {
  console.log(`${pipeline.status}  ${url}`);
}
process.exit(pipeline.status === 'success' ? 0 : 1);
