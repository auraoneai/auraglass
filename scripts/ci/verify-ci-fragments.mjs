#!/usr/bin/env node
/* contract:ci-fragments (§4.13.4, G-16). Final logic.
   Asserts: root .gitlab-ci.yml parses and includes all five fragments; every fragment
   job id starts with its stream key; REQUIRED_JOBS are allow_failure:false;
   no GitHub workflow other than mirror-to-gitlab.yml exists. */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import yaml from 'yaml';

const REQUIRED_JOBS = [
  'contract:ownership', 'contract:conformance', 'contract:ci-fragments',
  'plat:gate:glass-quality', 'plat:integration:next', 'plat:integration:vite', 'plat:gate:change-class',
];
const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'];
const jobsOf = (doc) => Object.keys(doc).filter((k) => !k.startsWith('.') &&
  !['stages', 'variables', 'include', 'workflow', 'default', 'image', 'before_script', 'after_script'].includes(k));
const allowFailure = (job) => job?.allow_failure === true;

const fail = [];
if (!existsSync('.gitlab-ci.yml')) fail.push('.gitlab-ci.yml missing');
else {
  const root = yaml.parse(readFileSync('.gitlab-ci.yml', 'utf8'));
  const includes = (root.include ?? []).map((i) => (typeof i === 'string' ? i : (i.local ?? i.file ?? '')));
  const wildcard = includes.some((i) => i === 'ci/*.gitlab-ci.yml' || i === 'ci/**.gitlab-ci.yml');
  for (const s of STREAMS) {
    if (!wildcard && !includes.includes(`ci/${s}.gitlab-ci.yml`)) {
      fail.push(`root include missing ci/${s}.gitlab-ci.yml`);
    }
  }
}
for (const s of STREAMS) {
  const f = `ci/${s}.gitlab-ci.yml`;
  if (!existsSync(f)) { fail.push(`${f} missing`); continue; }
  const doc = yaml.parse(readFileSync(f, 'utf8'));
  for (const j of jobsOf(doc)) {
    if (!j.startsWith(`${s}:`) && !j.startsWith(`${s}-`) && !j.startsWith('pages')) {
      fail.push(`${f}: job '${j}' does not start with '${s}:'`);
    }
  }
}
const allDocs = ['.gitlab-ci.yml', ...STREAMS.map((s) => `ci/${s}.gitlab-ci.yml`)].filter(existsSync);
const allJobs = Object.assign({}, ...allDocs.map((f) => jobsOf(yaml.parse(readFileSync(f, 'utf8')))
  .map((j) => [j, yaml.parse(readFileSync(f, 'utf8'))[j]])).flat());
for (const j of REQUIRED_JOBS) {
  if (allJobs[j] && allowFailure(allJobs[j])) fail.push(`required job '${j}' must not be allow_failure:true`);
}
const wf = '.github/workflows';
if (existsSync(wf)) {
  for (const f of readdirSync(wf)) {
    if (f !== 'mirror-to-gitlab.yml') fail.push(`.github/workflows/${f} must not exist (G-16)`);
  }
}
if (fail.length) { console.error('contract:ci-fragments FAIL:\n' + fail.join('\n')); process.exit(1); }
console.log('contract:ci-fragments OK');
