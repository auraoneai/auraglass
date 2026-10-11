#!/usr/bin/env node
/* certification/run.mjs — QUAL lane runner CLI (REQ-QUAL-05, -06; LANE_COMMAND, S-43).
   Usage: node certification/run.mjs --lane <L1..L12|all> --scope <pr|main|nightly|release> [--verdict <path>] [--line 4x]

   The implementation is packages/qa/src/evidence/laneRunner.ts (unit-tested under jest.qual.config.js); this
   file compiles it with esbuild (dependencies stay external, resolved from node_modules) and runs it.
   Exit codes: 0 no blocking failure · 1 blocking failure (fail closed, REQ-QUAL-06) · 2 invoked outside a remote
   runner (machine policy; prints the remote command) · 64 usage error.
   Writes $AURAGLASS_EVIDENCE_DIR/qual/<job-slug>/lane-manifest.json (validated against
   certification/schemas/lane-manifest.schema.json before exit). */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function loadRunner() {
  const { build } = await import('esbuild');
  const res = await build({
    entryPoints: [join(ROOT, 'packages/qa/src/evidence/laneRunner.ts')],
    bundle: true, write: false, format: 'esm', platform: 'node', packages: 'external', logLevel: 'silent',
  });
  const out = join(ROOT, 'node_modules/.cache/auraglass-qa/lane-runner.mjs');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, res.outputFiles[0].text);
  return import(`${pathToFileURL(out).href}?t=${Date.now()}`);
}

try {
  const { runLanes, EXIT } = await loadRunner();
  const { code } = await runLanes(process.argv.slice(2), { root: ROOT, env: process.env });
  process.exit(code ?? EXIT.fail);
} catch (e) {
  console.error(`run.mjs: lane runner crashed: ${e?.stack ?? e}`);
  process.exit(1);
}
