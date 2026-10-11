#!/usr/bin/env node
/* qual:certify:devices — REQ-QUAL-48 real-device frame budgets (REQ-FIN-105 agent part, FIN-447).

   node scripts/qual/devices/device-farm-run.mjs --self-check
       Offline: no network, no AWS, no browser. Exercises the matrix, the
       serialised rAF probe, the gate, tagging, credential guards, the device
       bundle and the orchestrator (create → measure → teardown, including
       failure paths) against in-memory doubles. Exit 0 when every check passes.

   node scripts/qual/devices/device-farm-run.mjs [--subjects <cert-manifest.json>] [--out <file>]
       Real run, only on the AWS remote runner (tag auraglass-aws-remote, OD-11)
       with its instance role. Runs the six S1 showcases, Dialog and AppShell on
       AWS Device Farm (iPhone 13 / Safari 18 and 26, Pixel 7, Moto G Power class)
       and an EC2 mac1.metal Safari host; tags every resource attempt-id/sha/lane/ttl
       and terminates it on exit. Writes the results JSON as a job artifact only;
       human sign-off lives in docs/certification/real-device-matrix.md (FIN-H,
       REQ-FIN-112).

   Exit codes: 0 pass (measured, awaiting sign-off) · 1 fail · 2 remote-only
   (invoked off-runner) · 78 prerequisite missing (OD-11 runner / Device Farm
   project / mac host configuration). */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { SUBJECTS, TARGETS } from './lib/matrix.mjs';
import { assertInstanceRoleIdentity, createAws, newAttemptId, spawnExec } from './lib/aws.mjs';
import { createLedger, readConfig, runAll } from './lib/orchestrate.mjs';
import { resolveStories } from './lib/resolve.mjs';

const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : d;
};
const RUNNER_TAG = 'auraglass-aws-remote';
const REMOTE_CMD = 'Run the manual GitLab job qual:certify:devices on project 87152036 (runner tag auraglass-aws-remote).';

async function main() {
  if (args.includes('--help')) {
    process.stdout.write(readFileSync(new URL(import.meta.url)).toString().split('*/')[0]);
    return 0;
  }
  if (args.includes('--self-check')) {
    const { selfCheck } = await import('./lib/self-check.mjs');
    const r = await selfCheck();
    for (const c of r.checks) console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.name}${c.ok ? '' : `\n     ${c.detail}`}`);
    console.log(`device-farm-run self-check: ${r.checks.filter((c) => c.ok).length}/${r.checks.length} passed`);
    const out = opt('out');
    if (out) {
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, `${JSON.stringify({ version: 1, mode: 'self-check', ...r }, null, 2)}\n`);
    }
    return r.ok ? 0 : 1;
  }

  const env = process.env;
  if (env.CI !== 'true' && env.AG_REMOTE_RUNNER !== '1') {
    console.error(`remote-only: real-device runs never execute locally.\n${REMOTE_CMD}\nOffline verification: node scripts/qual/devices/device-farm-run.mjs --self-check`);
    return 2;
  }
  const tags = String(env.CI_RUNNER_TAGS ?? '');
  if (!tags.includes(RUNNER_TAG)) {
    console.error(`pending: not on the ${RUNNER_TAG} runner (CI_RUNNER_TAGS=${tags || '<unset>'}); registering it is owner/infra action OD-11.`);
    return 78;
  }
  const { cfg, missing } = readConfig(env);
  if (missing.length) {
    console.error(`pending: missing ${missing.join(', ')} (owner/infra: OD-11 Device Farm project + mac1.metal host configuration; OD-5 runner CA).`);
    return 78;
  }
  const aws = createAws({ exec: spawnExec(env.AG_AWS_BIN || 'aws'), env });
  const arn = assertInstanceRoleIdentity(await aws.call('sts', 'get-caller-identity'));
  console.log(`identity: ${arn}`);

  const subjectsPath = opt('subjects', 'storybook-static/cert-manifest.json');
  const resolved = resolveStories(JSON.parse(readFileSync(subjectsPath, 'utf8')), SUBJECTS);
  const ledger = createLedger(aws);
  const outPath = opt('out', '.artifacts/qual/devices/real-device-results.json');
  const onSignal = (sig, code) => async () => {
    console.error(`${sig}: tearing down ${ledger.resources.length} resource(s)`);
    await ledger.cleanup();
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, `${JSON.stringify({ version: 1, aborted: sig, resources: ledger.resources }, null, 2)}\n`);
    process.exit(code);
  };
  process.once('SIGTERM', onSignal('SIGTERM', 143));
  process.once('SIGINT', onSignal('SIGINT', 130));

  const doc = await runAll({ aws, cfg, targets: TARGETS, resolved, attemptId: newAttemptId(env), fetchImpl: globalThis.fetch, ledger, runnerTags: tags });
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(doc, null, 2)}\n`);
  for (const c of doc.cells) console.log(`${c.status.padEnd(18)} ${c.target.padEnd(22)} ${c.subject.padEnd(24)} p95=${c.p95 ?? '-'} ms budget=${c.budgetMs} ms${c.reason ? ` (${c.reason})` : ''}`);
  for (const r of doc.resources) console.log(`resource ${r.type} ${r.id}: ${r.cleanup}`);
  console.log(`verdict: ${doc.verdict.status} → ${outPath}`);
  return doc.verdict.status === 'fail' ? 1 : 0;
}

main().then(
  (code) => process.exit(code),
  (e) => {
    console.error(`device-farm-run: ${e.stack || e.message}`);
    process.exit(1);
  },
);
