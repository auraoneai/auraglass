#!/usr/bin/env node
/* scripts/release/train-record.mjs — REQ-FIN-45 / REQ-PLAT-36 (FIN-C.3 C.3-15).
   Fills one docs/release/train-checklist.json stop's `record` from the tag
   pipeline that cuts it. The row is written by the job, never by hand:

     node scripts/release/train-record.mjs --tag "$CI_COMMIT_TAG" \
       --needs plat:gate:change-class,plat:tag:release-ledger \
       --out .artifacts/plat/train-checklist.json

   Every gate string of the stop must have exactly one `recordInputs` entry:
     { gate, job }                       pass when <job> is in --needs: the
                                         record job only starts after every
                                         job it `needs` succeeded;
     { gate, job, artifact, mustContain } additionally the artifact (from
                                         that job, via `needs: artifacts`)
                                         exists and contains <mustContain>;
     { gate, job, artifact, changeClassTarget } the change-class.json
                                         artifact's class is allowed on the
                                         target with no classifier errors;
     { gate, decision, row, passWhen }   the decision record's `| <row> |
                                         <status> |` row matches /passWhen/i
                                         (owner-filled; never edited here).
   Exit 0 = every gate passes, 1 = a gate fails or the input is inconsistent
   (the record is still written, status `gates-red`), 2 = not in CI. */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { allowedOn } from './lib/policy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
export const CHECKLIST = 'docs/release/train-checklist.json';
export const JOB = 'plat:release:train-record';

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Stop whose id the tag names: `v4.1.1` → `4.1.1`; `v5.0.0-alpha.3` →
 *  `5.0.0-alpha.N` (a literal `N` segment matches a number). */
export function stopForTag(checklist, tag) {
  const version = String(tag ?? '').replace(/^v/, '');
  return checklist.stops.find((s) => new RegExp(
    `^${s.id.split('N').map(esc).join('\\d+')}$`).test(version)) ?? null;
}

/** `| <row> | <status> |` in a markdown decision record → status text. */
export function decisionRowStatus(text, row) {
  const m = String(text).match(new RegExp(`^\\|\\s*${esc(row)}\\s*\\|\\s*([^|]*?)\\s*\\|`, 'm'));
  return m ? m[1] : null;
}

/** change-class.json (classify-change.mjs) → allowed on <target>? Mirrors the
 *  classifier's own target rule, so the verdict does not depend on which
 *  `--target` the change-class job was run with: no classifier errors, and the
 *  class is allowed on the target — on `4x-patch` a C-D made only of
 *  exception entries is allowed too. */
export function changeClassVerdict(text, target) {
  let r;
  try { r = JSON.parse(text); } catch { return { ok: false, why: 'change-class.json is not JSON' }; }
  if (!r || typeof r.class !== 'string') return { ok: false, why: 'change-class.json has no class' };
  const errors = Array.isArray(r.errors) ? r.errors : ['errors field missing'];
  const exceptionOnly = target === '4x-patch' && r.class === 'C-D'
    && Array.isArray(r.deprecationsAdded) && r.deprecationsAdded.every((e) => e && e.exception);
  const allowed = exceptionOnly || allowedOn(r.class, target);
  const ok = allowed && errors.length === 0;
  return { ok, why: `class ${r.class} on ${target}: ${allowed ? 'allowed' : 'not allowed'}`
    + `${errors.length ? `; ${errors.length} classifier error(s)` : ''}` };
}

