#!/usr/bin/env node
/* REQ-QUAL-56 (REQ-FIN-106, FIN-452): the dist-backed Storybook build run by qual:build:storybook.
   Usage: node scripts/storybook/build.mjs [--report <dir>]   (output: storybook-static/, the npm script's fixed -o)

   1. dist/: taken from the plat:build:dist artifact (optional need). When any runtime package export
      (`exports[*].default`) is absent, runs `npm run build` (S-52) first, so the build never waits on a PLAT job;
      fails if the exports are still absent afterwards.
   2. Runs `npm run storybook:build` with AG_STORYBOOK_DIST=1 (library resolved through package exports to dist/)
      and AG_STORYBOOK_RESOLUTION_REPORT=<report>/resolution.json, teeing output to <report>/storybook-build.log.
   3. Writes <report>/storybook-build.json = { distSource, durationMs, exitCode } for check-build-log.mjs.
   <report> defaults to $AURAGLASS_EVIDENCE_DIR/qual/$CI_JOB_NAME_SLUG (or .artifacts/qual/storybook-build). */
import { spawn, spawnSync } from 'node:child_process';
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib/storybook-build.mjs';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');

export function defaultReportDir(env = process.env) {
  return join(env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts', 'qual', env.CI_JOB_NAME_SLUG ?? 'storybook-build');
}

/** Runtime export targets (`default` condition) missing under `root`. */
export function missingRuntimeExports(root) {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  return Object.entries(pkg.exports ?? {})
    .map(([key, v]) => [key, typeof v === 'string' ? null : v.default])
    .filter(([, file]) => typeof file === 'string' && file.startsWith('./dist/'))
    .filter(([, file]) => !existsSync(join(root, file)))
    .map(([key, file]) => `${key} → ${file}`);
}

/** Ensures dist/ carries every runtime export; returns 'artifact' or 'built'. `runBuild` is injectable for tests. */
export function ensureDist(root, runBuild = () => spawnSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' }).status ?? 1) {
  const before = missingRuntimeExports(root);
  if (before.length === 0) return 'artifact';
  console.log(`storybook-build: dist/ lacks ${before.length} runtime export(s) (${before.slice(0, 5).join(', ')}${before.length > 5 ? ', …' : ''}); running npm run build`);
  const status = runBuild();
  if (status !== 0) throw new Error(`npm run build exited ${status}`);
  const after = missingRuntimeExports(root);
  if (after.length) throw new Error(`dist/ still lacks runtime exports after npm run build: ${after.join(', ')}`);
  return 'built';
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  const args = parseArgs(argv);
  const out = 'storybook-static';
  const reportDir = resolve(String(args.report ?? defaultReportDir(env)));
  mkdirSync(reportDir, { recursive: true });
  const distSource = ensureDist(ROOT);
  const log = createWriteStream(join(reportDir, 'storybook-build.log'));
  const started = Date.now();
  const child = spawn('npm', ['run', 'storybook:build'], {
    cwd: ROOT,
    env: { ...env, AG_STORYBOOK_DIST: '1', AG_STORYBOOK_RESOLUTION_REPORT: join(reportDir, 'resolution.json'), STORYBOOK_DISABLE_TELEMETRY: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.on('data', (d) => { process.stdout.write(d); log.write(d); });
  child.stderr.on('data', (d) => { process.stderr.write(d); log.write(d); });
  const exitCode = await new Promise((r) => child.on('close', (code) => r(code ?? 1)));
  await new Promise((r) => log.end(r));
  const durationMs = Date.now() - started;
  writeFileSync(join(reportDir, 'storybook-build.json'), JSON.stringify({ version: 1, out, distSource, durationMs, exitCode }, null, 2) + '\n');
  console.log(`storybook-build: exit ${exitCode} in ${(durationMs / 1000).toFixed(1)} s (dist from ${distSource}); report ${reportDir}`);
  return exitCode;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then((code) => process.exit(code), (e) => { console.error(`storybook-build: ${e.message}`); process.exit(1); });
}
