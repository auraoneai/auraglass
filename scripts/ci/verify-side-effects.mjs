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

const declared = async () => {
  const rows = [];
  for (const { value } of await loadFragments('side-effects', ROOT)) {
    for (const row of value ?? []) rows.push(row);
  }
  /* REQ-PLAT-70: exceptions are {module, api} pairs — a module exception no
     longer whitelists every api it touches. Rows may also carry optionalPeers
     (api allowed only when the peer import was attempted) and expires (semver
     floor at which the exception lapses). */
  const expired = rows.filter(r => r.expires && r.expires < process.env.AG_VERSION);
  const pairs = new Set(rows.filter(r => r.api).map(r => `${r.module}|${r.api}`));
  const modules = new Set(rows.filter(r => !r.api).map(r => r.module));
  return { allowed: (c) => pairs.has(`${c.module}|${c.api}`) || modules.has(c.module), modules, pairs, expired };
};

export async function run() {
  if (!existsSync(DIST)) { console.error('verify-side-effects: dist/ missing — build first'); return 1; }
  const { allowed, modules, expired } = await declared();
  if (expired.length) console.error(`verify-side-effects: ${expired.length} exception(s) past their expiry version`);
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
    JSON.stringify({ observed, allowed: [...modules], violations: bad.map(b => b.module), generatedAt: new Date().toISOString() }, null, 2));
  if (bad.length || expired.length) {
    for (const b of bad.slice(0, 20)) console.error(`verify-side-effects: undeclared ${b.api} in ${b.module}`);
    console.error(`verify-side-effects: ${bad.length} undeclared call(s), ${expired.length} expired exception(s)`);
    return 1;
  }
  console.log(`verify-side-effects: ${observed.length} recorded call(s), all declared (${modules.size} exception(s) loaded)`);
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(await run());