/** Pure: evaluate a stop's gates. `readFile(path)` returns text or null. */
export function evaluateStop({ stop, needs = [], readFile, env = {}, version, now = new Date() }) {
  const failures = [];
  const inputs = stop.recordInputs ?? [];
  for (const g of stop.gates) {
    const n = inputs.filter((i) => i.gate === g).length;
    if (n !== 1) failures.push(`gate '${g}' has ${n} recordInputs entries (need exactly 1)`);
  }
  for (const i of inputs) {
    if (!stop.gates.includes(i.gate)) failures.push(`recordInputs entry for unknown gate '${i.gate}'`);
  }
  const gates = inputs.filter((i) => stop.gates.includes(i.gate)).map((i) => {
    if (i.decision) {
      const text = readFile(i.decision);
      const status = text == null ? null : decisionRowStatus(text, i.row);
      const ok = status != null && new RegExp(i.passWhen, 'i').test(status);
      return { gate: i.gate, status: ok ? 'pass' : 'fail', decision: i.decision, row: i.row,
        evidence: status == null ? `row '${i.row}' not found in ${i.decision}` : `${i.decision}: ${status}` };
    }
    if (!needs.includes(i.job)) {
      return { gate: i.gate, status: 'fail', job: i.job, evidence: `${i.job} is not in this job's needs` };
    }
    if (i.artifact && i.changeClassTarget) {
      const text = readFile(i.artifact);
      const v = text == null ? null : changeClassVerdict(text, i.changeClassTarget);
      return { gate: i.gate, status: v?.ok ? 'pass' : 'fail', job: i.job, artifact: i.artifact,
        evidence: v == null ? `${i.artifact} missing` : `${env.CI_PIPELINE_URL} ${i.job}: ${v.why}` };
    }
    if (i.artifact) {
      const text = readFile(i.artifact);
      const ok = text != null && (!i.mustContain || text.includes(i.mustContain));
      return { gate: i.gate, status: ok ? 'pass' : 'fail', job: i.job, artifact: i.artifact,
        evidence: text == null ? `${i.artifact} missing` : ok ? `${env.CI_PIPELINE_URL} ${i.job}: ${i.artifact}`
          : `${i.artifact} lacks '${i.mustContain}'` };
    }
    return { gate: i.gate, status: 'pass', job: i.job, evidence: `${env.CI_PIPELINE_URL} ${i.job}: success (needs)` };
  });
  const tagVersion = String(env.CI_COMMIT_TAG ?? '').replace(/^v/, '');
  if (version !== tagVersion) failures.push(`package.json version ${version} != tag ${env.CI_COMMIT_TAG}`);
  for (const g of gates) if (g.status !== 'pass') failures.push(`gate '${g.gate}': ${g.evidence}`);
  const record = {
    tag: env.CI_COMMIT_TAG, version, sha: env.CI_COMMIT_SHA,
    pipelineUrl: env.CI_PIPELINE_URL, jobUrl: env.CI_JOB_URL ?? null,
    recordedAt: now.toISOString(),
    status: failures.length ? 'gates-red' : 'gates-green',
    gates, failures,
  };
  return { record, failures };
}

export const serialize = (checklist) => `${JSON.stringify(checklist, null, 2)}\n`;

export function main(argv = process.argv.slice(2), { root = ROOT, env = process.env } = {}) {
  const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
  if (!env.CI_PIPELINE_URL || !env.CI_COMMIT_SHA) {
    console.error(`train-record: remote only — runs as ${JOB} in the tag pipeline `
      + '(CI_PIPELINE_URL/CI_COMMIT_SHA unset). Nothing written.');
    return 2;
  }
  const tag = arg('--tag', env.CI_COMMIT_TAG);
  const abs = (p) => (isAbsolute(p) ? p : join(root, p));
  const checklistPath = abs(arg('--checklist', CHECKLIST));
  const out = abs(arg('--out', '.artifacts/plat/train-checklist.json'));
  const needs = String(arg('--needs', '')).split(',').map((s) => s.trim()).filter(Boolean);
  const checklist = JSON.parse(readFileSync(checklistPath, 'utf8'));
  const stop = stopForTag(checklist, tag);
  if (!stop) { console.error(`FAIL train-record: no train stop matches tag '${tag}'`); return 1; }
  const version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
  const readFile = (p) => (existsSync(abs(p)) ? readFileSync(abs(p), 'utf8') : null);
  const { record, failures } = evaluateStop({ stop, needs, readFile,
    env: { ...env, CI_COMMIT_TAG: tag }, version });
  stop.record = record;
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, serialize(checklist));
  console.log(`train-record: ${stop.id} ${record.status} → ${out}`);
  for (const f of failures) console.error(`FAIL train-record: ${f}`);
  return failures.length ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try { process.exit(main()); } catch (e) { console.error(e); process.exit(1); }
}
