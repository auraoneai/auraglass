#!/usr/bin/env node
// scripts/surf/od-evidence/ai-sdk-majors.mjs — OD-16 / C-12 evidence probe (FIN-F.3.0 (a), REQ-SURF-106).
//
// Type-checks (and runs) the ci/surf/ai-sdk harness against two AI SDK majors:
//   v5 = the current exact pins (ci/surf/ai-sdk/package.json)
//   v6 = the npm `ai-v6` dist-tag versions pinned exactly below
// Each major installs into .artifacts/surf/od-16/<major>/ (never the repo
// package.json, AC-SURF-02); ci/surf/ai-sdk/node_modules is pointed at it for
// the run. Writes .artifacts/surf/od-16/<major>.{tsc,jest}.log and summary.json
// with the real exit codes and tool output. This is a measurement for the
// owner's OD-16 C-12 decision, not a gate: it exits 0 when both measurements
// completed (whatever they found) and non-zero if a measurement could not run.
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const HARNESS = join(ROOT, 'ci', 'surf', 'ai-sdk');
const OUT = join(ROOT, '.artifacts', 'surf', 'od-16');
const base = JSON.parse(readFileSync(join(HARNESS, 'package.json'), 'utf8'));

const MAJORS = {
  v5: { ...base.dependencies },
  // npm dist-tag `ai-v6` on 2026-10-10: ai 6.0.303, @ai-sdk/react 3.0.306,
  // @ai-sdk/openai-compatible 2.0.81.
  v6: { ...base.dependencies, ai: '6.0.303', '@ai-sdk/react': '3.0.306', '@ai-sdk/openai-compatible': '2.0.81' },
};

const run = (cmd, args, log) => {
  const p = spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1e8, env: { ...process.env, CI: 'true' } });
  writeFileSync(log, `$ ${cmd} ${args.join(' ')}\n${p.stdout ?? ''}${p.stderr ?? ''}\nexit ${p.status}\n`);
  return { exitCode: p.status, out: `${p.stdout ?? ''}${p.stderr ?? ''}` };
};

mkdirSync(OUT, { recursive: true });
const summary = { generatedBy: 'scripts/surf/od-evidence/ai-sdk-majors.mjs', commit: process.env.CI_COMMIT_SHA ?? null, job: process.env.CI_JOB_URL ?? null, majors: [] };
let measurementFailed = false;

for (const [major, deps] of Object.entries(MAJORS)) {
  const dir = join(OUT, major);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ ...base, dependencies: deps }, null, 2));
  const inst = run('npm', ['install', '--prefix', relative(ROOT, dir), '--no-save', '--legacy-peer-deps', '--no-audit', '--no-fund'], join(OUT, `${major}.install.log`));
  if (inst.exitCode !== 0) { measurementFailed = true; summary.majors.push({ major, deps, install: inst.exitCode }); continue; }
  const resolved = Object.fromEntries(Object.keys(deps).map((d) => [d, JSON.parse(readFileSync(join(dir, 'node_modules', d, 'package.json'), 'utf8')).version]));
  rmSync(join(HARNESS, 'node_modules'), { force: true, recursive: true });
  symlinkSync(relative(HARNESS, join(dir, 'node_modules')), join(HARNESS, 'node_modules'));
  const tsc = run('npx', ['tsc', '-p', 'ci/surf/ai-sdk/tsconfig.json', '--pretty', 'false'], join(OUT, `${major}.tsc.log`));
  const jest = run('npx', ['jest', '-c', 'ci/surf/ai-sdk/jest.config.mjs', '--ci'], join(OUT, `${major}.jest.log`));
  const tscErrors = tsc.out.split('\n').filter((l) => /error TS\d+/.test(l));
  // Reverse direction (C-12): does this major's UIMessage tool-part state
  // union contain every AgToolSdkState (the approval states need v6)?
  // One line per AgToolSdkState member (read from src/ai/types.ts), so each
  // tsc error line maps to exactly one state the SDK major lacks. The first
  // line pins the list to the real union: it fails if the regex missed one.
  const agStates = [...readFileSync(join(ROOT, 'src', 'ai', 'types.ts'), 'utf8')
    .match(/export type AgToolSdkState =([^;]+);/)[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  const header = [
    "import type { UIMessage } from 'ai';",
    `import type { AgToolSdkState } from '${relative(dir, join(ROOT, 'src', 'ai', 'types')).replace(/\\/g, '/')}';`,
    'type SdkToolState = Extract<UIMessage["parts"][number], { type: `tool-${string}` }>["state"];',
    `export const listIsComplete: [Exclude<AgToolSdkState, ${agStates.map((s) => `'${s}'`).join(' | ')}>] extends [never] ? true : never = true;`,
  ];
  writeFileSync(join(dir, 'approval-states.probe.ts'), [
    ...header,
    ...agStates.map((s, i) => `export const state${i}: '${s}' extends SdkToolState ? true : never = true; // ${s}`),
    '',
  ].join('\n'));
  writeFileSync(join(dir, 'tsconfig.probe.json'), JSON.stringify({
    extends: relative(dir, join(HARNESS, 'tsconfig.json')).replace(/\\/g, '/'),
    compilerOptions: { types: [] },
    include: ['./approval-states.probe.ts'],
  }, null, 2));
  const probe = run('npx', ['tsc', '-p', relative(ROOT, join(dir, 'tsconfig.probe.json')), '--pretty', 'false'], join(OUT, `${major}.approval-states.log`));
  summary.majors.push({
    major,
    resolved,
    tsc: { exitCode: tsc.exitCode, errorCount: tscErrors.length, errors: tscErrors.slice(0, 40) },
    approvalStates: {
      exitCode: probe.exitCode,
      agStates,
      missingInSdk: [...probe.out.matchAll(/approval-states\.probe\.ts\((\d+),\d+\): error TS/g)]
        .map((m) => Number(m[1]) - header.length - 1)
        .map((i) => agStates[i] ?? 'listIsComplete check failed'),
    },
    approvalStatesDiagnostics: probe.out.split('\n').filter((l) => /error TS\d+/.test(l)).map((l) => l.replace(ROOT + '/', '')),
    jest: { exitCode: jest.exitCode, tally: (jest.out.match(/^Tests:.*$/m) ?? [null])[0] },
  });
}
rmSync(join(HARNESS, 'node_modules'), { force: true, recursive: true });

writeFileSync(join(OUT, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
process.exit(measurementFailed ? 1 : 0);
