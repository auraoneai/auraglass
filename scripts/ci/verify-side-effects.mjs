#!/usr/bin/env node
/* PLAT-263: import every emitted JS module in a fresh jsdom realm and record
   every call into a watched API whose stack frames include aura-glass dist/.
   Anything not declared by loadFragments('side-effects') (PLAT row: empty)
   fails the gate. */
import { spawnSync } from 'node:child_process';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFragments } from '../../src/contracts/load-fragments.mjs';
import { DIST, ROOT, walk } from '../build/lib/graph.mjs';

const TRAP = join(dirname(fileURLToPath(import.meta.url)), '../../tests/side-effects/trap.mjs');
const TRAP_NODE = join(dirname(fileURLToPath(import.meta.url)), '../../tests/side-effects/trap-node.mjs');

/* Minimal semver compare (REQ-PLAT-70): numeric x.y.z with prerelease
   ordering (a prerelease sorts before its release). Returns -1/0/1, or null
   when either side is not a parseable version. */
export const parseSemver = (v) => {
  const m = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+.*)?$/.exec(String(v ?? '').trim());
  return m ? { core: [Number(m[1]), Number(m[2]), Number(m[3])], pre: m[4] ?? null } : null;
};
export const semverCompare = (a, b) => {
  const pa = parseSemver(a);
  const pb = parseSemver(b);
  if (!pa || !pb) return null;
  for (let i = 0; i < 3; i++) if (pa.core[i] !== pb.core[i]) return pa.core[i] < pb.core[i] ? -1 : 1;
  if (pa.pre === pb.pre) return 0;
  if (pa.pre === null) return 1;
  if (pb.pre === null) return -1;
  return pa.pre < pb.pre ? -1 : 1;
};

/* REQ-PLAT-70: exceptions are {module, api} pairs only — a module-only row
   whitelisted every api it touched and is now an invalid exception. A row is
   expired once AG_VERSION is semver-greater than its `expires` version. */
export function exceptionState(rows, version) {
  const pairs = new Set();
  const invalid = [];
  const expired = [];
  for (const r of rows) {
    if (!r.module || !r.api) { invalid.push(r); continue; }
    if (r.expires) {
      const cmp = semverCompare(r.expires, version);
      if (cmp === null) { invalid.push(r); continue; }
      if (cmp < 0) { expired.push(r); continue; }
    }
    pairs.add(`${r.module}|${r.api}`);
  }
  return { pairs, invalid, expired, allowed: (c) => pairs.has(`${c.module}|${c.api}`) };
}

const declared = async () => {
  const rows = [];
  for (const { value } of await loadFragments('side-effects', ROOT)) {
    for (const row of value ?? []) rows.push(row);
  }
  return exceptionState(rows, process.env.AG_VERSION);
};

export async function run() {
  if (!existsSync(DIST)) { console.error('verify-side-effects: dist/ missing — build first'); return 1; }
  const { allowed, pairs, expired, invalid } = await declared();
  if (expired.length) console.error(`verify-side-effects: ${expired.length} exception(s) past their expiry version`);
  for (const r of invalid) console.error(`verify-side-effects: invalid exception (needs {module, api} and a semver expires): ${JSON.stringify(r)}`);
  const calls = spawnSync(process.execPath, [TRAP], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 });
  if (calls.status !== 0) { console.error(calls.stderr || calls.stdout); return 1; }
  const observed = JSON.parse(calls.stdout.trim().split('\n').pop() ?? '[]');
  /* REQ-PLAT-70: the Node realm trap covers what jsdom can't — timers, fs
     writes, child processes, process listeners, workers, sockets. */
  const callsNode = spawnSync(process.execPath, [TRAP_NODE], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 });
  if (callsNode.status !== 0) { console.error(callsNode.stderr || callsNode.stdout); return 1; }
  observed.push(...JSON.parse(callsNode.stdout.trim().split('\n').pop() ?? '[]'));
  const bad = observed.filter(c => !allowed(c));
  mkdirSync(join(ROOT, '.artifacts', 'plat'), { recursive: true });
  writeFileSync(join(ROOT, '.artifacts', 'plat', 'side-effects.json'),
    JSON.stringify({ observed, allowed: [...pairs], violations: bad.map(b => b.module), generatedAt: new Date().toISOString() }, null, 2));
  if (bad.length || expired.length || invalid.length) {
    for (const b of bad.slice(0, 20)) console.error(`verify-side-effects: undeclared ${b.api} in ${b.module}`);
    console.error(`verify-side-effects: ${bad.length} undeclared call(s), ${expired.length} expired exception(s), ${invalid.length} invalid exception(s)`);
    return 1;
  }
  console.log(`verify-side-effects: ${observed.length} recorded call(s), all declared (${pairs.size} exception(s) loaded)`);
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) run().then((code) => process.exit(code));
